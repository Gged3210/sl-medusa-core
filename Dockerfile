FROM node:20.15.0-slim
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and Medusa CLI globally
RUN npm ci --force && \
    npm install -g @medusajs/medusa-cli

# Copy the rest of the application code
COPY . .

# Run the build process during image creation
RUN npm run build:server

# Expose port
EXPOSE 9000

# Set environment variables
ENV NODE_ENV=production \
    PORT=9000

# Start medusa using npx to ensure we use the local version
CMD ["npx", "medusa", "start"]