# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Clean previous builds
RUN rm -rf dist && npm run build 

# Build TypeScript files
#RUN npm run build

# Expose port
EXPOSE 8080 
#Use the port defined in .env or default to 8080

# Start the app
CMD ["npm", "start"]
