#!/bin/bash

export COMMIT=$(git rev-parse --short HEAD)

docker-compose build
docker stack deploy -c docker-compose.yml --resolve-image always haxcms-on-demand
