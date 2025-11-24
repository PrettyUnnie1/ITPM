const authService = require('./auth.service'); // <--- Import the Service
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// Helper to send response
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined; // Hide password in response

    res.status(statusCode).json({
        success: true,
        token,
        data: { user }
    });
};

// 1. REGISTER
exports.register = async (req, res, next) => {
    try {
        // Call Service
        const newUser = await authService.createUser(req.body);
        console.log("DEBUG BODY:", req.body);
        // Handle Response
        createSendToken(newUser, 201, res);
    } catch (err) {
        // Pass error to the global error handler
        // If error is "Email already exists", it sends 400
        res.status(400).json({ success: false, message: err.message });
    }
};

// 2. LOGIN
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Call Service
        const user = await authService.loginUser(email, password);

        // Handle Response
        createSendToken(user, 200, res);
    } catch (err) {
        // If error is "Incorrect email...", it sends 401/400
        res.status(401).json({ success: false, message: err.message });
    }
};

// 3. GET CURRENT USER
exports.getMe = async (req, res, next) => {
    try {
        // Call Service
        const user = await authService.getUserById(req.user.id);

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};
