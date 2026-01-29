# Multi-stage build for Egyptian Antiquities Management System
# Stage 1: Build the application
FROM node:24.11.1-alpine AS builder

# Accept build argument for backend URL with default
# This is baked into the React app at build time via webpack
ARG BACKEND_URL=https://api.kemetra.org
ENV BACKEND_URL=${BACKEND_URL}

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy application source
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Production image with Nginx
FROM nginx:1.27-alpine

# Image metadata
LABEL maintainer="Kemetra Team"
LABEL description="Admin Frontend for Kemetra Antiquities Management System"
LABEL version="1.0.0"

# Install wget for health checks
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

# Copy built application from builder stage
COPY --from=builder /app/target/classes/static /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions
RUN chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    chown -R appuser:appuser /etc/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
