FROM node:20.8.1-alpine

ENV APP_USER envedit

RUN npm i -g pnpm@8.7.1 && adduser -s /bin/ash -D ${APP_USER}

USER ${APP_USER}
WORKDIR /home/${APP_USER}

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY .eslintrc.json next.config.js  tsconfig.json postcss.config.js tailwind.config.ts components.json ./

COPY public/ ./public
COPY src/ ./src

EXPOSE 3000
CMD ["npm", "run", "start:docker"]