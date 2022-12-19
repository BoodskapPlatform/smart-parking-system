FROM node:alpine3.16
LABEL maintainer="Boodskap <platform@boodskap.io>"

RUN npm install -g express

ENV BOODSKAPUI_HOME=/opt/boodskapui

RUN mkdir -p ${BOODSKAPUI_HOME}/logs

WORKDIR ${BOODSKAPUI_HOME}

COPY / ${BOODSKAPUI_HOME}/

RUN ls -la ${BOODSKAPUI_HOME}/

EXPOSE 4201

ENTRYPOINT node boodskap-platform-node.js
