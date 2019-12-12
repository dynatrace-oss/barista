FROM node:12-alpine

WORKDIR /usr/pagebuilder
RUN npm install cheerio markdown-it markdown-it-deflist tslib chalk typescript

COPY ./dist/tools/examples/main.js ./examples-main.js
COPY ./dist/tools/barista/main.js ./main.js

ENTRYPOINT [ "node" ]
