FROM node:18

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules
RUN rm -rf package-lock.json

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 