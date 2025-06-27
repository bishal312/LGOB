# Use Node 22 as base image
FROM node:22.16.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project files
COPY . .

# Expose backend server port (adjust if your server runs on different port)
EXPOSE 5002

# Start the server
CMD ["node", "server.js"]
