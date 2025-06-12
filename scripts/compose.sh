#!/bin/bash
#
# Copyright (c) 2023 - 2025 Heiko Lübbe
# This software is licensed under the MIT License.
# For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
#
# compose.sh - delete the six docker containers and build them new

scripts/clean.sh

# Get the newest Joomla version Docker images
for major in 3 4 5 6; do
  docker pull "joomla:${major}"
done

echo '*** Prepare Joomla 6 Language Update Server Hack ***'
mkdir -p mirror/language/details5
for file in translationlist_5.xml \
            details5/uk-UA_details.xml \
            details5/es-ES_details.xml \
            details5/ja-JP_details.xml \
            details5/de-DE_details.xml; do
  echo "*** Creating 'mirror/${file}' file"
  curl -s "https://update.joomla.org/language/${file}" -o "mirror/language/${file}"
done
cp mirror/language/translationlist_5.xml mirror/language/translationlist_6.xml
for file in mirror/language/details5/*.xml; do
  echo "Patching '${file} as 6.0"
  sed 's/\(<targetplatform name="joomla" version="\)5\.[^"]*\(" *\/>\)/\16.0\2/' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done


mkdir -p ./nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/certs/self.key -out ./nginx/certs/self.crt -subj "/CN=update.joomla.org"

if [ $# -eq 1 ] && [ "$1" = "build" ] ; then
  echo '*** Docker compose build --no-cache'
  docker compose build --no-cache
fi

echo '*** Docker compose up'
docker compose up -d

echo '*** Joomla 6 Language Update Server Hack ***'
docker cp nginx/certs/self.crt quote_joomla_6:/usr/local/share/ca-certificates/update_joomla_org.crt
docker exec quote_joomla_6 update-ca-certificates
docker restart quote_joomla_6
