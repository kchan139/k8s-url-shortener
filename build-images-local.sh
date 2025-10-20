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

# Build & push backend
podman build -t url-shortener-backend:dev ./backend
podman save url-shortener-backend:dev | sudo k3s ctr images import -

# Build & push frontend
podman build -t url-shortener-frontend:dev ./frontend
podman save url-shortener-frontend:dev | sudo k3s ctr images import -

echo "All images pushed to local repository with tag: dev"
