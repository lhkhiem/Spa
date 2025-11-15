#!/bin/bash
# Script to copy project to a new repository
# Usage: ./copy-project.sh /path/to/new/repo

if [ -z "$1" ]; then
    echo "Usage: ./copy-project.sh /path/to/new/repo"
    exit 1
fi

NEW_REPO_PATH="$1"
CURRENT_DIR=$(pwd)

echo "📦 Copying project to: $NEW_REPO_PATH"

# Create destination directory if it doesn't exist
mkdir -p "$NEW_REPO_PATH"

# Copy all files except .git, node_modules, .next, dist
rsync -av \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='**/node_modules' \
    --exclude='.next' \
    --exclude='**/.next' \
    --exclude='dist' \
    --exclude='**/dist' \
    --exclude='.env' \
    --exclude='**/.env' \
    --exclude='**/.env.local' \
    --exclude='.turbo' \
    --exclude='.vercel' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='Thumbs.db' \
    --exclude='backend/storage/uploads/*' \
    --exclude='backend/uploads/*' \
    --exclude='backend/storage/temp/*' \
    "$CURRENT_DIR/" "$NEW_REPO_PATH/"

echo "✅ Project copied successfully!"
echo ""
echo "Next steps:"
echo "1. cd $NEW_REPO_PATH"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m 'Initial commit'"
echo "5. git remote add origin <your-new-repo-url>"
echo "6. git push -u origin main"

