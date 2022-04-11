FROM node:16-slim as frontend-builder
COPY --chown=node:node frontend-app /home/gradle/frontend-app
WORKDIR /home/gradle/frontend-app
RUN yarn install
RUN yarn build

FROM node:16-slim
EXPOSE 8080

RUN apt update
RUN apt install -y git openssh-server
RUN service ssh start

COPY --chown=node:node server /home/node/server

WORKDIR /home/node/server

RUN yarn install
COPY --from=frontend-builder /home/gradle/frontend-app/dist/ public/

CMD ["yarn", "start"]
