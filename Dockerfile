FROM node:alpine3.16
LABEL maintainer="Boodskap <platform@boodskap.io>"

RUN npm install -g express

ENV APP_HOME=/opt/smart-parking-system

RUN mkdir -p ${APP_HOME}/logs

WORKDIR ${APP_HOME}

COPY / ${APP_HOME}/

EXPOSE 10091

CMD exec node smart-vehicle-parking-node.js
