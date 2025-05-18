const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you might want to attach user object

const protect = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            // Get token from header
            token = authHeader.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Optional: Get user from the token payload (if you stored id) and attach to request
            // req.user = await User.findById(decoded.id).select('-password'); // Exclude password
            // Simple approach: just attach the decoded payload ID
             req.userId = decoded.id; // Assuming 'id' is stored in the JWT payload

            if (!req.userId) {
                console.error('User ID not found in token payload during verification');
                 res.status(401);
                 throw new Error('Not authorized, user ID missing in token');
            }


            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error('Token verification failed:', error);
             if (error.name === 'JsonWebTokenError') {
                 res.status(401);
                 throw new Error('Not authorized, invalid token');
            } else if (error.name === 'TokenExpiredError') {
                 res.status(401);
                throw new Error('Not authorized, token expired');
             } else {
                 res.status(401);
                 throw new Error('Not authorized, token failed');
             }
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
};

// Optional: Middleware to restrict routes to specific roles
const authorize = (...roles) => {
    return async (req, res, next) => {
        // Assuming protect middleware ran first and attached user to req
        try {
             const user = await User.findById(req.userId); // Fetch user based on ID from token
             if (!user) {
                 return res.status(401).json({ message: 'User not found for authorization' });
             }
             if (!roles.includes(user.role)) {
                return res.status(403).json({ message: `User role '${user.role}' is not authorized to access this route` });
            }
             next();
         } catch (error) {
             console.error("Authorization error:", error);
             res.status(500).json({ message: 'Server error during authorization check' });
         }
    };
};


module.exports = { protect, authorize };