# Pairing Matrix Server

This package is getting used while we are running the pairing matrix application.

## Project setup

```
yarn install
```

## Start Server

```shell
CONFIG_PATH=<config path> yarn start
```

### Config file

```json
{
  "repos": ["<List of repos>"],
  "username": "<username>",
  "basePath": "<base path where cloned repos will be stored>",
  "sshIdentityFilePath": "<ssh file path>"
}
```
