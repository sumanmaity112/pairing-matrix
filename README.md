# Pairing Matrix

## Usage

Pairing matrix can be either used as out of box docker image or can be used as library to integrate with other application.

### As Docker

Pairing Matrix docker image can be found on [dockerhub](https://hub.docker.com/r/sumanmaity112/pairing-matrix). You can run following
command to start pairing-matrix docker

```shell
docker run -p <host port>:8080 -e CONFIG_PATH="<config json path>" --name pairing-matrix pairing-matrix:<tag>
```

### As Library

To be able to design your own pairing matrix or include with your existing application, the core logic can be found as
npm package.

- [pairing-matrix-engine](https://www.npmjs.com/package/pairing-matrix-engine) is responsible to collect pairing data from github commits
- [pairing-matrix-vue-visualiser](https://www.npmjs.com/package/pairing-matrix-vue-visualiser) is responsible to visualise pairing information. Currently it can be only used with (Vuejs)[https://vuejs.org/]

## Developers Guide

### Prerequisites

- [talisman](https://github.com/thoughtworks/talisman)
- [Node.js v16.13.1](https://nodejs.org)
- [nvm](https://github.com/nvm-sh/nvm)
- [ShellCheck](https://www.shellcheck.net)

### Project setup

```shell
./run.sh bootstrap
```

#### Compiles and minifies for production

```shell
yarn build
```

### Fix Lint issues

```shell
./run.sh format
```

### Commits

This repository follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Therefor whenever you are committing the changes make sure use proper **type**.

#### Types

- **feat** for a new feature for the user, not a new feature for build script. Such commit will trigger a release bumping a MINOR version.
- **fix** for a bug fix for the user, not a fix to a build script. Such commit will trigger a release bumping a PATCH version.
- **perf** for performance improvements. Such commit will trigger a release bumping a PATCH version.
- **docs** for changes to the documentation.
- **style** for formatting changes, missing semicolons, etc.
- **refactor** for refactoring production code, e.g. renaming a variable.
- **test** for adding missing tests, refactoring tests; no production code change.
- **build** for updating build configuration, development tools or other changes irrelevant to the user.

> **_NOTE:_** Add ! just after type to indicate breaking changes
