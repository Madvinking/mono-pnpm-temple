FROM node:latest
ENV ENV=local
WORKDIR /lineapp

COPY package.json package.json
COPY lerna.json lerna.json
COPY services/shared/package.json services/shared/package.json
COPY services/line-api/package.json services/line-api/package.json
RUN yarn install --production

COPY services/line-api/src services/line-api/src
COPY services/shared/src services/shared/src
WORKDIR /lineapp/services/line-api
CMD yarn start