FROM node:14.15.0-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]