# Pairing Matrix engine

[![NPM version](https://img.shields.io/npm/v/pairing-matrix-engine.svg)](https://www.npmjs.com/package/pairing-matrix-engine)
This package main logic required to build pairing matrix using github commits.

## Installation

Use your favourite package manager:

- [npm](https://npmjs.org): `npm install pairing-matrix-engine`
- [yarn](https://yarnpkg.com/): `yarn add pairing-matrix-engine`

## Usage

Include into your JavaScript app as an ES Module:

```javascript
import PairingMatrixGenerator from "pairing-matrix-engine";

const pairingMatrixGenerator = new PairingMatrixGenerator(username, repos, basePath, sshIdentityFilePath);

await pairingMatrixGenerator.generatePairingMatrix(14, true);
```

### API

#### Create new of PairingMatrixGenerator

```javascript
new PairingMatrixGenerator(username, repos, basePath, [sshIdentityFilePath]);

// new PairingMatrixGenerator("johndoe", [ "repo1", "repo2" ], "~/temp", "~/.ssh/id_rsa");
```

Create new instance of pairing matrix for given `username`, `repos`, `basePath` and `sshIdentityFilePath`.
`sshIdentityFilePath` is optional parameter, it's only required when different identity file is required to pull data
from github.

#### Fetch data from github

```javascript
await pairingMatrixGenerator.fetchRepos();
```

Pull data from github for configured repos. `fetchRepos` method returns a `Promise`.

#### Generate Pairing Matrix

```javascript
await pairingMatrixGenerator.generatePairingMatrix(sinceDays, [pullData]);

// await pairingMatrixGenerator.generatePairingMatrix(14, true);
```

Generate pairing matrix for given days. `pullData` is optional Boolean parameter, depends on this
parameter `generatePairingMatrix`
will pull data from github and create the pairing matrix. `generatePairingMatrix` returns a `Promise`.

##### Example data

```json
{
  "matrix": [
    {
      "author": "john.reese",
      "coAuthor": "zoe.morgan",
      "times": 2
    },
    {
      "author": "john.reese",
      "coAuthor": "tonystark",
      "times": 1
    },
    {
      "author": "steve",
      "coAuthor": "diana",
      "times": 1
    },
    {
      "author": "natasha",
      "coAuthor": "tonystark",
      "times": 2
    },
    {
      "author": "bruce_banner",
      "coAuthor": "rohdy",
      "times": 2
    },
    {
      "author": "steve",
      "coAuthor": "natasha",
      "times": 2
    },
    {
      "author": "barry.allen",
      "coAuthor": "oliver",
      "times": 2
    },
    {
      "author": "barry.allen",
      "coAuthor": "steve",
      "times": 1
    }
  ],
  "authors": [
    "john.reese",
    "zoe.morgan",
    "tonystark",
    "steve",
    "diana",
    "natasha",
    "bruce_banner",
    "rohdy",
    "barry.allen",
    "oliver"
  ]
}
```

## Developers Guide

### Prerequisites

- [talisman](https://github.com/thoughtworks/talisman)
- [Node.js v16.13.1](https://nodejs.org)
- [nvm](https://github.com/nvm-sh/nvm)
- [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) (maintainers only)

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
