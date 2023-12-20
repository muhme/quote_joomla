#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# install.sh - install Joomla and module mod_zitat_service_de
#            - with argument 3, 4 or 5 install this Joomla version; w/o argument install all three
#            - cypress options can be added with CYPRESS_OPTIONS env var, e.g. CYPRESS_OPTIONS="video=true"

source scripts/common.sh
checkVersion $*

for version in ${versions[@]}; do
    echo "*** Installing Joomla $version and module mod_zitat_service_de"
    node_modules/wait-on/bin/wait-on -l -t "60s" "http://localhost:200${version}" 
    docker exec -it quote_joomla_cypress sh -c "JOOMLA_VERSION=$version cypress run --spec cypress/e2e/install.cy.js $config_cypress_options"
done
