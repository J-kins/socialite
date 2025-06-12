# Multi-stage build for Nexify UI Core Components
# Supports both React components and Angular grid/table view components

# Stage 1: Base Node.js image with dependencies
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm for faster package management
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Development build
FROM base AS development

# Copy source code
COPY . .

# Install development dependencies
RUN pnpm install --frozen-lockfile --include=dev

# Expose development port
EXPOSE 3000

# Development command
CMD ["pnpm", "dev"]

# Stage 3: Build stage
FROM base AS build

# Copy source code
COPY . .

# Install all dependencies including devDependencies for build
RUN pnpm install --frozen-lockfile --include=dev

# Build the TypeScript components
RUN pnpm build

# Build Storybook for component documentation
RUN pnpm build-storybook

# Run tests
RUN pnpm test

# Stage 4: Production build with only runtime dependencies
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/storybook-static ./storybook-static

# Copy necessary runtime files
COPY --from=build /app/tailwind.config.js ./
COPY --from=build /app/postcss.config.js ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Production command
CMD ["node", "dist/index.js"]

# Stage 5: Testing stage for CI/CD
FROM base AS test

# Copy source code
COPY . .

# Install development dependencies
RUN pnpm install --frozen-lockfile --include=dev

# Run linting
RUN pnpm lint

# Run type checking
RUN pnpm type-check

# Run unit tests with coverage
RUN pnpm test:coverage

# Run e2e tests
RUN pnpm test:e2e

# Stage 6: Storybook documentation server
FROM nginx:alpine AS storybook

# Copy built Storybook from build stage
COPY --from=build /app/storybook-static /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Labels for better container management
LABEL maintainer="Socialite Team"
LABEL version="1.0.0"
LABEL description="Nexify UI Core Components - React & Angular Component Library"
LABEL org.opencontainers.image.source="https://github.com/socialite/nexify"
LABEL org.opencontainers.image.documentation="https://docs.nexify.socialite.com"
LABEL org.opencontainers.image.licenses="MIT"

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV REACT_APP_VERSION=1.0.0
ENV ANGULAR_VERSION=16.0.0
