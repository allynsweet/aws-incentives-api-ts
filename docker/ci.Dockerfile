FROM node:12.18.4-alpine3.11
RUN apk update && \
    apk add --no-cache \
        git \
        shellcheck \
        nodejs \
        yarn \
        nano \
        vim \
        make \
        py3-pip \
        g++ \
        bash && \
    yarn global add \
        typescript \
        serverless \
        aws-sdk \
        jest \
        ts-jest \
        @types/jest \
        eslint \
        @typescript-eslint/parser \
        @typescript-eslint/eslint-plugin && \
    rm -rf /var/cache/*
