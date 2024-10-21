# Use an official Node runtime as a parent image
FROM node:20.15.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --force

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 9000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9000

# Run the application
CMD ["npm", "start"]