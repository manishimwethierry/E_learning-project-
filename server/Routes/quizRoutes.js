const express = require('express');
const quizController = require('../controllers/quizController');
const { authMiddleware, teacherOnly, studentOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Teacher routes
router.post('/', authMiddleware, teacherOnly, quizController.createQuiz);
router.get('/:quizId/results', authMiddleware, teacherOnly, quizController.getQuizResults);

// Student routes
router.post('/submit', authMiddleware, studentOnly, quizController.submitQuiz);
router.get('/attempts/my', authMiddleware, studentOnly, quizController.getStudentQuizAttempts);
router.get('/result/:attemptId', authMiddleware, studentOnly, quizController.getQuizResult);

// General routes
router.get('/:quizId', authMiddleware, quizController.getQuizDetail);

module.exports = router;