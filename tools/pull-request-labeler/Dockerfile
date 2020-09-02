FROM node:12-alpine

COPY ./package.json /pull-request-labeler/package.json
COPY ./yarn.lock /pull-request-labeler/yarn.lock
COPY ./tsconfig.json /pull-request-labeler/tsconfig.json
COPY ./entrypoint.sh /entrypoint.sh

RUN cd /pull-request-labeler && yarn install --frozen-lockfile
COPY ./src/ /pull-request-labeler/src/

ENTRYPOINT ["/entrypoint.sh"]
