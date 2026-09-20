# Build the web image from the repository root:
#   docker build -f infrastructure/docker/web.Dockerfile -t blackcinnamon-web .

FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo

# NEXT_PUBLIC_* values are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @blackcinnamon/web... build

FROM node:22-alpine AS runtime
RUN corepack enable
ENV NODE_ENV=production
WORKDIR /repo

COPY --from=build /repo/package.json /repo/pnpm-lock.yaml /repo/pnpm-workspace.yaml /repo/.npmrc ./
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/packages ./packages
COPY --from=build /repo/apps/web ./apps/web

USER node
EXPOSE 3000
CMD ["pnpm", "--filter", "@blackcinnamon/web", "start"]