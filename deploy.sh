#!/bin/bash
# ============================================================================
# Admin Frontend Deployment Script
# ============================================================================
# Deploys the Admin Frontend as an independent service
# Domain: admin.kemetra.org
# ============================================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Admin Frontend Deployment${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}ERROR: .env.production not found!${NC}"
    echo -e "${YELLOW}Please create .env.production file with BACKEND_URL${NC}"
    exit 1
fi

# Check if nginx config exists
if [ ! -f nginx-configs/admin.kemetra.org.conf ]; then
    echo -e "${RED}ERROR: nginx-configs/admin.kemetra.org.conf not found!${NC}"
    exit 1
fi

# Function to run a command with status output
run_command() {
    local description=$1
    shift
    echo -e "${BLUE}▶ ${description}...${NC}"
    if "$@"; then
        echo -e "${GREEN}✓ ${description} completed${NC}"
        echo ""
    else
        echo -e "${RED}✗ ${description} failed${NC}"
        exit 1
    fi
}

# Pull latest code
run_command "Pulling latest code" git pull origin main

# Stop existing containers
echo -e "${BLUE}▶ Stopping existing containers...${NC}"
docker compose -f docker-compose.production.yml down || true
echo ""

# Build images
run_command "Building Docker images" docker compose -f docker-compose.production.yml build --no-cache

# Start services
run_command "Starting services" docker compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo -e "${BLUE}▶ Waiting for services to be healthy...${NC}"
sleep 5

# Check service status
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Service Status${NC}"
echo -e "${BLUE}=================================${NC}"
docker compose -f docker-compose.production.yml ps

echo ""
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Service Logs (last 20 lines)${NC}"
echo -e "${BLUE}=================================${NC}"
docker compose -f docker-compose.production.yml logs --tail=20

echo ""
echo -e "${GREEN}=================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=================================${NC}"
echo -e "${GREEN}Admin Frontend:${NC} https://admin.kemetra.org"
echo -e "${YELLOW}Note:${NC} Make sure host NGINX is configured to route admin.kemetra.org to localhost:8445"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo -e "  View logs:    docker compose -f docker-compose.production.yml logs -f"
echo -e "  Restart:      docker compose -f docker-compose.production.yml restart"
echo -e "  Stop:         docker compose -f docker-compose.production.yml down"
echo ""
