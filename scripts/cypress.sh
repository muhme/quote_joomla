#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# cypress.sh - open Cypress GUI on local host for desired Joomla version

source scripts/common.sh
checkOneVersion $*

echo "*** Open Cypress for Joomla $1"
cd test && export "JOOMLA_VERSION=$1" && npx cypress open
