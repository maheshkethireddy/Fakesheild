const fs = require('fs');
const cp = require('child_process');

if (fs.existsSync('./backend/package.json') && fs.existsSync('./frontend/package.json')) {
  console.log('🔨 Vercel Build: Running from project root. Compiling backend and building frontend bundle...');
  cp.execSync('npm --prefix backend run build', { stdio: 'inherit' });
  cp.execSync('npm --prefix frontend run build', { stdio: 'inherit' });
} else {
  console.log('🔨 Vercel Build: Running in subdirectory. Building locally...');
  cp.execSync('npm run build', { stdio: 'inherit' });
}
