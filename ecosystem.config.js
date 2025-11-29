module.exports = {
  apps: [
    {
      name: 'cms-backend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/Spa/CMS/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3011
      },
      error_file: '/home/pressup-cms/.pm2/logs/cms-backend-error.log',
      out_file: '/home/pressup-cms/.pm2/logs/cms-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '500M'
    },
    {
      name: 'ecommerce-backend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/Spa/Ecommerce/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3012,
        API_DOMAIN: 'ecommerce-api.banyco.vn',
        FRONTEND_DOMAIN: 'banyco.vn',
        // ZaloPay configuration - load from .env file or set here
        // ZP_APP_ID: 'your_app_id',
        // ZP_KEY1: 'your_key1',
        // ZP_KEY2: 'your_key2', // Optional, for callback verification
        // ZP_CALLBACK_URL: 'https://ecommerce-api.banyco.vn/api/payments/zalopay/callback', // Auto-generated if not set
        // ZP_REDIRECT_URL: 'https://banyco.vn/checkout/result', // Auto-generated if not set
        // ZP_API_BASE: 'https://openapi.zalopay.vn/v2' // Production, or 'https://sb-openapi.zalopay.vn/v2' for sandbox
      },
      error_file: '/home/pressup-cms/.pm2/logs/ecommerce-backend-error.log',
      out_file: '/home/pressup-cms/.pm2/logs/ecommerce-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '500M'
    },
    {
      name: 'ecommerce-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/Spa/Ecommerce/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/pressup-cms/.pm2/logs/ecommerce-error.log',
      out_file: '/home/pressup-cms/.pm2/logs/ecommerce-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'cms-admin',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/Spa/CMS/frontend/admin',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3013
      },
      error_file: '/home/pressup-cms/.pm2/logs/cms-admin-error.log',
      out_file: '/home/pressup-cms/.pm2/logs/cms-admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
