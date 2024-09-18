FROM node:18-alpine

WORKDIR /Rotten-Papers/frontend/RP

COPY package*.json ./

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build --verbose

EXPOSE 8080

CMD ["npm", "start"]