FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY tooling tooling
RUN npm ci
COPY tsconfig.base.json vite.config.ts ./
COPY shared shared
COPY web web
RUN npm run build

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY tooling tooling
RUN npm ci --omit=dev

FROM node:24-alpine
ARG ADDON_VERSION
WORKDIR /app
ENV NODE_ENV=production NODE_NO_WARNINGS=1 PORT=8080 ADDON_VERSION=${ADDON_VERSION}
COPY --from=deps /app/node_modules node_modules
COPY package.json ./
COPY shared shared
COPY server/src server/src
COPY --from=build /app/dist/ui dist/ui
USER node
EXPOSE 8080
CMD ["node", "server/src/main.ts"]
