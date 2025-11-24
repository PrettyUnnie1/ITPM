# Job Seeker Backend API

A Node.js/Express backend module for job seeker functionality in a job recruitment platform.

## Features

- **Profile Management**: Complete job seeker profile handling
- **Job Search & Recommendations**: Advanced job matching and personalized recommendations
- **Application Management**: Apply to jobs and track application status
- **Company Following**: Follow companies and get updates
- **Job Alerts**: Custom job alert system with notifications
- **Settings & Privacy**: User preferences and privacy controls

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Server runs on `http://localhost:4000`

## API Endpoints

### Profile Management
- `GET /js/profile` - Get user profile
- `PUT /js/profile/interests` - Update job interests

### Job Operations
- `GET /js/jobs/search` - Search jobs with filters
- `GET /js/jobs/recommended` - Get personalized job recommendations
- `GET /js/jobs/:id` - Get job details

### Applications
- `POST /jobs/:id/apply` - Apply for a job
- `GET /js/applications` - Get user applications
- `DELETE /js/applications/:id` - Withdraw application

## Testing

API tests are available in the `postman/` directory:

```bash
# Install newman for testing
npm install -g newman

# Run tests
newman run postman/collections/job-seeker-tests.json -e postman/environments/dev_env.json
```

## Project Structure

```
src-backend/
├── server.js              # Main server entry point
├── data/                   # Mock data files
├── src/modules/           
│   └── job-seeker/        # Job seeker module
│       ├── controllers/   # Route handlers
│       ├── services/      # Business logic
│       ├── models/        # Database models
│       └── middleware/    # Validation & auth
└── postman/               # API test collections
```

## Mock Authentication

Currently uses mock authentication middleware for testing. Replace with actual JWT authentication when auth module is ready.

## Technologies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Newman/Postman
- **File Upload**: Multer

## License

This project is part of the ITPM course assignment.