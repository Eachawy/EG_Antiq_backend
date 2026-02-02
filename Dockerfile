# Development Dockerfile for Admin Frontend
# Purpose: Local development with hot reload and debugging

FROM node:24.11.1-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

# Copy package files
COPY --chown=appuser:appuser package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm ci --legacy-peer-deps

# Copy application source
COPY --chown=appuser:appuser . .

# Set environment
ENV NODE_ENV=development \
    PORT=9060 \
    BROWSER_SYNC_PORT=3001

# Switch to non-root user
USER appuser

# Expose webpack dev server port
EXPOSE 9060

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:9060/ || exit 1

# Start webpack dev server with hot reload
CMD ["npm", "start"]
