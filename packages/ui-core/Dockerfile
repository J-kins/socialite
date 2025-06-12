# Multi-stage build for Socialite UI Core Components
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the component library
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Test the components
RUN \
  if [ -f yarn.lock ]; then yarn test --passWithNoTests; \
  elif [ -f package-lock.json ]; then npm run test -- --passWithNoTests; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm test --passWithNoTests; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run the component library
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 socialite

# Copy the built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy static files
COPY --from=builder /app/src/styles ./src/styles

USER socialite

EXPOSE 3000
ENV PORT 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Create a simple health check file
RUN echo 'const http = require("http"); \
const options = { host: "localhost", port: process.env.PORT || 3000, timeout: 2000 }; \
const request = http.request(options, (res) => { \
  console.log(`STATUS: ${res.statusCode}`); \
  process.exitCode = (res.statusCode === 200) ? 0 : 1; \
  process.exit(); \
}); \
request.on("error", function(err) { \
  console.log("ERROR"); \
  process.exit(1); \
}); \
request.end();' > healthcheck.js

CMD ["node", "-e", "console.log('Socialite UI Core Components - Ready for development')"]
