const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d', // Use env variable or default
    });
};

// @desc    Register a new user (e.g., admin setup, can be restricted later)
// @route   POST /api/auth/register
// @access  Public (or restrict to admin later)
exports.registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await User.create({
            username,
            password, // Hashing happens in the model pre-save hook
            role: role || 'teacher', // Default to teacher if not provided
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id), // Send token upon successful registration
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' }); // Unauthorized
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

// @desc    Get current user profile (Example of protected route)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
     try {
        // req.userId should be attached by the 'protect' middleware
         const user = await User.findById(req.userId).select('-password'); // Exclude password
         if (!user) {
             return res.status(404).json({ message: 'User not found' });
         }
         res.json(user);
     } catch (error) {
         console.error("GetMe error:", error);
         res.status(500).json({ message: 'Server error fetching user profile', error: error.message });
     }
};