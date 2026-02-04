# Hostinger VPS Deployment Guide

This guide details how to deploy your Next.js application to a Hostinger VPS.

## 1. Pricing & Plan Selection

For your application (Next.js + CSV storage), you need a **VPS (Virtual Private Server)** to ensure your data files persist.

### Recommended Plan: **KVM 1** or **KVM 2**
*   **KVM 1**: ~₹450 - ₹550/mo (Good for starting, 4GB RAM)
*   **KVM 2**: ~₹750 - ₹900/mo (Better for higher traffic, 8GB RAM, more CPU)

**Why not "Business Web Hosting"?**
Standard web hosting is for static sites or PHP. Next.js server features require a VPS to run the Node.js process continuously.

**Purchase Steps:**
1.  Go to Hostinger -> **VPS Hosting**.
2.  Select **KVM 1** (or 2).
3.  **Critical**: When asked for "Location", choose **India (Mumbai)** for best speed in India.
4.  **Operating System**: Choose **Ubuntu 24.04** (or 22.04).

---

## 2. Server Setup (First Time Only)

Once you buy the VPS, you will get an **IP Address** (e.g., `123.45.67.89`) and a **root password**.

### A. Login to your Server
Open your terminal on your Mac and run:
```bash
ssh root@123.45.67.89
```
# Enter the password when prompted (it won't show on screen)

### B. Update & Install Basics
Run these commands one by one:
```bash
# Update system
apt update && apt upgrade -y

# Install git, curl, and nginx
apt install git curl nginx -y

# Install Node.js v20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x
```

### C. Install Process Manager (PM2)
PM2 keeps your app running 24/7, even if it crashes or the server restarts.
```bash
npm install -g pm2
```

---

## 3. Deploying the Code

### A. Clone the Repository
```bash
# Go to web directory
cd /var/www

# Clone your code (Replace with your actual repo URL)
git clone https://github.com/ayushmaninbox/marble-site.git

# Enter project folder
cd marble-site
```
*(If your repo is private, you might need to set up an SSH key or use a Personal Access Token).*

### B. Install & Build
```bash
# Install dependencies
npm ci

# Build the generic Next.js app
npm run build
```

### C. Start the App
```bash
# Start with PM2
pm2 start npm --name "marble-site" -- start

# Save settings so it auto-starts on reboot
pm2 save
pm2 startup
```

---

## 4. Setup Domain (Nginx)

You need `Nginx` to point your domain (e.g., `marble.com`) to your internal app running on port 3000.

### A. Configure Nginx
Create a config file:
```bash
nano /etc/nginx/sites-available/marble-site
```

Paste this content (Right-click to paste):
```nginx
server {
    listen 80;
    server_name shree-radhe.in www.shree-radhe.in; # <--- CHANGE THIS to your actual domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
*Press `Ctrl+X`, then `Y`, then `Enter` to save.*

### B. Enable Site & Restart Nginx
```bash
# Enable the site
ln -s /etc/nginx/sites-available/marble-site /etc/nginx/sites-enabled/

# Test config
nginx -t

# (Optional) Remove default page
rm /etc/nginx/sites-enabled/default

# Restart Nginx
systemctl restart nginx
```

---

## 5. Add HTTPS (SSL) - Free
Once your domain is pointing to the VPS IP, run this to get a green lock icon:

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 6. Updating in Future
When you push new code to GitHub, run this on the server:
```bash
cd /var/www/marble-site
git pull
npm install  # Only if you added new packages
npm run build
pm2 restart marble-site
```
