const express = require('express');
const progressController = require('../controllers/progressController');
const { authMiddleware, teacherOnly, studentOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Student routes
router.get('/student/my-progress', authMiddleware, studentOnly, progressController.getStudentProgress);

// Teacher routes
router.get('/teacher/module/:moduleId', authMiddleware, teacherOnly, progressController.getCourseProgressReport);
router.get('/teacher/classroom-stats', authMiddleware, teacherOnly, progressController.getClassroomStats);

module.exports = router;