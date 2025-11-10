#!/usr/bin/env node

/**
 * Copy Netlify-specific files to out directory after Next.js build
 * This ensures _headers and _redirects are available for Netlify deployment
 * Also verifies that data files are present
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const sourceDir = path.join(__dirname, '..');
const publicDir = path.join(__dirname, '..', 'public');

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

// Verify data file exists in out directory (Next.js should copy it automatically)
const dataFile = path.join(outDir, 'data', 'dashboard.json');
if (fs.existsSync(dataFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    console.log(`✅ Data file found: out/data/dashboard.json`);
    console.log(`   Updated at: ${data.updatedAt || 'unknown'}`);
    console.log(`   Spot: ${data.spot || 'N/A'}, VIX: ${data.vix || 'N/A'}`);
  } catch (error) {
    console.warn(`⚠️  Warning: Data file exists but couldn't be read:`, error.message);
  }
} else {
  // Try to copy from public if it wasn't copied automatically
  const publicDataFile = path.join(publicDir, 'data', 'dashboard.json');
  if (fs.existsSync(publicDataFile)) {
    console.log('⚠️  Data file not in out/, copying from public/...');
    const dataDir = path.join(outDir, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.copyFileSync(publicDataFile, dataFile);
    console.log('✅ Copied data file to out/data/dashboard.json');
  } else {
    console.error('❌ Error: Data file not found in public/data/dashboard.json');
    console.error('   Make sure GitHub Actions has updated the data file.');
    process.exit(1);
  }
}

console.log('✅ Netlify files copied successfully!');

