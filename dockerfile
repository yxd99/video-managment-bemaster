FROM node:iron-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run test

RUN npm run build

RUN rm -rf node_modules && npm i --prod

EXPOSE ${PORT}

CMD [ "npm", "run", "start:prod" ]
