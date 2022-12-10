FROM node:18.12.1-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm config set legacy-peer-deps true

RUN npm i 

COPY . .

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["ls", "npm", "run", "start:prod"]