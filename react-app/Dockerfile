FROM node:20-alpine3.17 as build

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN npm run build

# the base image for this is an alpine based nginx image
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY nginx/nginx.conf /etc/nginx/conf.d/

EXPOSE 1810

CMD ["nginx", "-g", "daemon off;"]

