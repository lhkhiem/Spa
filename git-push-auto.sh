#!/bin/bash
# Auto push script - no user interaction required

set -e

cd /var/www/Spa

echo "=== Auto Git Push ==="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: This directory is not a git repository"
    exit 1
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
git commit -m "$COMMIT_MSG" || {
    echo "⚠️  No changes to commit or commit failed"
    exit 0
}

# Check if remote exists and push
if git remote | grep -q .; then
    echo ""
    echo "🚀 Pushing to remote..."
    git push || {
        echo "⚠️  Push failed. You may need to:"
        echo "   - Set up remote: git remote add origin <url>"
        echo "   - Or pull first: git pull --rebase"
        exit 1
    }
    echo ""
    echo "✅ Code pushed successfully!"
else
    echo ""
    echo "⚠️  No remote repository configured"
    echo "   To add remote: git remote add origin <repository-url>"
    echo "   Then push: git push -u origin main"
fi
