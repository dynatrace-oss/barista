FROM node:12-alpine

COPY ./package.json /pull-request-labeler/package.json
COPY ./package-lock.json /pull-request-labeler/package-lock.json
COPY ./tsconfig.json /pull-request-labeler/tsconfig.json
COPY ./entrypoint.sh /entrypoint.sh

RUN cd /pull-request-labeler && npm ci
COPY ./src/ /pull-request-labeler/src/

ENTRYPOINT ["/entrypoint.sh"]
