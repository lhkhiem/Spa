#!/bin/bash

# Script to rebuild and deploy all projects
# Usage: ./rebuild-deploy-all.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="/var/www/Spa"

echo -e "${BLUE}=== Rebuild and Deploy All Projects ===${NC}\n"

# Function to run a script
run_script() {
    local script_name=$1
    local script_path="${SCRIPT_DIR}/${script_name}"
    
    if [ ! -f "$script_path" ]; then
        echo -e "${RED}Error: Script not found: ${script_path}${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}Running: ${script_name}${NC}"
    echo -e "${YELLOW}========================================${NC}\n"
    
    bash "$script_path"
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✓ ${script_name} completed successfully${NC}\n"
    else
        echo -e "\n${RED}✗ ${script_name} failed${NC}\n"
        exit 1
    fi
}

# Run scripts in order
run_script "rebuild-deploy-cms-backend.sh"
run_script "rebuild-deploy-cms-admin.sh"
run_script "rebuild-deploy-ecommerce-backend.sh"
run_script "rebuild-deploy-ecommerce-frontend.sh"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All scripts completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}\n"
