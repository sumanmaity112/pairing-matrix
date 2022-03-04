# Pairing Matrix visualiser (Vue)

[![NPM version](https://img.shields.io/npm/v/pairing-matrix-vue-visualiser.svg)](https://www.npmjs.com/package/pairing-matrix-vue-visualiser)
This package contains charts to visualise pairing matrix. This package can be used to easily create visualization using
data created by [pairing-matrix-engine](https://www.npmjs.com/package/pairing-matrix-engine) package.

## Installation

Use your favourite package manager:

- [npm](https://npmjs.org): `npm install pairing-matrix-vue-visualiser`
- [yarn](https://yarnpkg.com/): `yarn add pairing-matrix-vue-visualiser`

## Usage

Include into your JavaScript app as an ES Module:

```vue
<template>
  <ChordPairingChart
    :height="height"
    :width="width"
    :data="pairingMatrix"
    :authors="authors"
  />
</template>

<script>
import { ChordPairingChart } from "pairing-matrix-vue-visualiser";

export default {
  name: "PairingMatrix",
  components: {
    ChordPairingChart,
  },
  data() {
    return {
      pairingMatrix: [],
      authors: [],
      height: 954,
      width: 954,
    };
  },
};
</script>
```

## Developers Guide

### Prerequisites

- [talisman](https://github.com/thoughtworks/talisman)
- [Node.js v16.13.1](https://nodejs.org)
- [nvm](https://github.com/nvm-sh/nvm)
- [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) (
  maintainers only)

### Project setup

```shell
yarn install
```

#### Compiles and minifies for production

```shell
yarn build
```

### Check Lints and fixes files

```shell
yarn lint
```

### Fix Lint issues

```shell
yarn lint:fix
```

### Commits

This repository follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Therefor whenever you
are committing the changes make sure use proper **type**.

#### Types

- **feat** for a new feature for the user, not a new feature for build script. Such commit will trigger a release
  bumping a MINOR version.
- **fix** for a bug fix for the user, not a fix to a build script. Such commit will trigger a release bumping a PATCH
  version.
- **perf** for performance improvements. Such commit will trigger a release bumping a PATCH version.
- **docs** for changes to the documentation.
- **style** for formatting changes, missing semicolons, etc.
- **refactor** for refactoring production code, e.g. renaming a variable.
- **test** for adding missing tests, refactoring tests; no production code change.
- **build** for updating build configuration, development tools or other changes irrelevant to the user.

> **_NOTE:_** Add ! just after type to indicate breaking changes
