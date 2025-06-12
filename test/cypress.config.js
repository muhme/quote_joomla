// Cypress configuration file
// 
// Copyright (c) 2023 - 2025 Heiko Lübbe
// This software is licensed under the MIT License.
// For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT

const { defineConfig } = require("cypress");
const fs = require('fs');

// set and validate used Joomla! version
const JOOMLA_VERSION = process.env.JOOMLA_VERSION || '5';
if (!['3', '4', '5', '6'].includes(JOOMLA_VERSION)) {
  throw new Error(`Invalid JOOMLA_VERSION environment variable provided: ${JOOMLA_VERSION}. Possible values are ${joomla_versions}`);
}
// ports 2003 ... 2006
const port = `200${JOOMLA_VERSION}`;
const host = fs.existsSync('/.dockerenv') ? 'host.docker.internal' : 'localhost';

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: `http://${host}:${port}/`,
    supportFile: "cypress/support/index.js",
  },
  env: {
    joomla_version: `${JOOMLA_VERSION}`,
    sitename: `Joomla ${JOOMLA_VERSION} CMS Test`,
    name: "Admin Tester",
    email: "admin@example.com",
    username: "admin",
    password: "admin12345678",
    db_type: "MySQLi",
    db_host: "mysql",
    db_name: `joomla${port}`,
    db_user: "root",
    db_password: "root",
    db_prefix: "jos_",
  },
});
