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

# Log in to GHCR
echo $CR_PAT | docker login ghcr.io -u $GH_USERNAME --password-stdin

# Determine version
VERSION=$(git describe --tags --always --dirty)
echo "Using image version: $VERSION"

# Build & push backend
docker build -t ghcr.io/$GH_USERNAME/url-shortener-backend:$VERSION ./backend
docker push ghcr.io/$GH_USERNAME/url-shortener-backend:$VERSION

# Build & push frontend
docker build -t ghcr.io/$GH_USERNAME/url-shortener-frontend:$VERSION ./frontend
docker push ghcr.io/$GH_USERNAME/url-shortener-frontend:$VERSION

echo "All images pushed with tag: $VERSION"
