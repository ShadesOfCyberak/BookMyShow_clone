#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎬 MovieFlix Setup Script');
console.log('========================\n');

// Check if Node.js is installed
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js ${nodeVersion} is installed`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm ${npmVersion} is available`);
} catch (error) {
  console.error('❌ npm is not available. Please install npm first.');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'server') });
  console.log('✅ Backend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Create .env file for server
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('\n🔧 Creating .env file for server...');
  
  let envContent = '';
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
  } else {
    envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/movieflix

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# TMDB API (Optional - for real movie data)
TMDB_API_KEY=your_tmdb_api_key_here

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
  console.log('⚠️  Please edit the .env file with your actual configuration');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Edit the .env file in the server directory with your configuration');
console.log('3. Start the backend server: cd server && npm run dev');
console.log('4. Start the frontend server: npm run dev');
console.log('5. Open http://localhost:3000 in your browser');
console.log('\nFor more information, see the README.md file'); 