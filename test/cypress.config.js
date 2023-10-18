const { defineConfig } = require("cypress");
const fs = require('fs');

// set and validate used Joomla! version
const JOOMLA_VERSION = process.env.JOOMLA_VERSION || '4';
if (!['3', '4', '5'].includes(JOOMLA_VERSION)) {
  throw new Error(`Invalid JOOMLA_VERSION environment variable provided: ${JOOMLA_VERSION}. Allowed values are '3', '4', or '5'.`);
}

const host = fs.existsSync('/.dockerenv') ? 'host.docker.internal' : 'localhost';

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: `http://${host}:200${JOOMLA_VERSION}/`,
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
    db_name: `joomla${JOOMLA_VERSION}`,
    db_user: "root",
    db_password: "root",
    db_prefix: "jos_",
  },
});
