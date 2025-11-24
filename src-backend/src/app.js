const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// --- Import Routes ---
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const companyRoutes = require('./modules/company/company.routes');
const jobRoutes = require('./modules/job/job.routes.js');
const applicationRoutes = require('./modules/application/application.routes.js');
const adminRoutes = require('./modules/admin/admin.routes');

// --- Import Middleware ---
// Ensure you have created this file in src/middleware/errorMiddleware.js
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- Global Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- Mount Routes (API v1) ---
const apiVersion = '/api/v1';

app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/users`, userRoutes);
app.use(`${apiVersion}/companies`, companyRoutes);
app.use(`${apiVersion}/jobs`, jobRoutes);
app.use(`${apiVersion}/applications`, applicationRoutes);
app.use(`${apiVersion}/admin`, adminRoutes);

// --- Base Route ---
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Job Portal API is running successfully'
    });
});

// --- 404 Handler ---
app.use((req, res) => {  // <--- Just remove the '*' string
    res.status(404).json({
        success: false,
        message: `API endpoint ${req.originalUrl} not found`
    });
});

// --- Global Error Handler ---
app.use(errorHandler);

module.exports = app;