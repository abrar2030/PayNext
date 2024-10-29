# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:stable-alpine

# Copy the build output to Nginx's HTML directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
