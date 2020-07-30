FROM node:12-alpine as base

# The root of the monorepo
WORKDIR /dynatrace

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

# Create shasum from package.json to compare
# later if a further install have to be done.
RUN sha1sum ./package-lock.json > package-lock.sha1

# install dependencies without postinstall script
RUN npm ci --ignore-scripts

COPY ./tsconfig.base.json \
     ./angular.json \
     ./nx.json \
     # to
     ./

#------------------------------------------------------------
# Temporary layer to build the workspace builder
# - Output under: node_modules/@dynatrace/barista-builders
#------------------------------------------------------------
FROM base as workspace-builders

COPY ./libs/workspace ./libs/workspace
COPY ./libs/shared ./libs/shared

# Build our custom angular builders for the workspace
RUN npm run ng build workspace

#------------------------------------------------------------
# The base image for the angular workspace with the builted
# builders for the angular.json
#------------------------------------------------------------
FROM base as angular-base

LABEL maintainer="Dynatrace DesignOps Team <designops@dynatrace.com>" \
      description="This image is used to have a build setup for our monorepo."

# Run the Ivy compatibility compiler for all the depenencies
RUN ./node_modules/.bin/ngcc

COPY --from=workspace-builders \
     /dynatrace/dist \
     ./dist

# Cleanup image that only the files that are ignored by git are persisted.
RUN rm -rf \
  tsconfig.base.json \
  angular.json \
  nx.json \
  package.json \
  package-lock.json

COPY  ./.deployment/entrypoint.sh /dynatrace/entrypoint.sh

ENTRYPOINT [ "/dynatrace/entrypoint.sh" ]

CMD [ "/bin/sh" ]
