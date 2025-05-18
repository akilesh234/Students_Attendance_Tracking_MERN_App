const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON data
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Student Attendance API Running...');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// --- Basic Error Handling Middleware (Place after routes) ---
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500; // Assign 500 if status code not already set by error
    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred',
        // Optionally include stack trace in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// --- Not Found Handler (Place at the very end) ---
app.use((req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));