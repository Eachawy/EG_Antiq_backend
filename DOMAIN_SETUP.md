# Domain Setup Guide for kemetra.org

This guide will help you connect your domain `kemetra.org` to your VPS at `153.92.209.167`.

## Prerequisites

- Domain: `kemetra.org` (registered with Hostinger)
- VPS: `153.92.209.167` (Hostinger VPS)
- Admin Frontend running on port 3001
- API running on port 3000

## Step 1: Configure DNS in Hostinger

1. Log in to **Hostinger Control Panel** (hpanel.hostinger.com)
2. Go to **Domains** → Click on **kemetra.org**
3. Click **DNS / Nameservers**
4. Add/Update these DNS records:

### DNS Records

| Type | Name | Points To | TTL |
|------|------|-----------|-----|
| A | @ | 153.92.209.167 | 3600 |
| A | www | 153.92.209.167 | 3600 |
| A | admin | 153.92.209.167 | 3600 |
| A | api | 153.92.209.167 | 3600 |

**Explanation:**
- `@` = Root domain (kemetra.org) - redirects to admin for now
- `www` = www.kemetra.org - redirects to admin for now
- `admin` = admin.kemetra.org (Admin Frontend)
- `api` = api.kemetra.org (Backend API)

5. Click **Save** or **Add Record**
6. Wait 5-30 minutes for DNS propagation

### Check DNS Propagation

```bash
# On your local Mac, check if DNS is working
dig admin.kemetra.org
dig api.kemetra.org
dig kemetra.org

# Or use online tool: https://dnschecker.org
```

## Step 2: Setup Nginx on VPS

SSH into your VPS and run the setup script:

```bash
# SSH to server
ssh root@153.92.209.167

# Navigate to frontend folder
cd /root/EG_Antiq_backend

# Make script executable
chmod +x scripts/setup-domain.sh

# Run setup
./scripts/setup-domain.sh
```

This will:
- Install Nginx (if not already installed)
- Configure reverse proxy
- Enable automatic start on boot
- Restart Nginx

## Step 3: Update CORS Configuration

Update your API's `.env` file to allow the new domain:

**Option A: Automatic Update (Recommended)**
```bash
# On the server
cd /root/EG_Antiq
./scripts/update-cors.sh
docker compose -f docker-compose.production.yml restart api
```

**Option B: Manual Update**
```bash
# On the server
cd /root/EG_Antiq
nano .env
```

Update `CORS_ORIGINS` to:
```bash
CORS_ORIGINS=http://admin.kemetra.org,https://admin.kemetra.org,http://api.kemetra.org,https://api.kemetra.org,http://153.92.209.167:3001,http://153.92.209.167:3002
```

Restart the API:
```bash
docker compose -f docker-compose.production.yml restart api
```

## Step 4: Test the Setup

### Test Admin Frontend
```bash
# Should show HTML
curl http://admin.kemetra.org

# Or visit in browser
open http://admin.kemetra.org
```

### Test API
```bash
# Should return health status
curl http://api.kemetra.org/api/v1/health
```

## Step 5: Setup SSL (HTTPS) - Optional but Recommended

Install free SSL certificate from Let's Encrypt:

```bash
cd /root/EG_Antiq_backend
./scripts/setup-ssl.sh
```

After SSL setup:
- **Admin**: https://admin.kemetra.org
- **API**: https://api.kemetra.org
- **Main**: https://kemetra.org (redirects to admin)

## Domain Structure

| URL | Points To | Purpose |
|-----|-----------|---------|
| http://kemetra.org | → admin.kemetra.org | Redirects to admin |
| http://www.kemetra.org | → admin.kemetra.org | Redirects to admin |
| http://admin.kemetra.org | localhost:3001 | Admin Frontend |
| http://api.kemetra.org | localhost:3000 | Backend API |

## Troubleshooting

### DNS Not Working

```bash
# Check if DNS is propagated
dig kemetra.org

# Should show:
# kemetra.org. 3600 IN A 153.92.209.167
```

### Nginx Not Working

```bash
# Check Nginx status
systemctl status nginx

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Frontend Not Loading

```bash
# Check if frontend is running
docker ps | grep frontend

# Check frontend logs
docker logs production-frontend

# Restart frontend
docker restart production-frontend
```

### API Not Responding

```bash
# Check if API is running
docker compose -f /root/EG_Antiq/docker-compose.production.yml ps

# Check API logs
docker compose -f /root/EG_Antiq/docker-compose.production.yml logs api

# Restart API
docker compose -f /root/EG_Antiq/docker-compose.production.yml restart api
```

### CORS Errors

Make sure `CORS_ORIGINS` in `/root/EG_Antiq/.env` includes your domain:

```bash
CORS_ORIGINS=http://admin.kemetra.org,https://admin.kemetra.org,http://api.kemetra.org,https://api.kemetra.org,http://kemetra.org,https://kemetra.org
```

## Firewall Configuration

Make sure ports 80 and 443 are open in Hostinger firewall:

1. Go to Hostinger VPS panel
2. Click **Firewall**
3. Add rules:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)

## Summary

After completing all steps:

✅ DNS points to your VPS IP
✅ Nginx proxies traffic to your apps
✅ Admin Frontend accessible at http://admin.kemetra.org
✅ API accessible at http://api.kemetra.org
✅ Main domain (kemetra.org) redirects to admin
✅ CORS configured for domain
✅ Optional: SSL/HTTPS enabled

You can now use your custom domain instead of the IP address!
