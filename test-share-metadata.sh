#!/bin/bash

# Script to test link sharing metadata for different social media platforms
URL="${1:-https://banyco.vn/about}"

echo "=========================================="
echo "  TEST METADATA CHO LINK SHARE"
echo "=========================================="
echo "URL: $URL"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. FACEBOOK / OPEN GRAPH:${NC}"
echo "----------------------------------------"
TITLE=$(curl -s "$URL" -H "User-Agent: facebookexternalhit/1.1" 2>&1 | grep -oP '<title>.*?</title>')
OG_TITLE=$(curl -s "$URL" -H "User-Agent: facebookexternalhit/1.1" 2>&1 | grep -oP 'property="og:title" content="[^"]*"')
OG_DESC=$(curl -s "$URL" -H "User-Agent: facebookexternalhit/1.1" 2>&1 | grep -oP 'property="og:description" content="[^"]*"')
OG_IMAGE=$(curl -s "$URL" -H "User-Agent: facebookexternalhit/1.1" 2>&1 | grep -oP 'property="og:image" content="[^"]*"')
echo "Title: $TITLE"
echo "OG Title: $OG_TITLE"
echo "OG Description: $OG_DESC"
echo "OG Image: $OG_IMAGE"
echo ""

echo -e "${BLUE}2. ZALO:${NC}"
echo "----------------------------------------"
TITLE=$(curl -s "$URL" -H "User-Agent: ZaloBot/1.0" 2>&1 | grep -oP '<title>.*?</title>')
OG_TITLE=$(curl -s "$URL" -H "User-Agent: ZaloBot/1.0" 2>&1 | grep -oP 'property="og:title" content="[^"]*"')
echo "Title: $TITLE"
echo "OG Title: $OG_TITLE"
echo ""

echo -e "${BLUE}3. TWITTER:${NC}"
echo "----------------------------------------"
TITLE=$(curl -s "$URL" -H "User-Agent: Twitterbot/1.0" 2>&1 | grep -oP '<title>.*?</title>')
TWITTER_TITLE=$(curl -s "$URL" -H "User-Agent: Twitterbot/1.0" 2>&1 | grep -oP 'name="twitter:title" content="[^"]*"')
echo "Title: $TITLE"
echo "Twitter Title: $TWITTER_TITLE"
echo ""

echo -e "${BLUE}4. LINKEDIN:${NC}"
echo "----------------------------------------"
TITLE=$(curl -s "$URL" -H "User-Agent: LinkedInBot/1.0" 2>&1 | grep -oP '<title>.*?</title>')
OG_TITLE=$(curl -s "$URL" -H "User-Agent: LinkedInBot/1.0" 2>&1 | grep -oP 'property="og:title" content="[^"]*"')
echo "Title: $TITLE"
echo "OG Title: $OG_TITLE"
echo ""

echo -e "${YELLOW}=========================================="
echo "  CÁC CÔNG CỤ TEST ONLINE"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}1. Facebook Sharing Debugger:${NC}"
echo "   https://developers.facebook.com/tools/debug/?q=$(echo $URL | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
echo ""
echo -e "${GREEN}2. Twitter Card Validator:${NC}"
echo "   https://cards-dev.twitter.com/validator"
echo "   (Paste URL vào và click Preview)"
echo ""
echo -e "${GREEN}3. LinkedIn Post Inspector:${NC}"
echo "   https://www.linkedin.com/post-inspector/inspect/$(echo $URL | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
echo ""
echo -e "${GREEN}4. Zalo Debug Tool:${NC}"
echo "   https://developers.zalo.me/tools/debug"
echo "   (Nhập URL và click Debug)"
echo ""
echo -e "${GREEN}5. Open Graph Preview (All-in-one):${NC}"
echo "   https://www.opengraph.xyz/url/$(echo $URL | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
echo ""
echo -e "${GREEN}6. Meta Tags Preview:${NC}"
echo "   https://metatags.io/?url=$(echo $URL | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
echo ""





