#!/bin/bash
set -e

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
PROJECT_ROOT="$(cd -P "$(dirname "$SOURCE")" && pwd)"

if [ -f "$PROJECT_ROOT/.env" ]; then
  source "$PROJECT_ROOT/.env"
else
  echo ".env not found in $PROJECT_ROOT" >&2
  exit 1
fi

if command -v podman &> /dev/null; then
    TOOL=podman
elif command -v docker &> /dev/null; then
    TOOL=docker
else
    echo "Error: podman or docker is not installed." >&2
    exit 1
fi

# Build & push backend
$TOOL build -t localhost/url-shortener-backend:dev ./backend
$TOOL save localhost/url-shortener-backend:dev | sudo k3s ctr images import -

# Build & push frontend
$TOOL build -t localhost/url-shortener-frontend:dev ./frontend
$TOOL save localhost/url-shortener-frontend:dev | sudo k3s ctr images import -

echo "All images pushed to local repository with tag: dev"
