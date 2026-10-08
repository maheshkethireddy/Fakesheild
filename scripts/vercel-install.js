const fs = require('fs');
const cp = require('child_process');

if (fs.existsSync('./backend/package.json') && fs.existsSync('./frontend/package.json')) {
  console.log('📦 Vercel Install: Running from project root. Installing backend and frontend dependencies...');
  cp.execSync('npm --prefix backend install', { stdio: 'inherit' });
  cp.execSync('npm --prefix frontend install', { stdio: 'inherit' });
} else {
  console.log('📦 Vercel Install: Running in subdirectory. Installing local dependencies...');
  cp.execSync('npm install', { stdio: 'inherit' });
}
