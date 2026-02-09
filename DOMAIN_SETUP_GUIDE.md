# 🌐 Custom Domain Setup Guide
## Ambica Wedding Decor & Planner

---

## Current Status

**Your website is currently live at:**
- Website: `https://ambicaweddings.preview.emergentagent.com`
- Admin: `https://ambicaweddings.preview.emergentagent.com/admin/login`

---

## 📋 Prerequisites for Custom Domain

1. **Purchase a domain name** from any registrar:
   - GoDaddy (godaddy.com)
   - Namecheap (namecheap.com)
   - Google Domains (domains.google)
   - Hostinger (hostinger.com)
   
   Recommended domain examples:
   - `ambicadecor.com`
   - `ambicaweddings.com`
   - `ambicadecorators.com`

2. **Access to DNS management** at your domain registrar

---

## 🚀 Option 1: Custom Domain on Emergent Cloud (RECOMMENDED)

### Step 1: Contact Emergent Support

Email: **support@emergent.sh** or use the support chat

Subject: "Custom Domain Setup for Ambica Wedding Decor"

Message Template:
```
Hi Emergent Team,

I would like to connect my custom domain to my deployed website.

Project Name: Ambica Wedding Decor & Planner
Current URL: https://ambicaweddings.preview.emergentagent.com
Custom Domain: [your-domain-here].com

Please provide DNS configuration instructions.

Thank you!
```

### Step 2: Emergent Will Provide DNS Records

They will give you something like:
```
Type: A
Name: @
Value: 123.45.67.89

Type: CNAME
Name: www
Value: ambicaweddings.preview.emergentagent.com
```

### Step 3: Update DNS at Your Domain Registrar

1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **DNS Management** or **DNS Settings**
3. Add/Update the records provided by Emergent
4. Save changes

### Step 4: Wait for DNS Propagation

- DNS changes take 15 minutes to 48 hours
- Use https://dnschecker.org to verify propagation
- Enter your domain and check if it points to Emergent servers

### Step 5: SSL Certificate (Automatic)

Emergent automatically provisions free SSL certificates via Let's Encrypt.
Your site will be accessible via `https://` within hours.

### Step 6: Update Environment Variables (Optional)

If Emergent doesn't do this automatically:

**Backend .env:**
```env
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

**Frontend .env:**
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

Then redeploy via Emergent's dashboard or CLI.

---

## 🛠️ Option 2: Self-Hosting on Your Own Server

If you want to host on your own VPS/server:

### Requirements:
- Ubuntu/Debian server with SSH access
- Root/sudo privileges
- Minimum 2GB RAM
- 20GB storage

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx certbot python3-certbot-nginx mongodb

# Install Yarn globally
sudo npm install -g yarn
```

### Step 2: Upload Code to Server

```bash
# From your local machine
scp -r /app root@your-server-ip:/var/www/

# Or use Git
cd /var/www
git clone https://github.com/yourusername/ambica-wedding.git app
```

### Step 3: Setup Backend

```bash
cd /var/www/app/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Update .env file
nano .env
# Set MONGO_URL=mongodb://localhost:27017
# Set all other environment variables

# Seed database
python seed_data.py

# Test backend
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Step 4: Setup Frontend

```bash
cd /var/www/app/frontend

# Install dependencies
yarn install

# Update .env
nano .env
# Set REACT_APP_BACKEND_URL=https://yourdomain.com/api

# Build for production
yarn build
```

### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/ambicadecor
```

Paste this configuration:

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/app/frontend/build;
    index index.html;

    # Serve React app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ambicadecor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Setup SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts to:
- Enter email
- Agree to terms
- Choose redirect HTTP to HTTPS (recommended)

Certificate auto-renews every 90 days.

### Step 7: Setup Backend as Service

```bash
sudo nano /etc/systemd/system/ambica-backend.service
```

Paste:
```ini
[Unit]
Description=Ambica Wedding Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/app/backend
Environment="PATH=/var/www/app/backend/venv/bin"
ExecStart=/var/www/app/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

Start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ambica-backend
sudo systemctl start ambica-backend
sudo systemctl status ambica-backend
```

### Step 8: Configure DNS

At your domain registrar:

```
Type: A
Name: @
Value: [Your Server IP]

Type: A
Name: www
Value: [Your Server IP]
```

Wait for DNS propagation (15 min - 48 hours).

### Step 9: Verify Deployment

```bash
# Check if site loads
curl -I https://yourdomain.com

# Check API
curl https://yourdomain.com/api/

# Check SSL
curl -I https://yourdomain.com | grep -i ssl
```

---

## 🔐 Post-Deployment Security

### 1. Change Admin Password
Log into admin panel and change default password immediately.

### 2. Setup Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Regular Backups
```bash
# Backup database daily
mongodump --db ambica_wedding_db --out /backup/$(date +%Y%m%d)

# Backup code
tar -czf /backup/code-$(date +%Y%m%d).tar.gz /var/www/app
```

### 4. Update JWT Secret
Generate a new strong secret:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```
Update in `/var/www/app/backend/.env`

---

## 📊 Monitoring & Maintenance

### Check Backend Logs
```bash
sudo journalctl -u ambica-backend -f
```

### Check Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Update SSL Certificate
```bash
sudo certbot renew --dry-run
```

### Restart Services
```bash
sudo systemctl restart ambica-backend
sudo systemctl restart nginx
```

---

## 🐛 Common Issues & Solutions

### Issue: "502 Bad Gateway"
**Solution:** Backend not running
```bash
sudo systemctl start ambica-backend
sudo systemctl status ambica-backend
```

### Issue: "CORS error in browser"
**Solution:** Update CORS_ORIGINS in backend .env
```env
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

### Issue: Images not loading
**Solution:** Check Cloudinary credentials in .env
```bash
cd /var/www/app/backend
grep CLOUDINARY .env
```

### Issue: Email notifications not working
**Solution:** Verify Resend API key
```bash
cd /var/www/app/backend
grep RESEND .env
```

---

## 📞 Need Help?

### Emergent Cloud Support
- Email: support@emergent.sh
- Response time: 24-48 hours

### Self-Hosting Support
- DigitalOcean Community: digitalocean.com/community
- Stack Overflow: stackoverflow.com
- Server support from your VPS provider

---

## ✅ Final Checklist

Before going live with custom domain:

- [ ] Domain purchased
- [ ] DNS records configured
- [ ] SSL certificate active (HTTPS works)
- [ ] Backend .env updated with correct domain
- [ ] Frontend .env updated with correct API URL
- [ ] Admin panel accessible
- [ ] Contact form working
- [ ] Email notifications working
- [ ] Image uploads working
- [ ] All pages loading correctly
- [ ] Mobile responsive verified
- [ ] Admin password changed from default

---

## 🎉 Success!

Once all steps are complete, your website will be live at:
- **https://yourdomain.com** (Public website)
- **https://yourdomain.com/admin/login** (Admin panel)

Share the public URL with clients and family!

---

**Questions?** Refer back to the main README or contact support.

**Last Updated:** February 2025
