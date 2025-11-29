#!/bin/bash

# Quick deploy script - Build and restart production
# Usage: ./deploy-production.sh

set -e

echo "🚀 Starting production deployment..."
echo ""

# Build production
echo "📦 Building production..."
./build-production.sh

echo ""
echo "🔄 Restarting PM2 services..."
pm2 restart all

echo ""
echo "✅ Deployment completed!"
echo ""
echo "Services status:"
pm2 list | grep -E "(cms|ecommerce)" || true
