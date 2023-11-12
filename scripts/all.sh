#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# all.sh - start docker container &&
#          install Joomla + the five languages + multilingual samples + install +module mod_zitat_service_de &&
#              with argument 3, 4 or 5 install this Joomla version; w/o argument install all three
#            - cypress options can be added with CYPRESS_OPTIONS env var, e.g. CYPRESS_OPTIONS="video=true"

source scripts/common.sh
checkVersion $1

for version in ${versions[@]}; do

    minor=$(twoNumbers $version)

    scripts/run.sh $version && \
    sleep 5 && \
    scripts/install.sh $version && \
    scripts/test.sh $version && \
    echo "remove container" && \
    docker ps -a --format '{{.Names}}' | grep "^quote_joomla_${minor}" | xargs docker rm -f

done
