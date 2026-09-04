# GS Designs Multi-Terminal Hosting & Deployment Guide

This guide provides complete, step-by-step instructions for hosting and deploying the **GS Designs Billing & Order Workflow System**.

---

## 🚀 Overview of Deployment Options

| Deployment Method | Best For | Internet Needed? | Monthly Cost | Real-time Latency |
| :--- | :--- | :--- | :--- | :--- |
| **1. Local Shop LAN (Recommended)** | Single Shop with multiple PCs | ❌ No | **FREE ₹0** | Ultra-Fast (<1ms) |
| **2. Windows Auto-Start Service** | Shop PC 24/7 unattended boot | ❌ No | **FREE ₹0** | Instant |
| **3. Cloud Hosting (Render + Vercel)** | Remote access & home monitoring | 🌐 Yes | **FREE Tier** | <50ms |
| **4. Dedicated VPS (Ubuntu + Nginx)** | Multi-branch printing chain | 🌐 Yes | $5 - $10/mo | Fast |

---

## 🖥️ Method 1: Local Shop LAN Hosting (Recommended for Shop PCs)

In this setup, your **Main Admin PC** acts as the central server for all terminal workstations (**Designer**, **Press Room**, and **Billing**) over your local shop Wi-Fi / Ethernet router.

### Step 1: Find your Server PC Local IP Address
1. On the **Main Admin PC**, open Command Prompt (`cmd`) or PowerShell.
2. Type `ipconfig` and press Enter.
3. Note your **IPv4 Address** (Example: `192.168.1.100` or `192.168.0.50`).

### Step 2: Build & Start the Server
On the Main Admin PC:
```bash
# 1. Open project directory
cd "d:\Projects\GS Design Billing Software"

# 2. Build production UI
npm run build

# 3. Start unified server (listens on 0.0.0.0:5000)
npm start
```

### Step 3: Open Terminals on Shop Computers
Now, on **ANY computer** connected to the same shop Wi-Fi/router, open your web browser (Chrome, Edge, Brave):

| Terminal Station | Computer | Local Web Address |
| :--- | :--- | :--- |
| **👑 Master Admin Desk** | Admin PC | `http://localhost:5000/admin` |
| **🎨 Graphic Designer Queue** | Designer PC | `http://192.168.1.100:5000/designer` |
| **🔥 Press Room Production** | Press Room PC | `http://192.168.1.100:5000/press` |
| **𖤂 Billing & Customer Desk** | Front Billing PC | `http://192.168.1.100:5000/billing` |

> 💡 *Replace `192.168.1.100` with the actual IPv4 address of your Main Admin PC.*

---

## 🔄 Method 2: Auto-Start as Windows Background Service (PM2)

To ensure the server starts automatically whenever the shop PC turns on (without opening Command Prompt manually):

1. **Install PM2 globally**:
   ```bash
   npm install -g pm2 pm2-windows-startup
   ```

2. **Setup PM2 Windows Startup**:
   ```bash
   pm2-startup install
   ```

3. **Start GS Designs Server in Background**:
   ```bash
   cd "d:\Projects\GS Design Billing Software"
   pm2 start "npm start" --name "gs-designs-server"
   pm2 save
   ```

Now, even after restarting the computer, **GS Designs** runs automatically in the background on port `5000`.

---

## ☁️ Method 3: Free Cloud Hosting (Render.com + Vercel)

If you want the shop owner or remote designers to access the system from anywhere over the internet:

### A. Host Backend on Render.com (Free Node.js Web Service)
1. Push your repository to **GitHub** (`git push origin main`).
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Select your GitHub repository.
4. Configure service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `PORT` = `5000`
5. Click **Create Web Service**. You will get a URL like `https://gs-backend.onrender.com`.

### B. Host Frontend UI on Vercel / Netlify
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your GitHub repository.
3. Add Environment Variables:
   - `VITE_API_URL` = `https://gs-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://gs-backend.onrender.com`
4. Click **Deploy**. You will get your production domain (e.g., `https://gs-designs.vercel.app`).

---

## 🌐 Method 4: Dedicated VPS Deployment (Ubuntu 22.04 + Nginx)

For full ownership and high performance on VPS hosts (DigitalOcean, Hetzner, AWS EC2):

### 1. Install Node.js & Nginx
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
```

### 2. Clone & Build Application
```bash
git clone https://github.com/your-username/gs-design-billing.git /var/www/gs-design
cd /var/www/gs-design
npm install
npm run build
```

### 3. Setup PM2 Process Manager
```bash
sudo npm install -g pm2
pm2 start "npm start" --name "gs-designs"
pm2 startup
pm2 save
```

### 4. Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/gs-design`)
```nginx
server {
    listen 80;
    server_name gsdesigns.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### 5. Enable HTTPS with Free Let's Encrypt SSL
```bash
sudo ln -s /etc/nginx/sites-available/gs-design /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d gsdesigns.yourdomain.com
```

---

## 🛠️ Verification Checklist After Hosting

1. **API Health Check**: Open `http://your-server-ip:5000/api/health` — should return `{"status":"online"}`.
2. **Socket.io Real-time Check**: Open terminal on two devices and move an order to `Proofing` or send a broadcast alert — verify sound chime and instant update on both screens.
3. **Role Isolation Check**: Verify `/designer`, `/press`, and `/billing` do not display admin controls.
