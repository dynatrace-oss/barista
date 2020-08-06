ARG NODE_VERSION=12
ARG BASE_VERSION=latest
# Will be set on Jenkins
ARG BASE_IMAGE_REGISTRY


#------------------------------------------------------------
# Temporary layer to build the public image
#------------------------------------------------------------
FROM designops/workspace-base:${BASE_VERSION} as workspace-public

# No actions required only for the copy from statement

#------------------------------------------------------------
# Temporary layer to build the internal image with icons
#------------------------------------------------------------
FROM designops/workspace-base:${BASE_VERSION} as workspace-internal

COPY .npmrc \
     package-lock.json \
     package.json \
     ./

RUN npm install @dynatrace/barista-icons @dynatrace/barista-fonts

#------------------------------------------------------------
# Temporary layer as base for a jenkins agent
#------------------------------------------------------------
FROM ${BASE_IMAGE_REGISTRY}/library/jenkins-slave-cluster-docker-image:5.2 as jenkins-agent

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
