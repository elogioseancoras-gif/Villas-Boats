# Multi-stage build for Next.js application

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm (pinned version for reproducible builds)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm (pinned version for reproducible builds)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for Next.js public runtime config
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build application
RUN pnpm run build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
