#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/backend" && PORT=3001 npm run start:dev &
cd "$(dirname "$0")/frontend" && npm start &

wait
