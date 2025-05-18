const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// Public routes
router.post('/register', registerUser); // Keep registration public for initial setup? Or protect it.
router.post('/login', loginUser);

// Private route - requires authentication
router.get('/me', protect, getMe); // Apply protect middleware here

module.exports = router;