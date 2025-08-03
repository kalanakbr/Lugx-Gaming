# 1. Use lightweight Nginx base image
FROM nginx:alpine

# 2. Set working directory explicitly (optional but clean)
WORKDIR /usr/share/nginx/html

# 3. Remove default nginx files
RUN rm -rf ./*

# 4. Copy local frontend build into container
COPY . .

# 5. Expose port 80 for HTTP
EXPOSE 80
