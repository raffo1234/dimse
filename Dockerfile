FROM node:20

# System dependencies
RUN apt-get update && apt-get install -y \
    make g++ cmake libwrap0 libdcmtk-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000
CMD ["node", "server.js"]