#!/bin/bash

echo ""
echo "========================================"
echo "   MovieFlix - Movie Recommendation App"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not available"
    echo "Please install npm or use a Node.js version that includes npm"
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "Checking if MongoDB is available..."
if ! command -v mongod &> /dev/null; then
    echo "WARNING: MongoDB might not be installed or running"
    echo "The app will work with sample data, but user data won't be saved"
    echo "To install MongoDB: https://docs.mongodb.com/manual/installation/"
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies"
        exit 1
    fi
fi

if [ ! -d "server/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd server
    npm install
    cd ..
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies"
        exit 1
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "Creating .env file..."
    if [ -f "server/.env.example" ]; then
        cp server/.env.example server/.env
    else
        echo "# Server Configuration" > server/.env
        echo "PORT=5000" >> server/.env
        echo "NODE_ENV=development" >> server/.env
        echo "MONGODB_URI=mongodb://localhost:27017/movieflix" >> server/.env
        echo "JWT_SECRET=your_jwt_secret_key_here_change_in_production" >> server/.env
        echo "JWT_EXPIRE=30d" >> server/.env
        echo "FRONTEND_URL=http://localhost:3000" >> server/.env
    fi
    echo ".env file created successfully"
    echo ""
fi

echo "Starting MovieFlix application..."
echo ""
echo "Backend will start on: http://localhost:5000"
echo "Frontend will start on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
echo "Starting backend server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Please wait a moment for them to fully load."
echo ""
echo "Once ready, open your browser and go to: http://localhost:3000"
echo ""

# Wait for both processes
wait 