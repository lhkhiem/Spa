#!/bin/bash

# Script to rebuild and deploy CMS Admin Frontend to Production
# Usage: ./rebuild-deploy-cms-admin.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
SOURCE_DIR="/var/www/Spa/CMS/frontend/admin"
PUBLISH_DIR="/var/www/publish/spa/cms-admin"

echo -e "${BLUE}=== Rebuild and Deploy CMS Admin Frontend ===${NC}\n"
echo -e "${YELLOW}Source: ${SOURCE_DIR}${NC}"
echo -e "${YELLOW}Destination: ${PUBLISH_DIR}${NC}\n"

# Step 1: Build
echo -e "${YELLOW}[1/4] Building CMS Admin Frontend...${NC}"
cd "$SOURCE_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
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

# Remove old .next directory if exists
[ -d "$PUBLISH_DIR/.next" ] && rm -rf "$PUBLISH_DIR/.next"

# Copy .next directory
if [ -d ".next" ]; then
    cp -r .next "$PUBLISH_DIR/"
    echo "  ✓ Copied .next"
else
    echo -e "${RED}  ✗ Error: .next directory not found after build${NC}"
    exit 1
fi

# Copy public directory
[ -d "public" ] && cp -r public "$PUBLISH_DIR/" && echo "  ✓ Copied public" || true

# Copy package files
cp package.json "$PUBLISH_DIR/"
[ -f package-lock.json ] && cp package-lock.json "$PUBLISH_DIR/" && echo "  ✓ Copied package files" || true

# Copy config files
[ -f next.config.ts ] && cp next.config.ts "$PUBLISH_DIR/" && echo "  ✓ Copied next.config.ts" || true
[ -f next.config.js ] && cp next.config.js "$PUBLISH_DIR/" && echo "  ✓ Copied next.config.js" || true
[ -f next.config.mjs ] && cp next.config.mjs "$PUBLISH_DIR/" && echo "  ✓ Copied next.config.mjs" || true
[ -f tailwind.config.js ] && cp tailwind.config.js "$PUBLISH_DIR/" && echo "  ✓ Copied tailwind.config.js" || true
[ -f tailwind.config.ts ] && cp tailwind.config.ts "$PUBLISH_DIR/" && echo "  ✓ Copied tailwind.config.ts" || true
[ -f postcss.config.js ] && cp postcss.config.js "$PUBLISH_DIR/" && echo "  ✓ Copied postcss.config.js" || true
[ -f postcss.config.mjs ] && cp postcss.config.mjs "$PUBLISH_DIR/" && echo "  ✓ Copied postcss.config.mjs" || true
[ -f tsconfig.json ] && cp tsconfig.json "$PUBLISH_DIR/" && echo "  ✓ Copied tsconfig.json" || true

# Copy .env.local if exists (as example)
[ -f .env.local ] && cp .env.local "$PUBLISH_DIR/.env.local.example" && echo "  ✓ Copied .env.local.example" || true

echo -e "${GREEN}✓ Files copied${NC}\n"

# Step 3: Install production dependencies
echo -e "${YELLOW}[3/4] Installing production dependencies...${NC}"
cd "$PUBLISH_DIR"
npm install --production --silent

echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Step 4: Restart PM2 service (if running)
echo -e "${YELLOW}[4/4] Restarting PM2 service...${NC}"
if pm2 list | grep -q "cms-admin"; then
    pm2 restart cms-admin
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Service restarted${NC}\n"
        sleep 2
        pm2 list | grep cms-admin || true
    else
        echo -e "${RED}✗ Failed to restart service${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ Service 'cms-admin' not found in PM2. Skipping restart.${NC}"
    echo -e "${YELLOW}  To start manually: cd $PUBLISH_DIR && npm start${NC}\n"
fi

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo -e "${BLUE}Deployed to: ${PUBLISH_DIR}${NC}"
echo ""
echo "To check logs: pm2 logs cms-admin --lines 50"
echo "To start manually: cd $PUBLISH_DIR && npm start"


