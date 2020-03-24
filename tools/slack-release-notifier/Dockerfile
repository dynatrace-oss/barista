FROM node:12-alpine

COPY \
  ./package.json  \
  ./package-lock.json \
  ./tsconfig.json \
  /slack-release-notifier/
COPY ./entrypoint.sh /entrypoint.sh

COPY ./src/ /slack-release-notifier/src/

# We need git for an NPM package
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN cd /slack-release-notifier && npm ci

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
