FROM node:20-alpine AS builder
WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apk \
    sed -i 's/dl-cdn.alpinelinux.org/mirror.kakao.com/g' /etc/apk/repositories && \
    apk add python3 make g++

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build && npm prune --omit=dev


FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
