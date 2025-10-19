# === Build stage ===
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --ignore-scripts

# Copy source code
COPY . .
COPY .env .env

# Build the application
RUN yarn build


# === Production stage ===
FROM nginx:alpine

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Use build arg to select config
ARG NGINX_CONFIG=nginx.conf
COPY ${NGINX_CONFIG} /etc/nginx/conf.d/default.conf

# Change ownership of nginx files
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port 8080 (non-privileged)
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
