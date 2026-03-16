#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/backend" && npm i &
cd "$(dirname "$0")/frontend" && npm i &

