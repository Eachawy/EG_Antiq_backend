#!/bin/bash

# ==========================================
# Setup SSL with Let's Encrypt
# ==========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SSL Setup for kemetra.org${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Get email for SSL certificate
read -p "Enter your email for SSL certificate notifications: " EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}Email is required!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 1: Installing Certbot...${NC}"

# Install certbot
if ! command -v certbot &> /dev/null; then
    apt update
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
else
    echo -e "${GREEN}✓ Certbot already installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Obtaining SSL certificates...${NC}"

# Get certificates for all domains
certbot --nginx -d kemetra.org -d www.kemetra.org -d admin.kemetra.org -d api.kemetra.org \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --redirect

echo -e "${GREEN}✓ SSL certificates obtained${NC}"
echo ""

echo -e "${BLUE}Step 3: Setting up auto-renewal...${NC}"

# Test renewal
certbot renew --dry-run

echo -e "${GREEN}✓ Auto-renewal configured${NC}"
echo ""

echo -e "${BLUE}Step 4: Restarting Nginx...${NC}"
systemctl restart nginx

echo -e "${GREEN}✓ Nginx restarted with SSL${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SSL Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Your sites are now secured with HTTPS:${NC}"
echo -e "  ${GREEN}✓ https://kemetra.org${NC} (redirects to admin)"
echo -e "  ${GREEN}✓ https://www.kemetra.org${NC} (redirects to admin)"
echo -e "  ${GREEN}✓ https://admin.kemetra.org${NC} (Admin Frontend)"
echo -e "  ${GREEN}✓ https://api.kemetra.org${NC} (API)"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo -e "1. Update your frontend to use HTTPS API URL"
echo -e "2. Update CORS_ORIGINS in API .env to include https://"
echo ""
echo -e "${BLUE}Certificate auto-renewal is enabled${NC}"
echo -e "Certificates will automatically renew before expiration"
echo ""
