-- Script to update image URLs in database
-- Replace old domain/IP with new domain

-- Update assets table
UPDATE assets 
SET url = REPLACE(url, 'http://14.225.205.116:3011', 'https://api.banyco.vn')
WHERE url LIKE '%14.225.205.116%';

UPDATE assets 
SET url = REPLACE(url, 'https://14.225.205.116:3011', 'https://api.banyco.vn')
WHERE url LIKE '%14.225.205.116%';

UPDATE assets 
SET url = REPLACE(url, 'http://banyco-demo.pressup.vn', 'https://api.banyco.vn')
WHERE url LIKE '%banyco-demo.pressup.vn%';

UPDATE assets 
SET url = REPLACE(url, 'https://banyco-demo.pressup.vn', 'https://api.banyco.vn')
WHERE url LIKE '%banyco-demo.pressup.vn%';

-- Update cdn_url if exists
UPDATE assets 
SET cdn_url = REPLACE(cdn_url, 'http://14.225.205.116:3011', 'https://api.banyco.vn')
WHERE cdn_url LIKE '%14.225.205.116%';

UPDATE assets 
SET cdn_url = REPLACE(cdn_url, 'https://14.225.205.116:3011', 'https://api.banyco.vn')
WHERE cdn_url LIKE '%14.225.205.116%';

UPDATE assets 
SET cdn_url = REPLACE(cdn_url, 'http://banyco-demo.pressup.vn', 'https://api.banyco.vn')
WHERE cdn_url LIKE '%banyco-demo.pressup.vn%';

UPDATE assets 
SET cdn_url = REPLACE(cdn_url, 'https://banyco-demo.pressup.vn', 'https://api.banyco.vn')
WHERE cdn_url LIKE '%banyco-demo.pressup.vn%';

-- Update sizes JSONB field
UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{thumb,url}',
  to_jsonb(REPLACE(sizes->'thumb'->>'url', 'http://14.225.205.116:3011', 'https://api.banyco.vn'))
)
WHERE sizes->'thumb'->>'url' LIKE '%14.225.205.116%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{thumb,url}',
  to_jsonb(REPLACE(sizes->'thumb'->>'url', 'https://14.225.205.116:3011', 'https://api.banyco.vn'))
)
WHERE sizes->'thumb'->>'url' LIKE '%14.225.205.116%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{thumb,url}',
  to_jsonb(REPLACE(sizes->'thumb'->>'url', 'http://banyco-demo.pressup.vn', 'https://api.banyco.vn'))
)
WHERE sizes->'thumb'->>'url' LIKE '%banyco-demo.pressup.vn%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{thumb,url}',
  to_jsonb(REPLACE(sizes->'thumb'->>'url', 'https://banyco-demo.pressup.vn', 'https://api.banyco.vn'))
)
WHERE sizes->'thumb'->>'url' LIKE '%banyco-demo.pressup.vn%';

-- Similar updates for medium and large sizes
UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{medium,url}',
  to_jsonb(REPLACE(sizes->'medium'->>'url', 'http://14.225.205.116:3011', 'https://api.banyco.vn'))
)
WHERE sizes->'medium'->>'url' LIKE '%14.225.205.116%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{medium,url}',
  to_jsonb(REPLACE(sizes->'medium'->>'url', 'https://14.225.205.116:3011', 'https://api.banyco.vn'))
)
WHERE sizes->'medium'->>'url' LIKE '%14.225.205.116%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{medium,url}',
  to_jsonb(REPLACE(sizes->'medium'->>'url', 'http://banyco-demo.pressup.vn', 'https://api.banyco.vn'))
)
WHERE sizes->'medium'->>'url' LIKE '%banyco-demo.pressup.vn%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{medium,url}',
  to_jsonb(REPLACE(sizes->'medium'->>'url', 'https://banyco-demo.pressup.vn', 'https://api.banyco.vn'))
)
WHERE sizes->'medium'->>'url' LIKE '%banyco-demo.pressup.vn%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{large,url}',
  to_jsonb(REPLACE(sizes->'large'->>'url', 'http://14.225.205.116:3011', 'https://api.banyco.vn'))
)
WHERE sizes->'large'->>'url' LIKE '%14.225.205.116%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{large,url}',
  to_jsonb(REPLACE(sizes->'large'->>'url', 'https://14.225.205.116:3011', 'https://api.banyco.vn'))
)
WHERE sizes->'large'->>'url' LIKE '%14.225.205.116%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{large,url}',
  to_jsonb(REPLACE(sizes->'large'->>'url', 'http://banyco-demo.pressup.vn', 'https://api.banyco.vn'))
)
WHERE sizes->'large'->>'url' LIKE '%banyco-demo.pressup.vn%';

UPDATE assets 
SET sizes = jsonb_set(
  sizes,
  '{large,url}',
  to_jsonb(REPLACE(sizes->'large'->>'url', 'https://banyco-demo.pressup.vn', 'https://api.banyco.vn'))
)
WHERE sizes->'large'->>'url' LIKE '%banyco-demo.pressup.vn%';

-- Update education_resources image_url
UPDATE education_resources 
SET image_url = REPLACE(image_url, 'http://14.225.205.116:3011', 'https://api.banyco.vn')
WHERE image_url LIKE '%14.225.205.116%';

UPDATE education_resources 
SET image_url = REPLACE(image_url, 'https://14.225.205.116:3011', 'https://api.banyco.vn')
WHERE image_url LIKE '%14.225.205.116%';

UPDATE education_resources 
SET image_url = REPLACE(image_url, 'http://banyco-demo.pressup.vn', 'https://api.banyco.vn')
WHERE image_url LIKE '%banyco-demo.pressup.vn%';

UPDATE education_resources 
SET image_url = REPLACE(image_url, 'https://banyco-demo.pressup.vn', 'https://api.banyco.vn')
WHERE image_url LIKE '%banyco-demo.pressup.vn%';

-- Update about_sections image_url
UPDATE about_sections 
SET image_url = REPLACE(image_url, 'http://14.225.205.116:3011', 'https://api.banyco.vn')
WHERE image_url LIKE '%14.225.205.116%';

UPDATE about_sections 
SET image_url = REPLACE(image_url, 'https://14.225.205.116:3011', 'https://api.banyco.vn')
WHERE image_url LIKE '%14.225.205.116%';

UPDATE about_sections 
SET image_url = REPLACE(image_url, 'http://banyco-demo.pressup.vn', 'https://api.banyco.vn')
WHERE image_url LIKE '%banyco-demo.pressup.vn%';

UPDATE about_sections 
SET image_url = REPLACE(image_url, 'https://banyco-demo.pressup.vn', 'https://api.banyco.vn')
WHERE image_url LIKE '%banyco-demo.pressup.vn%';

-- Show summary
SELECT 'Assets updated' as table_name, COUNT(*) as count FROM assets WHERE url LIKE '%api.banyco.vn%' OR url LIKE '%/uploads/%'
UNION ALL
SELECT 'Education resources updated', COUNT(*) FROM education_resources WHERE image_url LIKE '%api.banyco.vn%' OR image_url LIKE '%/uploads/%'
UNION ALL
SELECT 'About sections updated', COUNT(*) FROM about_sections WHERE image_url LIKE '%api.banyco.vn%' OR image_url LIKE '%/uploads/%';



