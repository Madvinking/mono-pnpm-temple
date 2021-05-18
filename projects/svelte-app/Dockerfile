FROM node:slim as build

RUN npm install -g pnpm
WORKDIR /src
COPY _isolated_/pnpm-workspace.yaml               pnpm-workspace.yaml
COPY _isolated_/pnpm-lock.yaml                    pnpm-lock.yaml
COPY _isolated_/package.json                      package.json
COPY _isolated_/workspaces-src-less               workspaces
RUN pnpm install --frozen-lockfile

COPY src                                          src
COPY server                                       server
COPY public                                       public
COPY index.html                                   index.html
COPY vite.config.js                               vite.config.js
COPY _isolated_/dev                               .
COPY _isolated_/workspaces                        workspaces

RUN pnpm run build

# --------------------------------------------------------------
FROM node:slim as main

RUN npm install -g pnpm
WORKDIR /src
COPY _isolated_/pnpm-workspace.yaml               pnpm-workspace.yaml
COPY _isolated_/workspaces-src-less-prod          workspaces
COPY _isolated_/package-prod.json                 package.json
RUN pnpm install --prod

COPY _isolated_/workspaces                        workspaces
COPY --from=build /src/dist                       dist
COPY --from=build /src/server                     server
COPY --from=build /src/src/config.js              src/config.js

ARG VERSION=1
ENV VERSION=${VERSION}

CMD [ "node", "server/index.js" ]
