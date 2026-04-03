const express = require('express');
const moduleController = require('../controllers/moduleController');
const { authMiddleware, teacherOnly, studentOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Teacher routes
router.post('/', authMiddleware, teacherOnly, moduleController.createModule);
router.get('/teacher/modules', authMiddleware, teacherOnly, moduleController.getTeacherModules);
router.post('/assign', authMiddleware, teacherOnly, moduleController.assignModuleToStudents);
router.get('/teacher/students', authMiddleware, teacherOnly, moduleController.getTeacherStudents);

// Student routes
router.get('/student/modules', authMiddleware, studentOnly, moduleController.getStudentModules);

// General routes (accessible by both)
router.get('/:moduleId', authMiddleware, moduleController.getModuleDetail);
router.put('/:moduleId/progress', authMiddleware, studentOnly, moduleController.updateModuleProgress);

module.exports = router;