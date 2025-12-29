#!/bin/bash
#
# Copyright (c) 2023 - 2025 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# compose.sh - delete all quote_joomla_* Docker containers and build them new

scripts/clean.sh

# Get the newest Joomla version Docker images
for major in 3 4 5 6; do
  docker pull "joomla:${major}"
done

if [ $# -eq 1 ] && [ "$1" = "build" ] ; then
  echo '*** Docker compose build --no-cache'
  docker compose build --no-cache
fi

echo '*** Docker compose up'
docker compose up -d
