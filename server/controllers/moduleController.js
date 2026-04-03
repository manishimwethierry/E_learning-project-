const pool = require('../config/db');
exports.createModule = async (req, res) => {
    try {
        const { title, description, fileUrl, videoUrl, fileType } = req.body;
        const teacherId = req.userId;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO modules (teacherId, title, description, fileUrl, videoUrl, fileType) VALUES (?, ?, ?, ?, ?, ?)',
            [teacherId, title, description, fileUrl, videoUrl, fileType]
        );

        connection.release();

        res.status(201).json({
            message: 'Module created successfully',
            moduleId: result.insertId,
            module: { id: result.insertId, title, description, fileType }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all modules created by a teacher
exports.getTeacherModules = async (req, res) => {
    try {
        const teacherId = req.userId;
        const connection = await pool.getConnection();

        const [modules] = await connection.query(
            'SELECT id, title, description, fileType, createdAt FROM modules WHERE teacherId = ? ORDER BY createdAt DESC',
            [teacherId]
        );

        connection.release();
        res.json(modules);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get module details
exports.getModuleDetail = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const connection = await pool.getConnection();

        const [modules] = await connection.query(
            'SELECT m.*, u.firstName, u.lastName FROM modules m JOIN users u ON m.teacherId = u.id WHERE m.id = ?',
            [moduleId]
        );

        connection.release();

        if (modules.length === 0) {
            return res.status(404).json({ message: 'Module not found' });
        }

        res.json(modules[0]);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Student: Get assigned modules
exports.getStudentModules = async (req, res) => {
    try {
        const studentId = req.userId;
        const connection = await pool.getConnection();

        const [modules] = await connection.query(
            `SELECT m.*, sm.progress, sm.isCompleted, sm.completedAt
             FROM student_modules sm
             JOIN modules m ON sm.moduleId = m.id
             WHERE sm.studentId = ?
             ORDER BY m.createdAt DESC`,
            [studentId]
        );

        connection.release();
        res.json(modules);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Assign module to students
exports.assignModuleToStudents = async (req, res) => {
    try {
        const { moduleId, studentIds } = req.body;

        if (!moduleId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ message: 'Module ID and Student IDs array are required' });
        }

        const connection = await pool.getConnection();

        // Check if module exists and belongs to teacher
        const [modules] = await connection.query(
            'SELECT id FROM modules WHERE id = ? AND teacherId = ?',
            [moduleId, req.userId]
        );

        if (modules.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Module not found or unauthorized' });
        }

        // Insert student module enrollments
        const values = studentIds.map(studentId => [studentId, moduleId]);
        await connection.query(
            'INSERT IGNORE INTO student_modules (studentId, moduleId, progress) VALUES ?',
            [values]
        );

        connection.release();

        res.json({
            message: `Module assigned to ${studentIds.length} students`,
            assignedCount: studentIds.length
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update student module progress
exports.updateModuleProgress = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { progress, isCompleted } = req.body;
        const studentId = req.userId;

        if (progress === undefined || !Number.isInteger(progress) || progress < 0 || progress > 100) {
            return res.status(400).json({ message: 'Progress must be an integer between 0 and 100' });
        }

        const connection = await pool.getConnection();

        const completedAt = isCompleted ? new Date() : null;

        const [result] = await connection.query(
            'UPDATE student_modules SET progress = ?, isCompleted = ?, completedAt = ? WHERE studentId = ? AND moduleId = ?',
            [progress, isCompleted ? 1 : 0, completedAt, studentId, moduleId]
        );

        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Module enrollment not found' });
        }

        res.json({
            message: 'Progress updated successfully',
            progress: progress,
            isCompleted: isCompleted
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get teacher's student list
exports.getTeacherStudents = async (req, res) => {
    try {
        const teacherId = req.userId;
        const connection = await pool.getConnection();

        const [students] = await connection.query(
            `SELECT DISTINCT u.id, u.firstName, u.lastName, u.email
             FROM users u
             JOIN student_modules sm ON u.id = sm.studentId
             JOIN modules m ON sm.moduleId = m.id
             WHERE m.teacherId = ? AND u.role = 'student'`,
            [teacherId]
        );

        connection.release();
        res.json(students);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};