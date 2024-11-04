FROM node:20.15.0-slim
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --force

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 9000

# Set environment variables
ENV NODE_ENV=production \
    PORT=9000

# Run the application
CMD ["npm", "start"]