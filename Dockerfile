FROM node:8-stretch

RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y libc++6 libstdc++6 gcc g++ python make wget

ENV DOCKERIZE_VERSION v0.4.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json /opt/app
RUN npm install

COPY . /opt/app
