ARG NODE_VERSION=14
ARG BASE_VERSION=latest
# Will be set on Jenkins
ARG BASE_IMAGE_REGISTRY

FROM node:14-alpine as base

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
RUN npm ci

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
RUN npm run nx build workspace

#------------------------------------------------------------
# The base image for the angular workspace with the builted
# builders for the angular.json
#------------------------------------------------------------
FROM base as angular-base

LABEL maintainer="Dynatrace DesignOps Team <designops@dynatrace.com>" \
      description="This image is used to have a build setup for our monorepo."

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

COPY  ./.deployment/k8s-barista-builder/entrypoint.sh /dynatrace/entrypoint.sh

ENTRYPOINT [ "/dynatrace/entrypoint.sh" ]

CMD [ "/bin/sh" ]


#------------------------------------------------------------
# Temporary layer to build the public image
#------------------------------------------------------------
FROM angular-base as workspace-public

# No actions required only for the copy from statement

#------------------------------------------------------------
# Temporary layer to build the internal image with icons
#------------------------------------------------------------
FROM angular-base as workspace-internal

COPY .npmrc \
     package-lock.json \
     package.json \
     ./

RUN npm install @dynatrace/barista-icons @dynatrace/barista-fonts

#------------------------------------------------------------
# Temporary layer as base for a jenkins agent
#------------------------------------------------------------
FROM ${BASE_IMAGE_REGISTRY}/jci/jenkins-slave-cluster-docker-image:5.2 as jenkins-agent

LABEL maintainer="Dynatrace DesignOps Team <designops@dynatrace.com>" \
      description="This image is used as build agent for our Jenkins build"

USER root
ARG NODE_VERSION

RUN  curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - \
  && apt-get update \
  && apt-get install -y libgtk-3-0 libasound2 libxss1 nodejs pv \
  && apt-get clean \
  && npm install -g n \
  && n ${NODE_VERSION} \
  && npm -v \
  && node -v

WORKDIR /home/dynatrace


#------------------------------------------------------------
# The base image for barista public agent
#------------------------------------------------------------
FROM jenkins-agent as public

RUN npm i -g vercel

COPY --from=workspace-public /dynatrace/ ./

#------------------------------------------------------------
# The base image for barista internal agent
#------------------------------------------------------------
FROM jenkins-agent as internal

COPY --from=workspace-internal /dynatrace/ ./
