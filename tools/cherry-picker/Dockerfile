FROM node:12-alpine

COPY ./package.json /cherry-picker/package.json
COPY ./yarn.lock /cherry-picker/yarn.lock
COPY ./tsconfig.json /cherry-picker/tsconfig.json
COPY ./entrypoint.sh /entrypoint.sh

RUN cd /cherry-picker && yarn install --frozen-lockfile
COPY ./src/ /cherry-picker/src/

ENTRYPOINT ["/entrypoint.sh"]
