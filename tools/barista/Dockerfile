FROM node:12-alpine

WORKDIR /usr/pagebuilder
RUN npm install cheerio markdown-it markdown-it-deflist tslib chalk typescript axios

COPY ./dist/tools/examples-tools/main.js ./examples-main.js
COPY ./dist/tools/barista/main.js ./main.js

ENTRYPOINT [ "node" ]
