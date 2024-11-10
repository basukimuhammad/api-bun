# Use an ARM64-compatible Bun image
FROM oven/bun:1.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb (if available)
COPY package.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of your application's code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run your app
CMD ["bun", "run", "start"]