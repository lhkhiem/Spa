#!/bin/bash

# Script build production cho tất cả services
# Chạy: bash build-production.sh

set -e  # Exit on error

echo "=========================================="
echo "  BUILD PRODUCTION - BANYCO DEMO"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "NPM version: $(npm --version)"
echo ""

# ============================================
# 1. BUILD BACKEND (CMS Backend)
# ============================================
echo "----------------------------------------"
echo "1. Building CMS Backend..."
echo "----------------------------------------"
cd /var/www/Spa/CMS/backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_warning "Installing backend dependencies..."
    npm install
fi

# Build TypeScript
print_status "Building TypeScript..."
npm run build

if [ -d "dist" ]; then
    print_status "Backend build completed: dist/ directory created"
else
    print_error "Backend build failed: dist/ directory not found"
    exit 1
fi
echo ""

# ============================================
# 2. BUILD ECOMMERCE FRONTEND
# ============================================
echo "----------------------------------------"
echo "2. Building Ecommerce Frontend..."
echo "----------------------------------------"
cd /var/www/Spa/Ecommerce

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_warning "Installing ecommerce dependencies..."
    npm install
fi

# Check .env.local
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found, creating from .env.local.example..."
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
    fi
fi

# Build Next.js
print_status "Building Next.js production..."
NODE_ENV=production npm run build

if [ -d ".next" ]; then
    print_status "Ecommerce build completed: .next/ directory created"
    # Check build size
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
    print_status "Build size: $BUILD_SIZE"
else
    print_error "Ecommerce build failed: .next/ directory not found"
    exit 1
fi
echo ""

# ============================================
# 3. BUILD CMS ADMIN FRONTEND
# ============================================
echo "----------------------------------------"
echo "3. Building CMS Admin Frontend..."
echo "----------------------------------------"
cd /var/www/Spa/CMS/frontend/admin

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_warning "Installing admin dependencies..."
    npm install
fi

# Check .env.local
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found, creating from env.example..."
    if [ -f "env.example" ]; then
        cp env.example .env.local
    fi
fi

# Build Next.js
print_status "Building Next.js production..."
NODE_ENV=production npm run build

if [ -d ".next" ]; then
    print_status "CMS Admin build completed: .next/ directory created"
    # Check build size
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
    print_status "Build size: $BUILD_SIZE"
else
    print_error "CMS Admin build failed: .next/ directory not found"
    exit 1
fi
echo ""

# ============================================
# SUMMARY
# ============================================
echo "=========================================="
echo "  BUILD COMPLETED SUCCESSFULLY!"
echo "=========================================="
echo ""
print_status "All builds completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Restart services with PM2:"
echo "     pm2 restart all"
echo ""
echo "  2. Or start production mode:"
echo "     - Backend: cd CMS/backend && npm start"
echo "     - Ecommerce: cd Ecommerce && npm start"
echo "     - CMS Admin: cd CMS/frontend/admin && npm start"
echo ""
echo "  3. Check services:"
echo "     pm2 status"
echo ""

