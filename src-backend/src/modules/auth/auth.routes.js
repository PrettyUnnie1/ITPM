const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// 1. Import the Protect Middleware (Critical for security)
// This assumes your middleware is in src/middleware/authMiddleware.js
const { protect } = require('../../middleware/authMiddleware'); 

router.post('/register', authController.register);
router.post('/login', authController.login);

// 2. Add the missing route
// We use 'protect' here to make sure only logged-in users can access it
router.get('/me', protect, authController.getMe);

module.exports = router;