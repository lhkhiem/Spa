#!/bin/bash

# Script to build and deploy production code to /var/www/publish/spa/
# This script builds all 4 projects and copies them to production directory

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
SOURCE_DIR="/var/www/Spa"
PUBLISH_DIR="/var/www/publish/spa"

echo -e "${GREEN}=== Building Production for /var/www/publish/spa/ ===${NC}\n"

# Create publish directory structure
echo -e "${YELLOW}Creating publish directory structure...${NC}"
mkdir -p "$PUBLISH_DIR"/{cms-backend,cms-admin,ecommerce-backend,ecommerce-frontend}

# Function to build backend
build_backend() {
    local name=$1
    local source_path=$2
    local publish_path=$3
    
    echo -e "\n${GREEN}Building $name...${NC}"
    cd "$SOURCE_DIR/$source_path"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install --production=false
    fi
    
    # Build
    echo "Running build..."
    npm run build
    
    # Copy to publish directory
    echo "Copying to $publish_path..."
    mkdir -p "$publish_path"
    
    # Copy build output
    if [ -d "dist" ]; then
        cp -r dist "$publish_path/"
    fi
    
    # Copy package.json and package-lock.json
    cp package.json "$publish_path/"
    [ -f package-lock.json ] && cp package-lock.json "$publish_path/" || true
    
    # Copy .env if exists (user should update manually)
    [ -f .env ] && cp .env "$publish_path/.env.example" || true
    
    # Copy tsconfig.json for reference
    [ -f tsconfig.json ] && cp tsconfig.json "$publish_path/" || true
    
    # Copy storage/uploads directory (images and media files)
    if [ -d "storage/uploads" ]; then
        echo "Copying storage/uploads..."
        mkdir -p "$publish_path/storage/uploads"
        rsync -av --delete storage/uploads/ "$publish_path/storage/uploads/"
    fi
    
    # Copy storage/temp directory structure
    [ -d "storage/temp" ] && mkdir -p "$publish_path/storage/temp" || true
    
    # Install production dependencies in publish directory
    echo "Installing production dependencies..."
    cd "$publish_path"
    npm install --production --silent
    
    echo -e "${GREEN}✓ $name build completed${NC}"
}

# Function to build frontend (Next.js)
build_frontend() {
    local name=$1
    local source_path=$2
    local publish_path=$3
    
    echo -e "\n${GREEN}Building $name...${NC}"
    cd "$SOURCE_DIR/$source_path"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Build
    echo "Running build..."
    npm run build
    
    # Copy to publish directory
    echo "Copying to $publish_path..."
    mkdir -p "$publish_path"
    
    # Copy build output (.next)
    if [ -d ".next" ]; then
        cp -r .next "$publish_path/"
    fi
    
    # Copy public directory if exists
    [ -d "public" ] && cp -r public "$publish_path/" || true
    
    # Copy package.json and package-lock.json
    cp package.json "$publish_path/"
    [ -f package-lock.json ] && cp package-lock.json "$publish_path/" || true
    
    # Copy config files
    [ -f next.config.js ] && cp next.config.js "$publish_path/" || true
    [ -f next.config.ts ] && cp next.config.ts "$publish_path/" || true
    [ -f next.config.mjs ] && cp next.config.mjs "$publish_path/" || true
    [ -f tailwind.config.js ] && cp tailwind.config.js "$publish_path/" || true
    [ -f tailwind.config.ts ] && cp tailwind.config.ts "$publish_path/" || true
    [ -f postcss.config.js ] && cp postcss.config.js "$publish_path/" || true
    [ -f tsconfig.json ] && cp tsconfig.json "$publish_path/" || true
    
    # Copy .env.local if exists (user should update manually)
    [ -f .env.local ] && cp .env.local "$publish_path/.env.local.example" || true
    
    # Install production dependencies in publish directory
    echo "Installing production dependencies..."
    cd "$publish_path"
    npm install --production --silent
    
    echo -e "${GREEN}✓ $name build completed${NC}"
}

# Build all projects
echo -e "${YELLOW}Starting build process...${NC}\n"

# 1. CMS Backend
build_backend "CMS Backend" "CMS/backend" "$PUBLISH_DIR/cms-backend"

# 2. CMS Admin Frontend
build_frontend "CMS Admin" "CMS/frontend/admin" "$PUBLISH_DIR/cms-admin"

# 3. Ecommerce Backend
build_backend "Ecommerce Backend" "Ecommerce/backend" "$PUBLISH_DIR/ecommerce-backend"

# 4. Ecommerce Frontend
build_frontend "Ecommerce Frontend" "Ecommerce/frontend" "$PUBLISH_DIR/ecommerce-frontend"

# Create symlink for ecommerce backend uploads (pointing to CMS backend storage)
echo -e "\n${YELLOW}Creating symlink for ecommerce backend uploads...${NC}"
if [ -d "$PUBLISH_DIR/ecommerce-backend/storage" ]; then
    cd "$PUBLISH_DIR/ecommerce-backend/storage"
    # Remove existing uploads directory or symlink
    [ -e "uploads" ] && rm -rf uploads || true
    # Create symlink to CMS backend storage
    ln -s ../../cms-backend/storage/uploads uploads
    echo -e "${GREEN}✓ Created symlink: ecommerce-backend/storage/uploads -> cms-backend/storage/uploads${NC}"
fi

# Create ecosystem config for publish directory
echo -e "\n${YELLOW}Creating ecosystem.config.js for publish directory...${NC}"
cat > "$PUBLISH_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [
    {
      name: 'cms-backend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/publish/spa/cms-backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3011
      },
      error_file: '/home/pressup-cms/.pm2/logs/cms-backend-error.log',
      out_file: '/home/pressup-cms/.pm2/logs/cms-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '500M'
    },
    {
      name: 'ecommerce-backend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/publish/spa/ecommerce-backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3012,
        API_DOMAIN: 'ecommerce-api.banyco.vn',
        FRONTEND_DOMAIN: 'banyco.vn'
      },
      error_file: '/home/pressup-cms/.pm2/logs/ecommerce-backend-error.log',
      out_file: '/home/pressup-cms/.pm2/logs/ecommerce-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '500M'
    },
    {
      name: 'ecommerce-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/publish/spa/ecommerce-frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/pressup-cms/.pm2/logs/ecommerce-error.log',
      out_file: '/home/pressup-cms/.pm2/logs/ecommerce-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'cms-admin',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/publish/spa/cms-admin',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3013
      },
      error_file: '/home/pressup-cms/.pm2/logs/cms-admin-error.log',
      out_file: '/home/pressup-cms/.pm2/logs/cms-admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF

echo -e "\n${GREEN}=== Build Production Completed! ===${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Update .env files in each project directory:"
echo "   - $PUBLISH_DIR/cms-backend/.env"
echo "   - $PUBLISH_DIR/cms-admin/.env.local"
echo "   - $PUBLISH_DIR/ecommerce-backend/.env"
echo "   - $PUBLISH_DIR/ecommerce-frontend/.env.local"
echo ""
echo "2. To start services from publish directory:"
echo "   pm2 start $PUBLISH_DIR/ecosystem.config.js"
echo ""
echo "3. Or use individual commands:"
echo "   cd $PUBLISH_DIR/cms-backend && npm start"
echo "   cd $PUBLISH_DIR/cms-admin && npm start"
echo "   cd $PUBLISH_DIR/ecommerce-backend && npm start"
echo "   cd $PUBLISH_DIR/ecommerce-frontend && npm start"
