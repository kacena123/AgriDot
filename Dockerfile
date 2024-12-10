# Use a Node.js base image
FROM node:latest

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install --global @expo/ngrok@^4.1.0

# Copy the entire project to the container
COPY . .

# Start the Expo server
CMD ["npx", "expo", "start", "--tunnel"]
