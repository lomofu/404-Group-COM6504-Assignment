FROM node:17.4.0

RUN mkdir /app

COPY ./node_modules ./app/node_modules

COPY ./ /app

WORKDIR /app

EXPOSE 3000

ENTRYPOINT exec npm run test

