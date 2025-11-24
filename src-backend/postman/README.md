# Job Seeker API Testing with Newman

This directory contains automated API tests for the Job Seeker backend using Newman (Postman CLI).

## File Structure

```
postman/
├── collections/
│   └── job-seeker-tests.json          # Main test collection
├── environments/
│   └── dev_env.json                   # Development environment variables
├── scripts/
│   ├── run-tests.bat                  # Windows execution script
│   └── run-tests.sh                   # Unix/Linux execution script
└── README.md                          # This file
```

## Prerequisites

1. **Install Newman globally:**
   ```bash
   npm install -g newman
   ```

2. **Ensure your backend server is running:**
   ```bash
   npm start
   # Server should be running on http://localhost:3000
   ```

## Environment Configuration

Update `environments/dev_env.json` with your test credentials:

```json
{
  "baseUrl": "http://localhost:3000",
  "email": "your-test-email@example.com",
  "password": "your-test-password"
}
```

## Running Tests

### Option 1: Using Scripts (Recommended)

**Windows:**
```cmd
cd postman\scripts
run-tests.bat
```

**Unix/Linux/macOS:**
```bash
cd postman/scripts
chmod +x run-tests.sh
./run-tests.sh
```

### Option 2: Direct Newman Command

```bash
newman run postman/collections/job-seeker-tests.json \
    --environment postman/environments/dev_env.json \
    --reporters cli \
    --bail \
    --insecure \
    --timeout-request 10000 \
    --delay-request 500 \
    --color on
```

## Command Line Flags Explained

- `--environment`: Specifies the environment file with variables
- `--reporters cli`: Uses CLI reporter for terminal output
- `--bail`: Stops execution on first test failure
- `--insecure`: Disables SSL verification (useful for localhost)
- `--timeout-request 10000`: Sets request timeout to 10 seconds
- `--delay-request 500`: Adds 500ms delay between requests
- `--color on`: Enables colored output in terminal

## Test Flow

The collection tests the following workflow in order:

1. **Authentication**
   - Login and capture JWT token
   - Store token in environment for subsequent requests

2. **Profile Management**
   - Get current profile
   - Update job interests and validate changes

3. **Job Interaction**
   - Search for jobs and store first job ID
   - Get job details
   - Apply for job and store application ID
   - Check application status
   - Withdraw application

4. **Negative Testing**
   - Test unauthorized access (401)
   - Test non-existent resources (404)

## Console Logging

Each test includes console.log statements to show progress:

```
🔐 Testing Login...
✅ Token acquired and stored
👤 Testing Get Profile...
✅ Profile data retrieved successfully
🎯 Testing Update Job Interests...
✅ Updated fields: { position: "Senior Backend Developer", salary: 2500, openToWork: true }
```

## Customizing Tests

### Adding New Tests

1. Export your Postman collection to JSON
2. Replace `job-seeker-tests.json` with your new collection
3. Ensure test scripts include console.log for CLI feedback

### Environment Variables

Add new variables to `dev_env.json`:

```json
{
  "key": "new_variable",
  "value": "new_value",
  "enabled": true
}
```

### Test Scripts Template

Use this template for new test scripts:

```javascript
console.log('🔍 Testing [Feature Name]...');

pm.test('Status code is 200', function () {
    pm.response.to.have.status(200);
});

pm.test('Response has required fields', function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.not.be.undefined;
    console.log('✅ Test passed successfully');
});

pm.test('Response time is acceptable', function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

## Troubleshooting

### Common Issues

1. **Server not running:**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:3000
   ```
   Solution: Start your backend server first

2. **Authentication failed:**
   ```
   AssertionError: expected undefined to not be undefined
   ```
   Solution: Check email/password in environment file

3. **Newman not found:**
   ```
   'newman' is not recognized as an internal or external command
   ```
   Solution: Install Newman globally: `npm install -g newman`

### Debug Mode

For detailed debugging, add the `--verbose` flag:

```bash
newman run ... --verbose
```

## Integration with CI/CD

To integrate with CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run API Tests
  run: |
    npm install -g newman
    newman run postman/collections/job-seeker-tests.json \
      --environment postman/environments/dev_env.json \
      --reporters junit,cli \
      --reporter-junit-export test-results.xml
```