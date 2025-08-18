#!/bin/bash
#
# Copyright (c) 2023 - 2024 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# test.sh - End-To-End (E2E) test the Joomla module mod_zitat_service_de
#         - With argument 3, 4 or 5 for one Joomla version; w/o argument for all three Joomla versions
#         - Cypress options can be added with CYPRESS_OPTIONS env var, e.g. CYPRESS_OPTIONS="video=true"
#         - Electron enable logging to see console messages can be turned on by env var ELECTRON_ENABLE_LOGGING=1

source scripts/common.sh
checkVersion $*

electron_enable_logging=""
if [ "$ELECTRON_ENABLE_LOGGING" == "1" ]; then
    electron_enable_logging="ELECTRON_ENABLE_LOGGING=1"
fi

success=0
failed=0
for version in ${versions[@]}; do
    echo "*** Testing module mod_zitat_service_de in Joomla $version"
    if docker exec -it quote_joomla_cypress sh -c "$electron_enable_logging JOOMLA_VERSION=$version \
           cypress run --spec cypress/e2e/test.cy.ts $options"; then
      success=$((success + 1))
    else
      failed=$((failed + 1))
    fi
done

echo "Finished with ${success} successful test/s and ${failed} failed test/s. Have a nice day."
