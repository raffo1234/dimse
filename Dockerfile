FROM node:20

# Install build tools for native modules
RUN apt-get update && \
    apt-get install -y python3 g++ make && \
    apt-get clean

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json ./
RUN npm install

# Copy rest of the source
COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
