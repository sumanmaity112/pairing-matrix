#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" ; pwd -P)"

# Source glob libs
  # shellcheck source=lib.sh
. "${SCRIPT_DIR}/lib.sh"


_usage() {
    cat <<EOF
Usage: $0 command
commands:
  bootstrap                                            Install dependencies across all packages
  check                                                Run security checks across all packages
  format                                               Auto format source files across all packages
  test                                                 Build and test all packages
  bump-version                                         Bump up version for packages
  publish                                              Publish newly created version to npm registry  
EOF
  exit 1
}

CMD=${1:-}
shift || true
case ${CMD} in
  bootstrap) _bootstrap ;;
  check) _check ;;
  format) _format_sources ;;
  test) _test ;;
  bump-version) _bump_version "$@" ;;
  publish) _publish ;;
  *) _usage ;;
esac

