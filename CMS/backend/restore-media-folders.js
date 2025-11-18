#!/usr/bin/env node

/**
 * Script khôi phục cấu trúc thư mục media
 * Tạo thư mục mặc định và tổ chức lại hình ảnh theo ngày
 */

const { Client } = require('pg');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'spa_cms_db',
  user: process.env.DB_USER || 'spa_cms_user',
  password: process.env.DB_PASSWORD || 'spa_cms_password',
};

async function restoreFolders() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('✅ Đã kết nối database');
    
    // 1. Kiểm tra số thư mục hiện có
    const folderCount = await client.query('SELECT COUNT(*) as count FROM media_folders');
    console.log(`📁 Số thư mục hiện có: ${folderCount.rows[0].count}`);
    
    // 2. Tạo thư mục "All Files" nếu chưa có
    await client.query(`
      INSERT INTO media_folders (id, name, parent_id, created_at, updated_at)
      SELECT 
        gen_random_uuid(),
        'All Files',
        NULL,
        NOW(),
        NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM media_folders WHERE name = 'All Files'
      )
    `);
    console.log('✅ Đã tạo thư mục "All Files"');
    
    // 3. Tạo thư mục theo ngày từ assets
    const dateFolders = await client.query(`
      SELECT DISTINCT
        TO_CHAR(created_at, 'YYYY-MM-DD') as folder_name,
        MIN(created_at) as min_date
      FROM assets
      WHERE provider = 'local'
        AND url LIKE '/uploads/%'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
      ORDER BY folder_name
    `);
    
    console.log(`📅 Tìm thấy ${dateFolders.rows.length} thư mục ngày`);
    
    for (const row of dateFolders.rows) {
      // Kiểm tra thư mục đã tồn tại chưa
      const exists = await client.query(
        'SELECT id FROM media_folders WHERE name = $1',
        [row.folder_name]
      );
      
      if (exists.rows.length === 0) {
        await client.query(`
          INSERT INTO media_folders (id, name, parent_id, created_at, updated_at)
          VALUES (gen_random_uuid(), $1, NULL, $2, NOW())
        `, [row.folder_name, row.min_date]);
        console.log(`  ✅ Đã tạo thư mục: ${row.folder_name}`);
      }
    }
    
    // 4. Cập nhật folder_id cho assets
    const updateResult = await client.query(`
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
        )
    `);
    console.log(`✅ Đã cập nhật ${updateResult.rowCount} assets`);
    
    // 5. Hiển thị kết quả
    const result = await client.query(`
      SELECT 
        mf.name as folder_name,
        COUNT(a.id) as file_count
      FROM media_folders mf
      LEFT JOIN assets a ON a.folder_id = mf.id
      GROUP BY mf.id, mf.name
      ORDER BY mf.name
    `);
    
    console.log('\n📊 Kết quả:');
    console.log('─'.repeat(50));
    result.rows.forEach(row => {
      console.log(`  ${row.folder_name.padEnd(20)} : ${row.file_count} files`);
    });
    console.log('─'.repeat(50));
    
    console.log('\n✅ Hoàn tất! Làm mới trang Media Library để xem thư mục');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

restoreFolders();

