# DELIED Production Deployment & Operations Guide

## 1. Prerequisites
* **Server:** Linux Ubuntu 22.04 LTS or Debian 12 (Minimum 2GB RAM, 1 vCPU, 20GB SSD)
* **Node.js:** v18 LTS or v20 LTS
* **Database:** SQLite 3 (included) or PostgreSQL
* **Web Server:** Nginx with Let's Encrypt SSL
* **Process Manager:** PM2 or Docker

---

## 2. Environment Variables Configuration
Create a `.env` file in the project root:
```env
PORT=3000
NODE_ENV=production
DATABASE_URL="file:./dev.db"
JWT_SECRET="delied_fashion_jwt_super_secret_key_2026_production"
NEXT_PUBLIC_APP_URL="https://delied.com"

# Payment Gateway Configuration (Optional live credentials)
BKASH_APP_KEY="your_bkash_app_key"
BKASH_APP_SECRET="your_bkash_app_secret"
BKASH_USERNAME="your_bkash_merchant_username"
BKASH_PASSWORD="your_bkash_merchant_password"

SSLCOMMERZ_STORE_ID="your_sslcz_store_id"
SSLCOMMERZ_STORE_PASSWD="your_sslcz_store_passwd"
SSLCOMMERZ_IS_SANDBOX=false
```

---

## 3. Installation & Database Setup
```bash
# 1. Clone repository
git clone https://github.com/rsriduan/my-project.git
cd my-project

# 2. Install production dependencies
npm ci

# 3. Generate Prisma client & sync schema
npx prisma db push

# 4. Seed initial catalog, 8 roles, ERP accounts, and settings
npm run prisma:seed

# 5. Build optimized production assets
npm run build
```

---

## 4. Process Management with PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start DELIED cluster process
pm2 start npm --name "delied-platform" -- start

# Configure PM2 to auto-start on server reboot
pm2 startup
pm2 save
```

---

## 5. Nginx Reverse Proxy Configuration
Create `/etc/nginx/sites-available/delied.com`:
```nginx
server {
    server_name delied.com www.delied.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 20M;
}
```

Enable site & configure SSL:
```bash
sudo ln -s /etc/nginx/sites-available/delied.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d delied.com -d www.delied.com
```

---

## 6. Automated Backup Strategy (PRD Section 16 & 18)
Add automated daily backup cron job:
```bash
# Edit crontab
crontab -e

# Daily at 02:00 AM BST: copy dev.db snapshot to /var/backups/delied
0 2 * * * cp /path/to/my-project/dev.db /var/backups/delied/delied-$(date +\%Y\%m\%d-\%H\%M).db
```

Snapshots can also be manually triggered on-demand via the Super Admin Panel (`/dashboard/admin` $\to$ Backup & Restore) or via `POST /api/admin/backup`.
