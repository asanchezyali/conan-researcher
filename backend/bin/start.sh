#!/bin/sh

set -e

if [ "$ENV" = "dev" ]; then
  echo "Starting in development mode..."
  exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
else
  echo "Starting in production mode..."
  # exec ray start --head --dashboard-host 0.0.0.0 --dashboard-port 8265 --block
fi
