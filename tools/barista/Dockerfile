FROM node:12-alpine

WORKDIR /usr/pagebuilder
RUN npm install cheerio markdown-it tslib

COPY ./dist/tools/barista/main.js ./main.js

CMD [ "node", "./main.js" ]
