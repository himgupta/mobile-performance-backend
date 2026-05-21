# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (only production dependencies can be installed later, but we need devDependencies to build)
RUN npm ci

# Copy the rest of your application code
COPY . .

# Build the application (compiles TypeScript to dist/)
RUN npm run build

# Remove development dependencies to keep the final image lightweight
RUN npm prune --production

# Expose the port the app runs on (Cloud Run provides PORT environment variable)
EXPOSE 8080

# Command to run your app
CMD ["npm", "start"]
