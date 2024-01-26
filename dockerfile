FROM node:latest

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . /server

CMD ["node", "./dist/index.js"]