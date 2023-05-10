FROM node:alpine

ARG NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package.json yarn.lock .npmrc ./

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc yarn

COPY . ./

RUN if [ ${NODE_ENV} = "prod" ]; then yarn tsc; fi

EXPOSE 3000

CMD if [ ${NODE_ENV} = "prod" ]; then yarn start; else yarn dev; fi