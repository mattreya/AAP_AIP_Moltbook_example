# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install app dependencies
# Use --omit=dev to skip dev dependencies in production builds
RUN npm install

# Copy app source code
COPY . .

# Expose any ports the Moltbook API might need if the bot were acting as a server
# For this bot, it's a client, so typically no ports need to be exposed.
# If Moltbook runs on a specific port and the bot needs to access it, ensure
# network configuration allows it (e.g., --network host or docker-compose).

# Command to run the bot
CMD ["node", "bot.js"]
