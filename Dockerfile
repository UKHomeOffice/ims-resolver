FROM node:24.14.1-alpine3.23@sha256:5bc53106902596d90fb497746b74ea40e0625c1c8327681d6bff3ee6ad42a22b

USER root

# Update Alpine system packages to patch known vulnerabilities
RUN apk update && \
    apk upgrade --no-cache

# Update all globally installed npm packages to fix vulnerabilities
RUN npm update -g

# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

USER 999

WORKDIR /app

COPY --chown=999:998 . /app

RUN yarn install --frozen-lockfile --production --ignore-optional --ignore-scripts

CMD node index.js
