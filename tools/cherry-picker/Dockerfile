FROM node:12-alpine

COPY ./package.json /cherry-picker/package.json
COPY ./package-lock.json /cherry-picker/package-lock.json
COPY ./tsconfig.json /cherry-picker/tsconfig.json
COPY ./entrypoint.sh /entrypoint.sh

RUN cd /cherry-picker && npm ci
COPY ./src/ /cherry-picker/src/

ENTRYPOINT ["/entrypoint.sh"]
