#!/bin/bash

# ==========================================
# Setup Domain with Nginx
# ==========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Domain Setup for admin.kemetra.org${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Nginx not found. Installing...${NC}"

    # Detect package manager
    if command -v apt &> /dev/null; then
        # Debian/Ubuntu
        apt update
        apt install -y nginx
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL 7
        yum install -y epel-release
        yum install -y nginx
    elif command -v dnf &> /dev/null; then
        # CentOS/RHEL 8+
        dnf install -y nginx
    else
        echo -e "${RED}Error: No supported package manager found (apt/yum/dnf)${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 1: Installing Nginx configuration...${NC}"

# Detect Nginx config directory
if [ -d /etc/nginx/sites-available ]; then
    # Debian/Ubuntu style
    NGINX_AVAILABLE=/etc/nginx/sites-available
    NGINX_ENABLED=/etc/nginx/sites-enabled

    cp nginx/kemetra.conf $NGINX_AVAILABLE/kemetra.conf
    ln -sf $NGINX_AVAILABLE/kemetra.conf $NGINX_ENABLED/kemetra.conf

    # Remove default
    [ -f $NGINX_ENABLED/default ] && rm $NGINX_ENABLED/default
else
    # CentOS/RHEL style
    NGINX_CONF_DIR=/etc/nginx/conf.d

    cp nginx/kemetra.conf $NGINX_CONF_DIR/kemetra.conf

    # Remove/rename default
    [ -f $NGINX_CONF_DIR/default.conf ] && mv $NGINX_CONF_DIR/default.conf $NGINX_CONF_DIR/default.conf.disabled
fi

echo -e "${GREEN}✓ Nginx configuration installed${NC}"
echo ""

echo -e "${BLUE}Step 2: Testing Nginx configuration...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
else
    echo -e "${RED}✗ Nginx configuration has errors${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Restarting Nginx...${NC}"
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✓ Nginx restarted${NC}"
echo ""

echo -e "${BLUE}Step 4: Checking Nginx status...${NC}"
systemctl status nginx --no-pager | head -10

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Configure DNS in Hostinger (see DOMAIN_SETUP.md)"
echo -e "2. Wait 5-30 minutes for DNS propagation"
echo -e "3. Test Admin: ${BLUE}http://admin.kemetra.org${NC}"
echo -e "4. Test API: ${BLUE}http://api.kemetra.org/api/v1/health${NC}"
echo -e "5. Main domain will redirect: ${BLUE}http://kemetra.org${NC} → admin"
echo ""
echo -e "${YELLOW}Optional: Setup SSL (HTTPS)${NC}"
echo -e "Run: ${BLUE}./scripts/setup-ssl.sh${NC}"
echo ""
