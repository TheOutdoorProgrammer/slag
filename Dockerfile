# Multi-stage Dockerfile for SLAG

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
# This will run the build:data script and then build with Vite
RUN npm run build

# Production stage
FROM nginxinc/nginx-unprivileged:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Expose port 8080
EXPOSE 8080

# Labels for metadata
LABEL maintainer="SLAG Project"
LABEL description="Searchable Link Aggregator - A directory of useful tools and projects"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
