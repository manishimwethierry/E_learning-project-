const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!['teacher', 'student'].includes(role)) {
            return res.status(400).json({ message: 'Role must be teacher or student' });
        }

        const connection = await pool.getConnection();

        // Check if user already exists
        const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        
        if (existingUser.length > 0) {
            connection.release();
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await connection.query(
            'INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, firstName, lastName, role]
        );

        const token = jwt.sign(
            { id: result.insertId, role },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '7d' }
        );

        connection.release();

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
            token,
            user: { email, firstName, lastName, role }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            connection.release();
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            connection.release();
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '7d' }
        );

        connection.release();

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query('SELECT id, email, firstName, lastName, role FROM users WHERE id = ?', [req.userId]);

        connection.release();

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
