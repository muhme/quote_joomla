#!/bin/bash
#
# Copyright (c) 2023 - 2024 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# install.sh - Install Joomla and module mod_zitat_service_de
#            - With argument 3, 4 or 5 install this Joomla version; w/o argument install all three
#            - Cypress options can be added with CYPRESS_OPTIONS env var, e.g. CYPRESS_OPTIONS="video=true"
#            - Electron enable logging to see console messages can be turned on by env var ELECTRON_ENABLE_LOGGING=1

source scripts/common.sh
checkVersion $*

echo "*** npm clean install"
npm ci

success=0
failed=0
for version in ${versions[@]}; do
    echo "*** Installing Joomla $version and module mod_zitat_service_de"
    node_modules/wait-on/bin/wait-on -l -t "60s" "http://localhost:200${version}" 

    electron_enable_logging=""
    if [ "$ELECTRON_ENABLE_LOGGING" == "1" ]; then
        electron_enable_logging="ELECTRON_ENABLE_LOGGING=1"
    fi

    if docker exec -it quote_joomla_cypress sh -c "$electron_enable_logging JOOMLA_VERSION=$version \
              cypress run --spec cypress/e2e/install.cy.js $config_cypress_options"; then
      success=$((success + 1))
    else
      failed=$((failed + 1))
    fi
done

echo "Finished with ${success} successful installation/s and ${failed} failed installation/s. Have a nice day."
