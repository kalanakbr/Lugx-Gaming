# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose service port
EXPOSE 3003

# Start app
CMD ["node", "dist/app.js"]
