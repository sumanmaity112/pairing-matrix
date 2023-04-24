FROM node:20-slim as frontend-builder
COPY --chown=node:node packages/frontend-app /home/frontend-app
WORKDIR /home/frontend-app
RUN yarn install && yarn build

FROM node:20-slim
EXPOSE 8080

RUN apt update && apt install -y git

COPY --chown=node:node packages/server /home/node/server

WORKDIR /home/node/server

RUN yarn install && yarn cache clean
COPY --from=frontend-builder /home/frontend-app/dist/ public/

CMD ["yarn", "start"]
