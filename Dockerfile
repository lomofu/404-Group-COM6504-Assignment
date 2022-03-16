FROM node:17.4.0

RUN mkdir /app

COPY ./ /app

WORKDIR /app

EXPOSE 3000

ENTRYPOINT exec npm run start

