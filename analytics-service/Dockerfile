# === analytics-service/Dockerfile ===
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/clickhouse.js"]

EXPOSE 3002
