FROM node:20.15.0-slim
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies and Medusa CLI globally
RUN yarn install --frozen-lockfile && \
    yarn global add @medusajs/medusa-cli

# Copy the rest of the application code
COPY . .

# Run the build process during image creation
RUN yarn build:server

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production \
    PORT=8080

# Start medusa using yarn
CMD ["yarn", "medusa", "start"]