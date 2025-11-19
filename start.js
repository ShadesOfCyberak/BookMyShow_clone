#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';

console.log('🎬 Starting MovieFlix Application...\n');

// Start backend server
console.log('🚀 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log('\n🚀 Starting frontend server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (error) => {
    console.error('❌ Frontend error:', error);
  });

  frontend.on('close', (code) => {
    console.log(`\n📱 Frontend server exited with code ${code}`);
  });
}, 3000);

backend.on('error', (error) => {
  console.error('❌ Backend error:', error);
});

backend.on('close', (code) => {
  console.log(`\n🔧 Backend server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGTERM');
  process.exit(0);
}); 