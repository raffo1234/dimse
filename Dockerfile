FROM node:20

# Install dependencies needed for dicom-dimse-native
RUN apt-get update && \
    apt-get install -y python3 g++ make libwrap0 && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package.json ./
RUN npm install

# Copy rest of app
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
