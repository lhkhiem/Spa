#!/bin/bash

# Script khôi phục cấu trúc thư mục media

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /var/www/Spa/CMS/backend

echo -e "${BLUE}📁 Khôi phục cấu trúc thư mục media...${NC}"
echo ""

# Kiểm tra database
echo -e "${YELLOW}🔍 Kiểm tra database...${NC}"
TOTAL_FOLDERS=$(psql -h localhost -U spa_cms_user -d spa_cms_db -t -c "SELECT COUNT(*) FROM media_folders;" 2>/dev/null | tr -d ' ')
TOTAL_ASSETS=$(psql -h localhost -U spa_cms_user -d spa_cms_db -t -c "SELECT COUNT(*) FROM assets WHERE provider='local';" 2>/dev/null | tr -d ' ')

echo "   Số thư mục hiện có: $TOTAL_FOLDERS"
echo "   Số assets local: $TOTAL_ASSETS"
echo ""

if [ "$TOTAL_FOLDERS" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Không có thư mục nào, đang tạo lại...${NC}"
    
    # Chạy script SQL
    psql -h localhost -U spa_cms_user -d spa_cms_db -f restore-media-folders.sql 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Đã tạo lại cấu trúc thư mục!${NC}"
    else
        echo -e "${RED}❌ Lỗi khi tạo thư mục${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Đã có thư mục, đang cập nhật...${NC}"
    psql -h localhost -U spa_cms_user -d spa_cms_db -f restore-media-folders.sql 2>/dev/null
fi

echo ""
echo -e "${BLUE}📊 Kết quả:${NC}"
psql -h localhost -U spa_cms_user -d spa_cms_db -c "
SELECT 
    mf.name as folder_name,
    COUNT(a.id) as file_count
FROM media_folders mf
LEFT JOIN assets a ON a.folder_id = mf.id
GROUP BY mf.id, mf.name
ORDER BY mf.name;
" 2>/dev/null

echo ""
echo -e "${GREEN}✅ Hoàn tất!${NC}"
echo ""
echo "💡 Làm mới trang Media Library để xem thư mục"

