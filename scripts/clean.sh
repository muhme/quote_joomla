#!/bin/bash
#
# Copyright (c) 2023 - 2024 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# clean.sh - delete all quote_joomla_* docker containers and quote_joomla_default network

PREFIX="quote_joomla_"
NETWORK_NAME="${PREFIX}default"

echo "*** Stopping and removing Docker containers, associated Docker networks and volumes"
docker compose down -v

remaining=$(docker ps -a --format '{{.Names}}' | grep "^${PREFIX}")
if [ -n "${remaining}" ]; then
  echo "*** Remove still existing Docker containers"
  docker rm -f ${remaining}
fi

if docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
  echo "*** Remove still existing Docker network"
  docker network rm "$NETWORK_NAME"
fi
