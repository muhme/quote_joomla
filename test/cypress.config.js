const { defineConfig } = require("cypress");
const fs = require('fs');

// import the available Joomla versions
const { joomla_versions } = require('../joomla_versions.js');

// set and validate used Joomla! version
const JOOMLA_VERSION = process.env.JOOMLA_VERSION || '5.0';
if (!joomla_versions.includes(JOOMLA_VERSION)) {
  throw new Error(`Invalid JOOMLA_VERSION environment variable provided: ${JOOMLA_VERSION}. Possible values are ${joomla_versions}`);
}
// ports 2034 ... 2050
const port = `20${JOOMLA_VERSION.replace('.', '')}`;
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
