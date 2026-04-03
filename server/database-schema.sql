-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    role ENUM('teacher', 'student') NOT NULL DEFAULT 'student',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Modules Table (uploaded by teachers)
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacherId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    fileUrl VARCHAR(500),
    videoUrl VARCHAR(500),
    fileType ENUM('pdf', 'video', 'document', 'other') DEFAULT 'other',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacherId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Student Modules (tracks enrollment and progress)
CREATE TABLE IF NOT EXISTS student_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    moduleId INT NOT NULL,
    progress INT DEFAULT 0,
    isCompleted BOOLEAN DEFAULT FALSE,
    timeSpent INT DEFAULT 0,
    viewedAt TIMESTAMP,
    completedAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_module (studentId, moduleId),
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moduleId) REFERENCES modules(id) ON DELETE CASCADE
);

-- Create Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    moduleId INT NOT NULL,
    teacherId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    totalQuestions INT NOT NULL,
    passingScore INT DEFAULT 60,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (moduleId) REFERENCES modules(id) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Quiz Questions Table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quizId INT NOT NULL,
    questionNumber INT NOT NULL,
    questionText VARCHAR(500) NOT NULL,
    optionA VARCHAR(255),
    optionB VARCHAR(255),
    optionC VARCHAR(255),
    optionD VARCHAR(255),
    correctAnswer ENUM('A', 'B', 'C', 'D') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Create Quiz Attempts Table (student quiz submissions)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quizId INT NOT NULL,
    studentId INT NOT NULL,
    score INT,
    totalQuestions INT,
    percentage DECIMAL(5, 2),
    isPassed BOOLEAN DEFAULT FALSE,
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Student Answers Table
CREATE TABLE IF NOT EXISTS student_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quizAttemptId INT NOT NULL,
    questionId INT NOT NULL,
    selectedAnswer ENUM('A', 'B', 'C', 'D'),
    isCorrect BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (quizAttemptId) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (questionId) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- Create Indexes for better query performance
CREATE INDEX idx_modules_teacherId ON modules(teacherId);
CREATE INDEX idx_student_modules_studentId ON student_modules(studentId);
CREATE INDEX idx_student_modules_moduleId ON student_modules(moduleId);
CREATE INDEX idx_quizzes_moduleId ON quizzes(moduleId);
CREATE INDEX idx_quizzes_teacherId ON quizzes(teacherId);
CREATE INDEX idx_quiz_questions_quizId ON quiz_questions(quizId);
CREATE INDEX idx_quiz_attempts_quizId ON quiz_attempts(quizId);
CREATE INDEX idx_quiz_attempts_studentId ON quiz_attempts(studentId);