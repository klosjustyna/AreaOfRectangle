FROM node:alpine

WORKDIR /opt/app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "dev"]
