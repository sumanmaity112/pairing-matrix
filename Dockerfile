FROM node:16-alpine3.14 as frontend-builder
COPY --chown=node:node frontend-app /home/gradle/frontend-app
WORKDIR /home/gradle/frontend-app
RUN yarn install
RUN yarn build

FROM node:16-alpine3.14
EXPOSE 8080

RUN apk update
RUN apk add git openssh openrc

COPY --chown=node:node server /home/node/server

WORKDIR /home/node/server

RUN yarn install
COPY --from=frontend-builder /home/gradle/frontend-app/dist/ public/

CMD ["yarn", "start"]
