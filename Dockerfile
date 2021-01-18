FROM node:lts-alpine
WORKDIR /usr/src/app
COPY bGames-SensorAndUserCommunicationService/package*.json ./
RUN npm install
COPY bGames-SensorAndUserCommunicationService ./
RUN ls -l
CMD ["npm", "run", "prod"]