FROM node:12.10-alpine

WORKDIR /validator
COPY ./package.production.json ./package.json
RUN npm install --ci --only=production

COPY ./dist .
ENTRYPOINT ["node"]
