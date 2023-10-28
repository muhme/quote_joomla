/// <reference types="cypress" />

// Copyright (c) 2023 Heiko Lübbe
// This software is licensed under the MIT License.
// For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
//
// Cypress automated Joomla 4 and 5 multilingual installation with five languages + module installation and configuration
// 
// Inspired from https://github.com/joomla/joomla-cms/blob/5.0-dev/tests/System/integration/install/Installation.cy.js

// based on npm joomla-cypress, import type definitions for Cypress object "cy"
import "joomla-cypress";

describe(`Install Joomla ${Cypress.env("joomla_version")} and module zitat-service`, () => {
  it("Install Joomla and module zitat-service", function () {
    cy.exec("rm configuration.php", { failOnNonZeroExit: false });

    let config = {
      joomla_version: Cypress.env("joomla_version"),
      sitename: Cypress.env("sitename"),
      name: Cypress.env("name"),
      username: Cypress.env("username"),
      password: Cypress.env("password"),
      email: Cypress.env("email"),
      db_type: Cypress.env("db_type"),
      db_host: Cypress.env("db_host"),
      db_user: Cypress.env("db_user"),
      db_password: Cypress.env("db_password"),
      db_name: Cypress.env("db_name"),
      db_prefix: Cypress.env("db_prefix"),
    };

    const languages = ["German", "Japanese", "Spanish", "Ukrainian"];

    cy.installJoomlaMultilingualSite(config, languages);

    cy.doAdministratorLogin(config.username, config.password);

    // added to visit admin
    cy.visit("administrator");
    cy.disableStatistics();

    cy.setErrorReportingToDevelopment();

    cy.installExtensionFromFolder("/quote_joomla/src"); // as mounted in docker image

    cy.publishModule("zitat-service.de");

    cy.displayModuleOnAllPages("zitat-service.de");
    cy.setModulePosition("zitat-service.de", "sidebar-right");

    cy.doAdministratorLogout();

    // show the module zitat-service at home page
    cy.visit("/");
  });
});
