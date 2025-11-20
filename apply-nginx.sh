#!/bin/bash
echo "Copying new Nginx config..."
sudo cp /var/www/Spa/nginx-banyco-demo.conf /etc/nginx/sites-available/banyco-demo.pressup.vn

echo "Creating symlink..."
sudo ln -sf /etc/nginx/sites-available/banyco-demo.pressup.vn /etc/nginx/sites-enabled/banyco-demo.pressup.vn

echo "Testing Nginx config..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Config OK! Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully!"
else
    echo "❌ Nginx config has errors. Please fix before reloading."
    exit 1
fi

echo ""
echo "Testing endpoints..."
sleep 2
curl -s http://banyco-demo.pressup.vn/api/health && echo " ✅ API works!"
