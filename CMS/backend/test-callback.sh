#!/bin/bash
# Script để test ZaloPay callback mà không cần quét QR

if [ -z "$1" ]; then
  echo "❌ Usage: ./test-callback.sh <app_trans_id>"
  echo "Example: ./test-callback.sh 251129_ORDMIIF9UEUMKZVN"
  exit 1
fi

APP_TRANS_ID=$1
CALLBACK_URL="${ZP_CALLBACK_URL:-https://api.banyco.vn/api/payments/zalopay/callback}"

echo "🧪 Testing ZaloPay Callback..."
echo "App Trans ID: $APP_TRANS_ID"
echo "Callback URL: $CALLBACK_URL"
echo ""

# Load .env để lấy credentials
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Chạy script TypeScript
cd CMS/backend
npx ts-node src/scripts/testZaloPayCallback.ts "$APP_TRANS_ID"
