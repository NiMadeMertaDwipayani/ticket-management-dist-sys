FROM node:20-alpine

WORKDIR /app

# Copy file package dulu biar install dependency-nya efisien di Docker cache
COPY package*.json ./

RUN npm install

# Copy semua source code ke dalam container
COPY . .

EXPOSE 3000

# Perintah buat jalanin API-nya
CMD ["node", "app.js"]