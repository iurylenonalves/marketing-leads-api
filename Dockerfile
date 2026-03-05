# Use Node.js version 24 slim image
FROM node:24-slim

# Install OpenSSL, required for Prisma on Linux Debian/Slim
RUN apt-get update -y && apt-get install -y openssl

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies ignoring scripts to prevent Prisma migrate/seed from failing during build
RUN npm install --ignore-scripts

# Copy the rest of the application code
COPY . .

# Generate Prisma client (does not require database connection)
RUN npx prisma generate

# Expose the port the API uses internally
EXPOSE 3000

# Command to start the application using the script defined in package.json
CMD ["npm", "start"]