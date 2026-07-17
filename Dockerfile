# ---- Build stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci --only=production

# ---- Production stage ----
FROM node:22-alpine AS production

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Run as non-root user (already exists in node:alpine images)
USER node

EXPOSE 3000

CMD ["npm", "start"]
