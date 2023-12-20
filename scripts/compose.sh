#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# compose.sh - delete the six docker containers and build them new

echo '*** Removing all docker containers quote_joomla_*'
docker ps -a --format '{{.Names}}' | grep '^quote_joomla_' | xargs docker rm -f

if [ $# -eq 1 ] && [ "$1" = "build" ] ; then
  echo '*** Docker compose build --no-cache'
  docker compose build --no-cache
fi

echo '*** Docker compose up'
docker compose up -d
