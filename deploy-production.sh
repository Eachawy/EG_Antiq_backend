#!/bin/bash

##############################################################################
# Production Deployment Script for EG Antiq Admin Frontend
#
# This script deploys the admin frontend (Kemetra Admin Panel)
# Usage: ./deploy-production.sh
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="EG_Antiq_Admin"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
# Read BACKEND_URL from .env.production or use default
BACKEND_URL=${BACKEND_URL:-"https://api.kemetra.org"}

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  EG Antiq Admin - Production Deployment${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ] && ! groups | grep -q docker; then
    echo -e "${YELLOW}Warning: Not running as root or in docker group. You may need sudo.${NC}"
fi

# Check if .env.production file exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please create .env.production file with:"
    echo "  BACKEND_URL=https://api.kemetra.org"
    exit 1
fi

# Load environment variables
source .env.production
echo "Backend URL: $BACKEND_URL"
echo ""

# Check if docker-compose is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed!${NC}"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed!${NC}"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}Step 1: Pulling latest code from repository...${NC}"
git fetch origin
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
git pull origin "$CURRENT_BRANCH"
echo -e "${GREEN}✓ Code updated${NC}"
echo ""

echo -e "${YELLOW}Step 2: Backing up current container state...${NC}"
docker compose ps > "$BACKUP_DIR/containers_state_$TIMESTAMP.txt" 2>/dev/null || true
echo -e "${GREEN}✓ Container state backed up${NC}"
echo ""

echo -e "${YELLOW}Step 3: Building new Docker image with BACKEND_URL=${BACKEND_URL}...${NC}"
echo "This may take several minutes..."
docker compose build --no-cache --build-arg BACKEND_URL="${BACKEND_URL}"
echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

echo -e "${YELLOW}Step 4: Stopping current container...${NC}"
docker compose down
echo -e "${GREEN}✓ Container stopped${NC}"
echo ""

echo -e "${YELLOW}Step 5: Starting updated container...${NC}"
docker compose up -d
echo -e "${GREEN}✓ Container started${NC}"
echo ""

echo -e "${YELLOW}Step 6: Waiting for container to be ready...${NC}"
sleep 5

# Health check
MAX_RETRIES=30
RETRY_COUNT=0
until [ $RETRY_COUNT -ge $MAX_RETRIES ]
do
    # Check if container is running and responding
    CONTAINER_STATUS=$(docker compose ps --format=json 2>/dev/null | grep -o '"State":"[^"]*"' | cut -d'"' -f4 | head -1)
    if [ "$CONTAINER_STATUS" = "running" ]; then
        # Try to access the health endpoint
        if curl -f http://localhost:3001/health &> /dev/null 2>&1; then
            echo -e "${GREEN}✓ Application is healthy!${NC}"
            break
        elif curl -f http://localhost:3001/ &> /dev/null 2>&1; then
            echo -e "${GREEN}✓ Application is responding!${NC}"
            break
        fi
    fi

    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "Waiting for application to be ready... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo -e "${YELLOW}Warning: Could not verify application health, but container is running${NC}"
    echo "Check manually: http://admin.kemetra.org or http://localhost:3001"
fi

echo ""
echo -e "${YELLOW}Step 7: Checking container status...${NC}"
docker compose ps
echo ""

echo -e "${YELLOW}Step 8: Recent logs...${NC}"
docker compose logs --tail=30
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Deployment Completed Successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Admin frontend is now running with the latest code."
echo "Backend URL: $BACKEND_URL"
echo ""
echo "Access points:"
echo "  - Local: http://localhost:3001"
echo "  - Production: https://admin.kemetra.org"
echo ""
echo "Useful commands:"
echo "  - View logs: docker compose logs -f"
echo "  - Check status: docker compose ps"
echo "  - Restart: docker compose restart"
echo "  - Stop: docker compose down"
echo ""
echo "Rollback instructions (if needed):"
echo "  1. Stop container: docker compose down"
echo "  2. Revert code: git checkout <previous-commit>"
echo "  3. Rebuild: docker compose build --build-arg BACKEND_URL=\"${BACKEND_URL}\""
echo "  4. Start: docker compose up -d"
echo ""
echo -e "${BLUE}Deployment completed at: $(date)${NC}"
