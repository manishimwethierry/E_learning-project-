const pool = require('../config/db');

// Student: Get overall progress
exports.getStudentProgress = async (req, res) => {
    try {
        const studentId = req.userId;
        const connection = await pool.getConnection();

        // Overall progress
        const [progressData] = await connection.query(
            `SELECT 
                COUNT(*) as totalModules,
                SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) as completedModules,
                ROUND(AVG(progress)) as averageProgress
             FROM student_modules
             WHERE studentId = ?`,
            [studentId]
        );

        // Per-module progress
        const [moduleProgress] = await connection.query(
            `SELECT m.id, m.title, sm.progress, sm.isCompleted, sm.completedAt
             FROM student_modules sm
             JOIN modules m ON sm.moduleId = m.id
             WHERE sm.studentId = ?
             ORDER BY m.createdAt DESC`,
            [studentId]
        );

        connection.release();

        const data = progressData[0];
        const overallPercentage = data.totalModules > 0 
            ? Math.round((data.completedModules / data.totalModules) * 100)
            : 0;

        res.json({
            overall: {
                totalModules: data.totalModules,
                completedModules: data.completedModules,
                averageProgress: data.averageProgress || 0,
                overallPercentage: overallPercentage
            },
            modules: moduleProgress
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Teacher: Get course progress for all students
exports.getCourseProgressReport = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const teacherId = req.userId;
        const connection = await pool.getConnection();

        // Verify module belongs to teacher
        const [modules] = await connection.query(
            'SELECT id FROM modules WHERE id = ? AND teacherId = ?',
            [moduleId, teacherId]
        );

        if (modules.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Module not found or unauthorized' });
        }

        const [progressReport] = await connection.query(
            `SELECT 
                u.id, 
                u.firstName, 
                u.lastName, 
                u.email,
                sm.progress,
                sm.isCompleted,
                sm.completedAt,
                COUNT(qa.id) as quizzesTaken,
                ROUND(AVG(qa.percentage)) as averageQuizScore
             FROM users u
             JOIN student_modules sm ON u.id = sm.studentId
             LEFT JOIN quizzes q ON ? = q.moduleId
             LEFT JOIN quiz_attempts qa ON q.id = qa.quizId AND u.id = qa.studentId
             WHERE sm.moduleId = ? AND u.role = 'student'
             GROUP BY u.id, u.firstName, u.lastName, u.email, sm.progress, sm.isCompleted, sm.completedAt
             ORDER BY sm.progress DESC`,
            [moduleId, moduleId]
        );

        connection.release();
        res.json(progressReport);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Teacher: Get classroom statistics
exports.getClassroomStats = async (req, res) => {
    try {
        const teacherId = req.userId;
        const connection = await pool.getConnection();

        // Total students
        const [studentStats] = await connection.query(
            `SELECT COUNT(DISTINCT sm.studentId) as totalStudents
             FROM student_modules sm
             JOIN modules m ON sm.moduleId = m.id
             WHERE m.teacherId = ?`,
            [teacherId]
        );

        // Module statistics
        const [moduleStats] = await connection.query(
            `SELECT 
                m.id,
                m.title,
                COUNT(DISTINCT sm.studentId) as enrolledStudents,
                SUM(CASE WHEN sm.isCompleted = 1 THEN 1 ELSE 0 END) as completedStudents,
                ROUND(AVG(sm.progress)) as averageProgress
             FROM modules m
             LEFT JOIN student_modules sm ON m.id = sm.moduleId
             WHERE m.teacherId = ?
             GROUP BY m.id, m.title
             ORDER BY m.createdAt DESC`,
            [teacherId]
        );

        // Quiz statistics
        const [quizStats] = await connection.query(
            `SELECT 
                q.id,
                q.title,
                q.moduleId,
                COUNT(DISTINCT qa.studentId) as studentsTaken,
                ROUND(AVG(qa.percentage)) as averageScore,
                SUM(CASE WHEN qa.isPassed = 1 THEN 1 ELSE 0 END) as passedCount
             FROM quizzes q
             LEFT JOIN quiz_attempts qa ON q.id = qa.quizId
             WHERE q.teacherId = ?
             GROUP BY q.id, q.title, q.moduleId
             ORDER BY q.createdAt DESC`,
            [teacherId]
        );

        connection.release();

        res.json({
            totalStudents: studentStats[0].totalStudents,
            modules: moduleStats,
            quizzes: quizStats
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};