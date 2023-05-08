FROM node:alpine

WORKDIR /usr/app

COPY package.json yarn.lock .npmrc ./

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc yarn

COPY . ./

EXPOSE 3000

CMD yarn dev
