# Pairing Matrix engine

[![NPM version](https://img.shields.io/npm/v/pairing-matrix-engine.svg)](https://www.npmjs.com/package/pairing-matrix-engine)
This package required codebase to build pairing matrix using github commits. The expected github commit structure is following

```text
<commit message>

Addresses <issue/card number>

Co-authored-by: <co-author name> <co-author email>
```

**Note**: Co-author syntax follows [github co-author recommendation](https://docs.github.com/en/github-ae@latest/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors#creating-co-authored-commits-on-github-ae)

## Installation

Use your favourite package manager:

- [npm](https://npmjs.org): `npm install pairing-matrix-engine`
- [yarn](https://yarnpkg.com/): `yarn add pairing-matrix-engine`

## Usage

Include into your JavaScript app as an ES Module:

```javascript
import PairingMatrixGenerator from "pairing-matrix-engine";

const pairingMatrixGenerator = new PairingMatrixGenerator(
  username,
  repos,
  basePath,
  sshIdentityFilePath
);

await pairingMatrixGenerator.generatePairingMatrix(
  14,
  true,
  PairingMatrixGenerator.AGGREGATE_BY_DAYS
);
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
await pairingMatrixGenerator.generatePairingMatrix(
  sinceDays,
  [pullData],
  [aggreateBy],
  [cardNumberPrefix]
);

// await pairingMatrixGenerator.generatePairingMatrix(14, true, PairingMatrixGenerator.AGGREGATE_BY_DAYS);
// await pairingMatrixGenerator.generatePairingMatrix(14, true, PairingMatrixGenerator.AGGREGATE_BY_ISSUE, "Addresses");
```

Generate pairing matrix for given days. `generatePairingMatrix` returns a `Promise`.

###### Parameters

- `pullData` is an optional Boolean parameter, depends on this parameter `generatePairingMatrix` will pull data from GitHub and create the pairing matrix. By default, it is set to **false**.
- `aggreateBy` is an optional parameter, which indicates the aggregation needs to used while generating pairing matrix. Currently, it supports following options
  - `PairingMatrixGenerator.AGGREGATE_BY_DAYS` aggregate by days
  - `PairingMatrixGenerator.AGGREGATE_BY_ISSUE` aggregate by issue (default)
- `cardNumberPrefix` is an optional parameter which indicates the reference _prefix_ for card/issue number. By default, it set to `Addresses`. This parameter is only used when `aggreateBy` is set to `PairingMatrixGenerator.AGGREGATE_BY_ISSUE`.

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
