FROM node:18-alpine

WORKDIR /app/RP

# Copy only package.json and package-lock.json first
COPY RP/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY RP/ ./

# Build the project
RUN npm run build

# Expose the port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
