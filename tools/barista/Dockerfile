FROM node:12-alpine

WORKDIR /usr/pagebuilder
RUN npm install cheerio markdown-it markdown-it-deflist tslib

COPY ./dist/tools/barista/main.js ./main.js

CMD [ "node", "./main.js" ]
