# Use an ARM64-compatible Bun image
FROM oven/bun:1.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies required for Puppeteer
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs 

# Copy package.json and bun.lockb (if available)
COPY package.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of your application's code
COPY . .

# Set environment variable to tell Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# Expose the port your app runs on
EXPOSE 3000

# Run your app
CMD ["bun", "run", "start"]