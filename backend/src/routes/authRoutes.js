/**
 * Authentication Routes
 * Handles user registration, login, and token management
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const database = require('../database/connection');
const config = require('../config');
const logger = require('../utils/logger');
const { validateUser, validateLogin } = require('../validators/authValidator');

const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Register new user
 */
router.post('/register', async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message,
      });
    }

    const { username, password, email, role } = req.body;

    // Check if user exists
    const existingUser = await database.queryOne(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);

    // Create user
    const userId = uuidv4();
    await database.execute(
      `INSERT INTO users (user_id, username, password_hash, email, role)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, username, passwordHash, email, role || 'user']
    );

    logger.info('User registered', { userId, username });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { userId, username, email },
    });
  } catch (error) {
    logger.error('Registration failed', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/auth/login
 * User login
 */
router.post('/login', async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message,
      });
    }

    const { username, password } = req.body;

    // Find user
    const user = await database.queryOne(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Update last login
    await database.execute(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
      [user.user_id]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        role: user.role,
      },
      config.security.jwtSecret,
      { expiresIn: config.security.jwtExpiry }
    );

    logger.info('User logged in', { userId: user.user_id, username });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error('Login failed', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/auth/verify
 * Verify JWT token
 */
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, config.security.jwtSecret);

    res.json({
      success: true,
      data: decoded,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
});

module.exports = router;