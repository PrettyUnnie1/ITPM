const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const path = require('path'); // Add this for safe file paths

// 1. Load Envs (Fixing the path issue we saw earlier)
dotenv.config({ path: path.resolve(__dirname, './.env') });

// 2. Connect Database
connectDB();

// 3. Import the Configured App
// (This file ALREADY contains your Middleware, CORS, and Routes)
const app = require('./src/app');

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
});