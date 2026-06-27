// ================================================================
// AUTHENTICATION MIDDLEWARE
// ================================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided. Please login.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found. Invalid token.'
            });
        }

        // Update last active
        user.lastActive = new Date();
        await user.save();

        // Attach user to request
        req.user = user;
        req.userId = user._id;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token. Please login again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired. Please login again.'
            });
        }
        return res.status(500).json({
            success: false,
            error: 'Authentication error: ' + error.message
        });
    }
};

// Optional auth (doesn't require token)
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            if (user) {
                req.user = user;
                req.userId = user._id;
            }
        }
        next();
    } catch {
        next();
    }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Admin only.'
        });
    }
    next();
};

// Teacher only middleware
const teacherOnly = async (req, res, next) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Teacher only.'
        });
    }
    next();
};

module.exports = { auth, optionalAuth, adminOnly, teacherOnly };
