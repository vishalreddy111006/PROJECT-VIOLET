#!/bin/bash

echo "========================================="
echo "   Project Violet Backend Setup Script  "
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
else
    echo -e "${GREEN}✓ Node.js is installed${NC}"
    node --version
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
else
    echo -e "${GREEN}✓ npm is installed${NC}"
    npm --version
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB is not installed or not in PATH${NC}"
    echo "Please install MongoDB from https://www.mongodb.com/try/download/community"
    echo "Or update your PATH to include MongoDB binaries"
else
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
    mongod --version | head -n 1
fi

echo ""
echo "Installing npm packages..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please edit .env file with your configuration${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
fi

# Create upload directories
echo ""
echo "Creating upload directories..."
mkdir -p uploads/profiles
mkdir -p uploads/billboards
mkdir -p uploads/documents
mkdir -p uploads/ads
mkdir -p uploads/jobs

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Upload directories created${NC}"
fi

echo ""
echo "========================================="
echo "   Setup Complete!                      "
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Run 'npm run dev' to start the server"
echo ""
echo "For more information, see README.md"
echo ""
