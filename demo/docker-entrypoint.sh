#!/bin/bash
set -e

echo "writing env-config.sh"

bash /usr/share/nginx/html/env-config.sh

exec "$@"