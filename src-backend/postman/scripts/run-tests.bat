@echo off
echo ========================================
echo    Job Seeker API Test Automation
echo ========================================
echo.

REM Check if Newman is installed
newman --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Newman is not installed!
    echo Please install Newman globally: npm install -g newman
    exit /b 1
)

echo Starting Newman test execution...
echo.

REM Run the collection with environment
newman run "%~dp0..\collections\job-seeker-tests.json" ^
    --environment "%~dp0..\environments\dev_env.json" ^
    --reporters cli ^
    --bail ^
    --insecure ^
    --timeout-request 10000 ^
    --delay-request 500 ^
    --color on

echo.
echo ========================================
echo Test execution completed!
echo ========================================