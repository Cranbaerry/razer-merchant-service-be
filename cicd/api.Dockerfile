FROM node:18-alpine as install

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma/ ./prisma

RUN npm i pnpm -g &&\
    pnpm i &&\
    pnpm prisma:generate &&\
    pnpm i --prod

FROM node:18-alpine

WORKDIR /app

COPY --from=install /usr/src/app /app

# copy built files
COPY dist/ . 

ARG NODE_ENV=prod
ENV NODE_ENV $NODE_ENV
ENV TZ='Asia/Kuala_Lumpur'

# production port
EXPOSE 3000

CMD [ "node", "apps/api/main" ]