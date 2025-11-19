@echo off
echo.
echo ========================================
echo    MovieFlix - Movie Recommendation App
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running (optional check)
echo Checking if MongoDB is available...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB might not be installed or running
    echo The app will work with sample data, but user data won't be saved
    echo To install MongoDB: https://docs.mongodb.com/manual/installation/
    echo.
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

if not exist "server\node_modules" (
    echo Installing backend dependencies...
    cd server
    npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo Creating .env file...
    copy "server\.env.example" "server\.env" >nul 2>&1
    if not exist "server\.env" (
        echo Creating default .env file...
        echo # Server Configuration > server\.env
        echo PORT=5000 >> server\.env
        echo NODE_ENV=development >> server\.env
        echo MONGODB_URI=mongodb://localhost:27017/movieflix >> server\.env
        echo JWT_SECRET=your_jwt_secret_key_here_change_in_production >> server\.env
        echo JWT_EXPIRE=30d >> server\.env
        echo FRONTEND_URL=http://localhost:3000 >> server\.env
    )
    echo .env file created successfully
    echo.
)

echo Starting MovieFlix application...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend server
start "MovieFlix Backend" cmd /k "cd server && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
start "MovieFlix Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Please wait a moment for them to fully load.
echo.
echo Once ready, open your browser and go to: http://localhost:3000
echo.
pause 