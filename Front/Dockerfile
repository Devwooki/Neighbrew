# Use Node.js v18 base image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the project
# RUN npm run build


# Expose the port your app is running on
EXPOSE 5173
CMD ["npm", "run", "dev"]

