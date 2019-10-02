#!/bin/bash
set -e

bash /usr/share/nginx/html/env-config.sh

exec "$@"