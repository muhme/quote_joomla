#!/bin/bash
#
# Copyright (c) 2023 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# pack.sh - create the installable package
# - version number is taken from manifest file 
# - requires github release with same version
# - have to be started in project root directory
#
# inspired from https://github.com/zero-24/plg_system_httpheader/blob/master/build/build.sh

# -e exist if a command fails
# -u attempt to use an unset variable.
# -o pipefail the pipeline's return status is the value of the last (rightmost) command to exit with a non-zero status
set -euo pipefail

TMP=/tmp/$(basename $0).$$
trap 'rm -rf $TMP' 0

#
# calculate SHA-512 hash for given file name
#
calculate_hash() {
  local FILE="$1"  
  # Check if sha512sum exists
  if command -v sha512sum &> /dev/null; then
    sha512sum "$FILE" | awk '{print $1}'
  # If sha512sum doesn't exist, fall back to shasum omn Mac OS
  elif command -v shasum &> /dev/null; then
    shasum -a 512 "$FILE" | awk '{print $1}'
  # If neither command is found, print an error message
  else
    echo "Error: Command sha512sum or shasum not found." >&2
    return 1
  fi
}

#
# main
#
MANIFEST="src/mod_zitat_service_de.xml" # module extension manfifest file
VERSION=$(grep '<version>' "$MANIFEST" | sed -n 's/.*<version>\(.*\)<\/version>.*/\1/p')
ZIP="dist/mod_zitat_service_de_${VERSION}.zip" # module extension packed as ZIP
UPDATE="dist/update.xml"

if [ ! -f "$MANIFEST" ]; then 
    echo "Error: Missing file \"$MANIFEST\" – are you in project root directory?"
    exit 1
fi

# create zip
(cd src && zip -r "../${ZIP}" . --quiet)

# calculate hash
HASH=$(calculate_hash "$ZIP")

# update hash and version in update.xml
sed "s|\(.*<sha512>\).*</sha512>|\1${HASH}</sha512>|; \
     s|\(.*<version>\).*</version>|\1${VERSION}</version>|; \
     s|\(.*\)/download/.*/mod_zitat_service_de_.*\.zip\(.*\)|\1/download/${VERSION}/mod_zitat_service_de_${VERSION}.zip\2|" $UPDATE > $TMP && cp $TMP $UPDATE

# work is done
echo "version $VERSION packed as $ZIP and $UPDATE updated"
