#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# cypress.sh - open Cypress GUI on host machine for desired Joomla version

if [ "$#" -ne 1 ] || { [ "$1" -ne 3 ] && [ "$1" -ne 4 ] && [ "$1" -ne 5 ]; }; then
    echo "Error: argument must be 3, 4 or 5 for the repective Joomla version"
    exit 1
fi

echo "open Cypress for Joomla $1"
cd test && export "JOOMLA_VERSION=$1" && npx cypress open
