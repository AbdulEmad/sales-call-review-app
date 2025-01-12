# Use Node.js 18 or later
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . /app

# Pass environment variables as build arguments
ARG NEXT_PUBLIC_API_URL

# Set environment variables at build time
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the Next.js app for production
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]
