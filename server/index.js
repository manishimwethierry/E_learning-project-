const express = require('express');
const cors = require('cors');
const connection = require("./config/db.js");
const userRoutes = require('./Routes/userRoutes');
const moduleRoutes = require('./Routes/moduleRoutes');
const quizRoutes = require('./Routes/quizRoutes');
const progressRoutes = require('./Routes/progressRoutes');

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: "E-Learning Server is running" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});