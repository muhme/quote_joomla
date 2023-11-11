#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# test.sh - end-to-end test module mod_zitat_service_de
#         - with argument 3, 4 or 5 for one Joomla version; w/o argument for all three Joomla versions
#         - cypress options can be added with CYPRESS_OPTIONS env var, e.g. CYPRESS_OPTIONS="video=true"

if [ "$#" -gt 1 ] || ([ "$#" -eq 1 ] && { [ "$1" != "3" ] && [ "$1" != "4" ] && [ "$1" != "5" ]; }); then
    echo "Error: no argument (for all) or one argument 3, 4 or 5 for the repective Joomla version"
    exit 1
fi

if [ "$#" -ne 0 ]; then
    versions=("$1")
else
    versions=(3 4 5)
fi

options=""
if [ "$CYPRESS_OPTIONS" != "" ]; then
    options="--config $CYPRESS_OPTIONS"
fi

for version in "${versions[@]}"; do
    echo "testing module mod_zitat_service_de in Joomla $1"
    docker exec -it quote_joomla_cypress sh -c "JOOMLA_VERSION=$version cypress run --spec cypress/e2e/test.cy.js $options"
done