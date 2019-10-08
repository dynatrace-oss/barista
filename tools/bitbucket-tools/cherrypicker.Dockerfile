FROM node:12.10-alpine

WORKDIR /cherry-picker
COPY ./package.production.json ./package.json
RUN npm install --ci --only=production

# Install git
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
# Identify git
RUN git config --global user.email "buildmaster@dynatrace.com"
RUN git config --global user.name "buildmaster"

# Set the local git path here
ENV LOCAL_GIT_REPO_PATH="/local-angular-components"
RUN mkdir /local-angular-components

COPY ./dist .

CMD ["node", "bitbucket-tools/src/auto-cherry-pick.js"]
