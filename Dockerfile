# Use Node.js 25 slim image
FROM node:25-slim

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies at the root level to avoid being overwritten by volume mounts
WORKDIR /
COPY package.json ./
RUN npm install && npx playwright install --with-deps

# Create and set the working directory for the application code
WORKDIR /app

# In production/CI, we copy the code. 
# In local dev, this is overridden by the volume mount in the Makefile.
COPY . .

# Default command
CMD ["npm", "run", "dev"]
