#!/bin/bash
#
# Copyright (c) 2023 - 2025 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# common.sh - functionality sourced by the other bash scripts

#
# function to check if an array contains a specific value
#
containsElement() {
    local element match="$1"
    shift
    for element; do
        [[ "$element" == "$match" ]] && return 0
    done
    return 1
}

# available Joomla versions
all_versions=(3 4 5 6)

#
# if version given, then check if available
# set ${all_versions[*]} and ${versions[*]} arrays
# set config_cypress_options from env var CYPRESS_OPTIONS or as empty string
# set minor as two-number e.g. "50"
#
checkVersion() {
    if [ "$#" -gt 1 ] || ([ "$#" -eq 1 ] && ! containsElement "$1" "${all_versions[@]}"); then
        echo "*** Error: no argument (for all) or Joomla version from: ${all_versions[@]}"
        exit 1
    fi

    if [ "$#" -ne 0 ]; then
        versions=("$1")
    else
        versions=${all_versions[*]}
    fi

    config_cypress_options=""
    if [ "$CYPRESS_OPTIONS" != "" ]; then
        config_cypress_options="--config $CYPRESS_OPTIONS"
    fi
}

#
# check valid Joomla version as one argument
#
checkOneVersion() {
    if [ "$#" -ne 1 ] || ! containsElement "$1" "${all_versions[@]}"; then
        echo "*** Error: needs Joomla version as one and only argument from: ${all_versions[@]}"
        exit 1
    fi
}
