#!/bin/bash

PORTS=(3000 3001)

for PORT in "${PORTS[@]}"; do
    PID=$(ss -tlnp | grep ":$PORT" | awk -F'pid=' '{print $2}' | awk -F',' '{print $1}')

    if [ -n "$PID" ]; then
        echo "Killing process on port $PORT (PID: $PID)"
        kill -9 "$PID"
    else
        echo "No process found on port $PORT"
    fi
done
