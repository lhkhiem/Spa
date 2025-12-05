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
COMMIT_MSG="feat: Add security features - rate limiting, security headers, anti-spam

- Add rate limiting to CMS and Ecommerce backends (100-150 req/15min)
- Add security headers (X-Frame-Options, CSP, HSTS, etc.)
- Add anti-spam protection (honeypot, time validation, rate limiting)
- Add security scripts for VPS (firewall, fail2ban, DDoS protection)
- Remove hardcoded IP addresses from code
- Add security documentation and guides
- Update slider pagination position in EducationResources component"

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

