const User = require('../user/user.model');

/**
 * Create a new user in the database
 * @param {Object} userData - { firstName, lastName, email, password, role }
 */
exports.createUser = async (userData) => {
    // Check if user already exists
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) {
        throw new Error('Email already exists');
    }

    // Create user
    const user = await User.create(userData);
    return user;
};

/**
 * Find a user by email and include the password field
 * @param {String} email
 */
exports.loginUser = async (email, password) => {
    // 1. Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
        throw new Error('Incorrect email or password');
    }

    // 2. Check password
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect email or password');
    }

    return user;
};

/**
 * Find user by ID (without password)
 * @param {String} id
 */
exports.getUserById = async (id) => {
    return await User.findById(id);
};