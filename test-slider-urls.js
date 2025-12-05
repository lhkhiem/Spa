#!/usr/bin/env node

/**
 * Test script to check if slider URLs are correctly normalized
 * This script tests the API endpoint and checks for localhost URLs
 */

const http = require('http');

const API_URL = 'http://localhost:3012/api/public/homepage/hero-sliders';

console.log('=== Testing Slider URLs ===\n');
console.log(`Fetching from: ${API_URL}\n`);

const req = http.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (!response.success) {
        console.error('❌ API returned error:', response);
        process.exit(1);
      }

      const slides = response.data || [];
      
      if (slides.length === 0) {
        console.warn('⚠️  No slides returned from API');
        process.exit(0);
      }

      console.log(`✅ Found ${slides.length} slide(s)\n`);
      
      let hasLocalhost = false;
      let hasCorrectUrl = false;

      slides.forEach((slide, index) => {
        const imageUrl = slide.imageUrl;
        console.log(`Slide ${index + 1}:`);
        console.log(`  ID: ${slide.id}`);
        console.log(`  Title: ${slide.title}`);
        console.log(`  Image URL: ${imageUrl}`);
        
        if (!imageUrl) {
          console.log('  ⚠️  WARNING: No image URL!');
        } else if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
          console.log('  ❌ ERROR: URL contains localhost!');
          hasLocalhost = true;
        } else if (imageUrl.includes('ecommerce-api.banyco.vn')) {
          console.log('  ✅ URL is correct (ecommerce-api.banyco.vn)');
          hasCorrectUrl = true;
        } else if (imageUrl.startsWith('https://')) {
          console.log('  ⚠️  URL is HTTPS but not ecommerce-api.banyco.vn');
        } else {
          console.log('  ⚠️  URL format may be incorrect');
        }
        console.log('');
      });

      console.log('\n=== Summary ===');
      if (hasLocalhost) {
        console.log('❌ FAILED: Found localhost in URLs!');
        console.log('   Backend normalization is not working correctly.');
        process.exit(1);
      } else if (hasCorrectUrl) {
        console.log('✅ SUCCESS: All URLs are correctly normalized!');
        process.exit(0);
      } else {
        console.log('⚠️  WARNING: URLs may not be in expected format.');
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Response:', data.substring(0, 500));
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.error('   Make sure the backend is running on port 3012');
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.error('❌ Request timeout');
  req.destroy();
  process.exit(1);
});




