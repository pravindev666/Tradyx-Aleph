#!/bin/bash
# Production setup script for Unix/Linux/Mac

set -e  # Exit on error

echo "=========================================="
echo "Tradyxa Dashboard - Production Setup"
echo "=========================================="

# Check Python version
echo "Checking Python version..."
python3 --version || { echo "Python 3.12+ required"; exit 1; }

# Check Node.js version
echo "Checking Node.js version..."
node --version || { echo "Node.js 20+ required"; exit 1; }

# Install Python dependencies
echo "Installing Python dependencies..."
cd scripts
pip install -r requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd ..
npm ci

# Validate data
echo "Validating data files..."
cd scripts
python validate_production.py || echo "Warning: Some data files may be missing"

echo ""
echo "=========================================="
echo "Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env.local"
echo "2. Configure environment variables"
echo "3. Run: npm run build"
echo "4. Run: npm start"

