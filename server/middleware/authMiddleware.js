const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

const teacherOnly = (req, res, next) => {
    if (req.userRole !== 'teacher') {
        return res.status(403).json({ message: 'Access denied. Teachers only.' });
    }
    next();
};

const studentOnly = (req, res, next) => {
    if (req.userRole !== 'student') {
        return res.status(403).json({ message: 'Access denied. Students only.' });
    }
    next();
};

module.exports = { authMiddleware, teacherOnly, studentOnly };