#!/bin/sh

set -e

if [ "$NODE_ENV" = "development" ]; then
  echo "Starting in development mode..."
  exec yarn dev
else
  echo "Starting in production mode..."
  exec yarn start
fi
