FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpx prisma generate

RUN pnpm run build

EXPOSE 8080

RUN apk add --no-cache curl

CMD ["pnpm", "start:prod"]