#!/usr/bin/env bash

_ensure_nvm() {
  if ! type nvm &>/dev/null; then
    export NVM_DIR="$HOME/.nvm"
    # shellcheck disable=SC1091 disable=SC1090
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  fi

  if ! type nvm &>/dev/null; then
    echo "Please install nvm!" 1>&2
    exit 1
  fi
  nvm use || nvm install
}

_bootstrap(){
  _ensure_nvm

  yarn install
  yarn lerna bootstrap
}

_test() {
  _bootstrap

  yarn lint

  # shellcheck disable=SC2035
  shellcheck -x *.sh
}

_format_sources() {
  _bootstrap

  yarn lint:fix

  # shellcheck disable=SC2035
  shellcheck -x *.sh
}

_check() {
  _ensure_nvm
  yarn audit --production --audit-level=high
  yarn lerna exec --concurrency 1 --stream 'yarn audit --production --audit-level=high'
}

_bump_version() {
  _ensure_nvm
  # shellcheck disable=SC2068
  yarn lerna version --conventional-commits --no-private --sign-git-tag $@
}

_bump_server_version() {
  _ensure_nvm

  pushd "server" > /dev/null || exit
    yarn config set version-tag-prefix "pairing-matrix@v"
    yarn config set version-git-message "build: Update pairing matrix server version to v%s"
    # shellcheck disable=SC2068
    yarn version $@
    yarn config delete version-tag-prefix
    yarn config delete version-git-message
  popd > /dev/null || exit
}

_publish() {
  _ensure_nvm

  yarn lerna publish from-git
}

_docker_build() {
  # shellcheck disable=SC2002
  # shellcheck disable=SC2155
  local version=$(cat "server/package.json" | jq -r ".version")

  docker build -t "pairing-matrix:v${version}" .
}
