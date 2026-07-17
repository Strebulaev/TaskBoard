FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

WORKDIR /app/server

RUN rm -rf node_modules package-lock.json

RUN npm install

RUN npm install @rolldown/binding-linux-x64-musl || true

EXPOSE 3000

CMD ["npm", "run", "server"]