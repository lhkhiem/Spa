-- Script khôi phục cấu trúc thư mục media
-- Tạo thư mục mặc định và tổ chức lại hình ảnh

-- 1. Tạo thư mục mặc định nếu chưa có
INSERT INTO media_folders (id, name, parent_id, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'All Files',
    NULL,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM media_folders WHERE name = 'All Files'
);

-- 2. Tạo các thư mục theo ngày từ URL của assets
INSERT INTO media_folders (id, name, parent_id, created_at, updated_at)
SELECT DISTINCT
    gen_random_uuid(),
    TO_CHAR(created_at, 'YYYY-MM-DD') as folder_name,
    NULL as parent_id,
    MIN(created_at) as created_at,
    NOW() as updated_at
FROM assets
WHERE provider = 'local'
  AND url LIKE '/uploads/%'
  AND NOT EXISTS (
      SELECT 1 FROM media_folders 
      WHERE name = TO_CHAR(assets.created_at, 'YYYY-MM-DD')
  )
GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD');

-- 3. Cập nhật folder_id cho assets dựa trên ngày tạo
UPDATE assets a
SET folder_id = (
    SELECT id 
    FROM media_folders mf
    WHERE mf.name = TO_CHAR(a.created_at, 'YYYY-MM-DD')
    LIMIT 1
)
WHERE a.provider = 'local'
  AND a.folder_id IS NULL
  AND EXISTS (
      SELECT 1 FROM media_folders mf
      WHERE mf.name = TO_CHAR(a.created_at, 'YYYY-MM-DD')
  );

-- 4. Kiểm tra kết quả
SELECT 
    mf.name as folder_name,
    COUNT(a.id) as file_count
FROM media_folders mf
LEFT JOIN assets a ON a.folder_id = mf.id
GROUP BY mf.id, mf.name
ORDER BY mf.name;

