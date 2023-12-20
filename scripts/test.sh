#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# test.sh - end-to-end test module mod_zitat_service_de
#         - with argument 3, 4 or 5 for one Joomla version; w/o argument for all three Joomla versions
#         - cypress options can be added with CYPRESS_OPTIONS env var, e.g. CYPRESS_OPTIONS="video=true"

source scripts/common.sh
checkVersion $*

for version in ${versions[@]}; do
    echo "*** Testing module mod_zitat_service_de in Joomla $version"
    docker exec -it quote_joomla_cypress sh -c "JOOMLA_VERSION=$version cypress run --spec cypress/e2e/test.cy.ts $options"
done
