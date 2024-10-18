FROM node:22.10.0-alpine

ENV APP_USER=envedit
WORKDIR /home/${APP_USER}/envedit

RUN adduser -s /bin/ash -D ${APP_USER} && chown -R ${APP_USER}:${APP_USER} /home/${APP_USER}

COPY --chown=$APP_USER:$APP_USER package.json pnpm-lock.yaml ./

# hadolint ignore=DL3018
RUN apk add --no-cache jq && \
	npm i -g "$(jq -re '.packageManager' < package.json)" && \
	apk del jq

USER ${APP_USER}

RUN pnpm i

COPY --chown=$APP_USER:$APP_USER .eslintrc.json next.config.js  tsconfig.json postcss.config.js tailwind.config.ts components.json ./

COPY --chown=$APP_USER:$APP_USER public/ ./public
COPY --chown=$APP_USER:$APP_USER src/ ./src

EXPOSE 3000
CMD ["pnpm", "start:docker"]
