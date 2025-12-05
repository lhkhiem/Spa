#!/bin/bash
# Script to commit and push code changes

set -e

cd /var/www/Spa

echo "=== Git Push Script ==="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: This directory is not a git repository"
    echo "   Please initialize git first: git init"
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
git status

echo ""
read -p "Do you want to add all changes and commit? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 0
fi

# Add all changes
echo "📦 Adding all changes..."
git add .

# Commit with message
COMMIT_MSG="feat: Add differences and timeline sections to CMS, disable spell checking

- Add migration for differences and timeline sections in about_sections table
- Update CMS Admin UI to manage differences and timeline sections
- Update Ecommerce frontend to fetch and display from API
- Disable spell checking in TinyMCE editor and VS Code settings
- Fix image URL normalization in about page"

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# Check if remote exists
if git remote | grep -q .; then
    echo ""
    echo "🚀 Pushing to remote..."
    git push
    echo ""
    echo "✅ Code pushed successfully!"
else
    echo ""
    echo "⚠️  No remote repository configured"
    echo "   To add remote: git remote add origin <repository-url>"
    echo "   Then push: git push -u origin main"
fi
