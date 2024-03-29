FROM node:14
WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn install --production=false

COPY . .
RUN yarn build

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD [ "yarn", "start"]