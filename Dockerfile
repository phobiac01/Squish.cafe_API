FROM node:12
#FROM mongo:latest
WORKDIR /src/node-app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 8888
CMD ["node", "node-app.js"]