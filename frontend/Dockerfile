FROM node:18-alpine

WORKDIR /app/RP

COPY RP/package*.json ./
COPY RP/ ./

RUN npm install

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]
