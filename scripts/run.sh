#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# run.sh - install Joomla and test module mod_zitat_service_de
#              with argument 3, 4 or 5 install this Joomla version; w/o argument install all three
#            - cypress options can be added with CYPRESS_OPTIONS env var, e.g. CYPRESS_OPTIONS="video=true"

source scripts/common.sh
checkVersion $1

for version in ${versions[@]}; do

    minor=$(twoNumbers $version)

    docker ps -a --format '{{.Names}}' | grep "^quote_joomla_${minor}" | xargs docker rm -f >/dev/null 2>&1
    # we will not display is a container found or not

    echo "Starting docker container quote_joomla_${minor}"
    docker run -d \
        --name "quote_joomla_${minor}" \
        --network quote_joomla_default \
        -e JOOMLA_DB_HOST=quote_joomla_mysql \
        -e JOOMLA_DB_PASSWORD=root \
        -p "20${minor}:80" \
        -v $(pwd):/quote_joomla \
        --restart unless-stopped \
        "joomla:${version}-alpine" > /dev/null
        # we will not display the container ID

done
