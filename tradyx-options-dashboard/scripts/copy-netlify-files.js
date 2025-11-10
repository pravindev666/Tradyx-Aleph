#!/usr/bin/env node

/**
 * Copy Netlify-specific files to out directory after Next.js build
 * This ensures _headers and _redirects are available for Netlify deployment
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const sourceDir = path.join(__dirname, '..');

// Files to copy
const filesToCopy = ['_headers', '_redirects'];

console.log('📋 Copying Netlify files to out directory...');

// Ensure out directory exists
if (!fs.existsSync(outDir)) {
  console.error('❌ Error: out directory does not exist. Run "next build" first.');
  process.exit(1);
}

// Copy each file
filesToCopy.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(outDir, file);

  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file} to out/`);
    } catch (error) {
      console.error(`❌ Error copying ${file}:`, error.message);
      process.exit(1);
    }
  } else {
    console.warn(`⚠️  Warning: ${file} not found in source directory`);
  }
});

console.log('✅ Netlify files copied successfully!');

