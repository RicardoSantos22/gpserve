FROM node:18.12.1-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm config set legacy-peer-deps true

RUN curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;

RUN npm install -g pnpm

RUN pnpm i

COPY . .

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["ls", "npm", "run", "start:prod"]