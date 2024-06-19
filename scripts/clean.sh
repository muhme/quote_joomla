#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# clean.sh - delete all quote_joomla_* docker containers and quote_joomla_default network
#
# or use simpe 'docker compose down'

PREFIX="quote_joomla_"
NETWORK_NAME="${PREFIX}default"

echo "*** Remove following Docker containers"
docker ps -a --format '{{.Names}}' | grep "^${PREFIX}" | xargs -r docker rm -f

echo "*** Remove following Docker network"
if docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
  docker network rm "$NETWORK_NAME"
fi
