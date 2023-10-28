#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# exec.sh - get access to the Joomla Docker container and linking the module source

if [ "$#" -ne 1 ] || { [ "$1" -ne 3 ] && [ "$1" -ne 4 ] && [ "$1" -ne 5 ]; }; then
    echo "Error: argument must be 3, 4 or 5 for the repective Joomla version"
    exit 1
fi

echo "open Joomla $1 container and sym linking modules/mod_zitat_service_de"
docker exec -it "quote_joomla_$1" /bin/bash -c "cd /var/www/html/modules && rm -rf mod_zitat_service_de && ln -s /quote_joomla/src mod_zitat_service_de && ls -l mod_zitat_service_de && bash"
