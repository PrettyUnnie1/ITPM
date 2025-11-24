# Postman Environments

This directory contains environment configuration files for API testing.

## Setup

1. Create your own environment file based on the template below
2. Configure the variables for your local/development environment

## Template Environment Variables

```json
{
  "id": "your-environment-id",
  "name": "Job Seeker API - Development",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "your-jwt-token-here",
      "enabled": true
    }
  ]
}
```

## Note

Actual environment files are excluded from version control to prevent exposure of sensitive data.