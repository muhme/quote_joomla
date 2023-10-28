#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# build.sh - delete the six docker containers and build them new

echo 'Removing all docker containers quote_joomla_*'
docker ps -a --format '{{.Names}}' | grep '^quote_joomla_' | xargs docker rm -f

echo 'Creating docker containers new'
docker compose up -d
