FROM node:slim as build

RUN npm install -g pnpm
WORKDIR /src
COPY _isolated_/pnpm-workspace.yaml               pnpm-workspace.yaml
COPY _isolated_/pnpm-lock.yaml                    pnpm-lock.yaml
COPY _isolated_/package.json                      package.json
COPY _isolated_/workspaces-src-less               workspaces
RUN pnpm install --frozen-lockfile

COPY src                                          src
COPY _isolated_/dev                               .
COPY _isolated_/workspaces                        workspaces

# RUN pnpm run lint

# --------------------------------------------------------------
FROM node:slim as main

RUN npm install -g pnpm
WORKDIR /src
COPY _isolated_/pnpm-workspace.yaml               pnpm-workspace.yaml
COPY _isolated_/workspaces-src-less-prod          workspaces
COPY _isolated_/package-prod.json                 package.json
RUN pnpm install --prod

COPY _isolated_/workspaces                        workspaces
COPY --from=build /src/src                        src

ARG VERSION=1
ENV VERSION=${VERSION}

CMD [ "node", "src/index.js" ]
