# Pairing Matrix Frontend App

This package is getting used while we are running the pairing matrix application.

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### How to start development server

##### Link local packages

Link local packages with each other by using following command on the project root folder

```shell
./run.sh bootstrap
```

##### Start backend server

Start `server` in development mode by using following command

```shell
cd server
CONFIG_PATH="<config path>" yarn start
```

##### Start vue visualiser

Start `vue-visualiser` in development mode by using following command

```shell
cd vue-visualiser
yarn build:dev
```

**Note**: This step only required if you want to change anything in the `charts` or in vue components presents in `vue-visualiser`

#### Start frontend server

Start `frontend-app` in development mode by using following command

```shell
cd frontend-app
yarn serve
```
