/**
 * Authentication Middleware
 * JWT verification and role-based access control
 * Demonstrates security best practices
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Verify JWT token
 * Protects routes requiring authentication
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header',
        message: 'Authentication required',
      });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
        message: 'Authentication required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.security.jwtSecret);
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };

    logger.debug('Auth successful', { userId: decoded.userId });
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Please login again',
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Authentication failed',
      });
    }

    logger.error('Auth middleware error', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

/**
 * Admin role verification
 * Ensures user has admin privileges
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  if (req.user.role !== 'admin') {
    logger.warn('Unauthorized admin access attempt', { 
      userId: req.user.userId,
      role: req.user.role 
    });
    
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Admin privileges required',
    });
  }

  next();
};

/**
 * Optional auth middleware
 * Attaches user if token present, but doesn't require it
 */
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.security.jwtSecret);
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (error) {
    // Silently fail for optional auth
    logger.debug('Optional auth failed', { error: error.message });
  }
  
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  optionalAuthMiddleware,
};