const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const zipPath = path.join(rootDir, 'PluginZip.zip');

// Remove old zip if exists
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

// Create zip with PowerShell (Windows)
const filesToZip = [
  path.join(rootDir, 'manifest.json'),
  path.join(rootDir, 'README.md'),
  path.join(rootDir, 'dist'),
].map(p => `'${p}'`).join(', ');

execSync(
  `powershell -Command "Compress-Archive -Path ${filesToZip} -DestinationPath '${zipPath}'"`,
  { stdio: 'inherit' }
);

console.log('Created PluginZip.zip');
