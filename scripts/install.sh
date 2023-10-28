#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# install.sh - install Joomla and module mod_zitat_service_de
#              with argument 3, 4 or 5 install this Joomla version; w/o argument install all three

if [ "$#" -gt 1 ] || ([ "$#" -eq 1 ] && { [ "$1" != "3" ] && [ "$1" != "4" ] && [ "$1" != "5" ]; }); then
    echo "Error: no argument (for all) or one argument 3, 4 or 5 for the repective Joomla version"
    exit 1
fi

if [ "$#" -ne 0 ]; then
    versions=("$1")
else
    versions=(3 4 5)
fi

for version in "${versions[@]}"; do
    echo "installing Joomla $1 and module mod_zitat_service_de"
    if [ "$version" -eq 3 ]; then
        # own Cypress 'native' installation
        docker exec -it quote_joomla_cypress sh -c "JOOMLA_VERSION=$version cypress run --spec cypress/e2e/install3.cy.js"
    else
        docker exec -it quote_joomla_cypress sh -c "JOOMLA_VERSION=$version cypress run --spec cypress/e2e/install.cy.js"
    fi
done
