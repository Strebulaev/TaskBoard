FROM node:20-alpine

WORKDIR /app

RUN npm install -g husky

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "server"]