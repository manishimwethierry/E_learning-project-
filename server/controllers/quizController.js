const pool = require('../config/db');

// Teacher: Create Quiz
exports.createQuiz = async (req, res) => {
    try {
        const { moduleId, title, description, totalQuestions, passingScore, questions } = req.body;
        const teacherId = req.userId;

        if (!moduleId || !title || !questions || questions.length === 0) {
            return res.status(400).json({ message: 'Module ID, title, and questions are required' });
        }

        const connection = await pool.getConnection();

        // Verify module exists and belongs to teacher
        const [modules] = await connection.query(
            'SELECT id FROM modules WHERE id = ? AND teacherId = ?',
            [moduleId, teacherId]
        );

        if (modules.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Module not found or unauthorized' });
        }

        // Create quiz
        const [quizResult] = await connection.query(
            'INSERT INTO quizzes (moduleId, teacherId, title, description, totalQuestions, passingScore) VALUES (?, ?, ?, ?, ?, ?)',
            [moduleId, teacherId, title, description, totalQuestions, passingScore || 60]
        );

        const quizId = quizResult.insertId;

        // Insert questions
        const questionValues = questions.map((q, index) => [
            quizId,
            index + 1,
            q.questionText,
            q.optionA,
            q.optionB,
            q.optionC,
            q.optionD,
            q.correctAnswer
        ]);

        await connection.query(
            'INSERT INTO quiz_questions (quizId, questionNumber, questionText, optionA, optionB, optionC, optionD, correctAnswer) VALUES ?',
            [questionValues]
        );

        connection.release();

        res.status(201).json({
            message: 'Quiz created successfully',
            quizId: quizId,
            quiz: { id: quizId, title, moduleId, totalQuestions }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get quiz details with questions
exports.getQuizDetail = async (req, res) => {
    try {
        const { quizId } = req.params;
        const connection = await pool.getConnection();

        const [quizzes] = await connection.query(
            'SELECT id, title, description, totalQuestions, passingScore FROM quizzes WHERE id = ?',
            [quizId]
        );

        if (quizzes.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const [questions] = await connection.query(
            'SELECT id, questionNumber, questionText, optionA, optionB, optionC, optionD FROM quiz_questions WHERE quizId = ? ORDER BY questionNumber',
            [quizId]
        );

        connection.release();

        res.json({
            ...quizzes[0],
            questions: questions
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Student: Submit Quiz Answers
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const studentId = req.userId;

        if (!quizId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Quiz ID and answers array are required' });
        }

        const connection = await pool.getConnection();

        // Get quiz details
        const [quizzes] = await connection.query(
            'SELECT id, totalQuestions, passingScore, moduleId FROM quizzes WHERE id = ?',
            [quizId]
        );

        if (quizzes.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const quiz = quizzes[0];
        const [questions] = await connection.query(
            'SELECT id, correctAnswer FROM quiz_questions WHERE quizId = ? ORDER BY questionNumber',
            [quizId]
        );

        // Calculate score
        let correctCount = 0;
        const studentAnswersData = [];

        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            if (i < questions.length) {
                const isCorrect = answer === questions[i].correctAnswer;
                if (isCorrect) correctCount++;
                studentAnswersData.push({
                    questionId: questions[i].id,
                    selectedAnswer: answer,
                    isCorrect: isCorrect ? 1 : 0
                });
            }
        }

        const percentage = Math.round((correctCount / quiz.totalQuestions) * 100);
        const isPassed = percentage >= quiz.passingScore;

        // Save quiz attempt
        const [attemptResult] = await connection.query(
            'INSERT INTO quiz_attempts (quizId, studentId, score, totalQuestions, percentage, isPassed) VALUES (?, ?, ?, ?, ?, ?)',
            [quizId, studentId, correctCount, quiz.totalQuestions, percentage, isPassed ? 1 : 0]
        );

        const attemptId = attemptResult.insertId;

        // Save student answers
        const answersWithAttemptId = studentAnswersData.map(ans => [
            attemptId,
            ans.questionId,
            ans.selectedAnswer,
            ans.isCorrect
        ]);

        await connection.query(
            'INSERT INTO student_answers (quizAttemptId, questionId, selectedAnswer, isCorrect) VALUES ?',
            [answersWithAttemptId]
        );

        connection.release();

        res.json({
            message: 'Quiz submitted successfully',
            attemptId: attemptId,
            score: correctCount,
            totalQuestions: quiz.totalQuestions,
            percentage: percentage,
            isPassed: isPassed,
            feedback: isPassed ? 'Congratulations! You passed the quiz.' : 'Please review the material and try again.'
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get quiz attempt results
exports.getQuizResult = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const studentId = req.userId;
        const connection = await pool.getConnection();

        const [attempts] = await connection.query(
            'SELECT * FROM quiz_attempts WHERE id = ? AND studentId = ?',
            [attemptId, studentId]
        );

        if (attempts.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Attempt not found' });
        }

        const [answers] = await connection.query(
            `SELECT sa.*, qq.correctAnswer, qq.questionText, qq.optionA, qq.optionB, qq.optionC, qq.optionD
             FROM student_answers sa
             JOIN quiz_questions qq ON sa.questionId = qq.id
             WHERE sa.quizAttemptId = ?`,
            [attemptId]
        );

        connection.release();

        res.json({
            attempt: attempts[0],
            answers: answers
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all quiz attempts for a student
exports.getStudentQuizAttempts = async (req, res) => {
    try {
        const studentId = req.userId;
        const connection = await pool.getConnection();

        const [attempts] = await connection.query(
            `SELECT qa.*, q.title, q.moduleId, m.title as moduleName
             FROM quiz_attempts qa
             JOIN quizzes q ON qa.quizId = q.id
             JOIN modules m ON q.moduleId = m.id
             WHERE qa.studentId = ?
             ORDER BY qa.submittedAt DESC`,
            [studentId]
        );

        connection.release();
        res.json(attempts);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Teacher: Get quiz results for all students
exports.getQuizResults = async (req, res) => {
    try {
        const { quizId } = req.params;
        const teacherId = req.userId;
        const connection = await pool.getConnection();

        // Verify quiz belongs to teacher
        const [quizzes] = await connection.query(
            'SELECT id FROM quizzes WHERE id = ? AND teacherId = ?',
            [quizId, teacherId]
        );

        if (quizzes.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Quiz not found or unauthorized' });
        }

        const [results] = await connection.query(
            `SELECT qa.id, qa.studentId, u.firstName, u.lastName, u.email, qa.score, qa.totalQuestions, qa.percentage, qa.isPassed, qa.submittedAt
             FROM quiz_attempts qa
             JOIN users u ON qa.studentId = u.id
             WHERE qa.quizId = ?
             ORDER BY qa.submittedAt DESC`,
            [quizId]
        );

        connection.release();
        res.json(results);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};