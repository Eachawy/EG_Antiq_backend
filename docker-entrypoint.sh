#!/bin/bash
set -e

# Default backend URL if not provided
BACKEND_URL=${BACKEND_URL:-http://localhost:3000}

echo "Configuring application with BACKEND_URL: $BACKEND_URL"

# Replace BACKEND_URL_PLACEHOLDER in nginx.conf
if [ -f /etc/nginx/nginx.conf ]; then
    sed -i "s|BACKEND_URL_PLACEHOLDER|$BACKEND_URL|g" /etc/nginx/nginx.conf
    echo "Nginx configuration updated successfully"
fi

# Execute the CMD
exec "$@"
