FROM node:20-alpine3.17

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
