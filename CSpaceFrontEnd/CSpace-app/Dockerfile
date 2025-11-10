# 1. Use an official Node.js base image
FROM node:18-alpine

# 2. Set working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first (to cache dependencies)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the project files
COPY . .

# 6. Expose the port the app runs on (Vite uses 5173 by default, or you can change it)
EXPOSE 5173

# 7. Run the development server
CMD ["npm", "run", "dev"]

# # Build the image
# docker build -t react-dev .

# # Run the container
# docker run -p 5173:5173 -d react-dev


# Change host from localhost to 0.0.0.0 when running project through docker.

# docker-compose up --build -d

# docker-compose down

# -p host_PORT:docker_container_PORT