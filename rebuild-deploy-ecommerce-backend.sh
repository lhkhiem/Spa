#!/bin/bash

# Script to rebuild and deploy Ecommerce Backend to Production
# Usage: ./rebuild-deploy-ecommerce-backend.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
SOURCE_DIR="/var/www/Spa/Ecommerce/backend"
PUBLISH_DIR="/var/www/publish/spa/ecommerce-backend"

echo -e "${BLUE}=== Rebuild and Deploy Ecommerce Backend ===${NC}\n"
echo -e "${YELLOW}Source: ${SOURCE_DIR}${NC}"
echo -e "${YELLOW}Destination: ${PUBLISH_DIR}${NC}\n"

# Step 1: Build
echo -e "${YELLOW}[1/4] Building Ecommerce Backend...${NC}"
cd "$SOURCE_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production=false
fi

# Build
echo "Running build..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}\n"

# Step 2: Copy to publish directory
echo -e "${YELLOW}[2/4] Copying files to production...${NC}"
mkdir -p "$PUBLISH_DIR"

# Remove old dist directory if exists
[ -d "$PUBLISH_DIR/dist" ] && rm -rf "$PUBLISH_DIR/dist"

# Copy dist directory
if [ -d "dist" ]; then
    cp -r dist "$PUBLISH_DIR/"
    echo "  ✓ Copied dist"
else
    echo -e "${RED}  ✗ Error: dist directory not found after build${NC}"
    exit 1
fi

# Copy package files
cp package.json "$PUBLISH_DIR/"
[ -f package-lock.json ] && cp package-lock.json "$PUBLISH_DIR/" && echo "  ✓ Copied package files" || true

# Copy config files
[ -f tsconfig.json ] && cp tsconfig.json "$PUBLISH_DIR/" && echo "  ✓ Copied tsconfig.json" || true

# Copy .env if exists (as example)
[ -f .env ] && cp .env "$PUBLISH_DIR/.env.example" && echo "  ✓ Copied .env.example" || true

# Copy storage/temp directory structure
[ -d "storage/temp" ] && mkdir -p "$PUBLISH_DIR/storage/temp" && echo "  ✓ Created storage/temp directory" || true

# Create symlink for uploads (pointing to CMS backend storage)
if [ -d "$PUBLISH_DIR/storage" ]; then
    cd "$PUBLISH_DIR/storage"
    # Remove existing uploads directory or symlink
    [ -e "uploads" ] && rm -rf uploads || true
    # Create symlink to CMS backend storage
    if [ -d "/var/www/publish/spa/cms-backend/storage/uploads" ]; then
        ln -s ../../cms-backend/storage/uploads uploads
        echo "  ✓ Created symlink: ecommerce-backend/storage/uploads -> cms-backend/storage/uploads"
    else
        echo "  ⚠ Warning: CMS backend storage/uploads not found. Symlink not created."
    fi
fi

echo -e "${GREEN}✓ Files copied${NC}\n"

# Step 3: Install production dependencies
echo -e "${YELLOW}[3/4] Installing production dependencies...${NC}"
cd "$PUBLISH_DIR"
npm install --production --silent

echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Step 4: Restart PM2 service (if running)
echo -e "${YELLOW}[4/4] Restarting PM2 service...${NC}"
if pm2 list | grep -q "ecommerce-backend"; then
    pm2 restart ecommerce-backend
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Service restarted${NC}\n"
        sleep 2
        pm2 list | grep ecommerce-backend || true
    else
        echo -e "${RED}✗ Failed to restart service${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ Service 'ecommerce-backend' not found in PM2. Skipping restart.${NC}"
    echo -e "${YELLOW}  To start manually: cd $PUBLISH_DIR && npm start${NC}\n"
fi

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo -e "${BLUE}Deployed to: ${PUBLISH_DIR}${NC}"
echo ""
echo "To check logs: pm2 logs ecommerce-backend --lines 50"
echo "To start manually: cd $PUBLISH_DIR && npm start"
