FROM node:12-alpine

COPY \
  ./package.json  \
  ./yarn.lock \
  ./tsconfig.json \
  /slack-release-notifier/
COPY ./entrypoint.sh /entrypoint.sh

COPY ./src/ /slack-release-notifier/src/

# We need git for an NPM package
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN cd /slack-release-notifier && yarn install --frozen-lockfile

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
