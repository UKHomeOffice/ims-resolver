FROM node:lts-alpine@sha256:b78c9500958805b52214e8bd588defe55ec32116dfdc094e3ca652a3502d67df

USER root

# Update packages as a result of Anchore security vulnerability checks
RUN apk update && \
    apk add libcurl-dev curl-dev openssl-dev \
    apk add --upgrade gnutls binutils nodejs npm apk-tools libjpeg-turbo libcurl libx11 libxml2 libcurl-dev curl-dev openssl-dev

# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

USER 999

WORKDIR /app

COPY --chown=999:998 . /app

RUN yarn install --frozen-lockfile --production --ignore-optional --ignore-scripts

CMD node index.js
