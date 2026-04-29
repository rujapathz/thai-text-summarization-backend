FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 build ก่อน
RUN npm run build

# 🔥 ใช้ production mode
CMD ["node", "dist/main.js"]