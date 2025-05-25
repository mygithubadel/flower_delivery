FROM node:20-alpine

RUN apk add --no-cache bash curl

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npm install -g ts-node-dev

COPY . .

EXPOSE 3000

CMD ["ts-node-dev", "--respawn", "--transpile-only", "--poll", "--debug", "src/index.ts"]
