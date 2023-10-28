/// <reference types="cypress" />
// Inspired from https://github.com/joomla/joomla-cms/blob/5.0-dev/tests/System/integration/install/Installation.cy.js

// type definitions for Cypress object "cy"
import "joomla-cypress";

describe(`Install Joomla 3 and module zitat-service`, () => {
  it("Install Joomla 3 and module zitat-service", function () {

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

    cy.installJoomla(config);

    cy.doAdministratorLogin(config.username, config.password);

    // added to visit admin
    cy.visit("administrator");
    cy.disableStatistics();

    cy.setErrorReportingToDevelopment();

    // cy.installExtensionFromUrl('https://www.zitat-service.de/joomla/mod_zitat_service_de_1.4.2.zip')
    cy.installExtensionFromFolder("/quote_joomla/src"); // as mounted in docker image

    cy.publishModule("zitat-service.de");

    cy.displayModuleOnAllPages("zitat-service.de");
    cy.setModulePosition("zitat-service.de", "sidebar-right");

    cy.doAdministratorLogout();

    // show the module zitat-service at home page
    cy.visit("/");
  });
});
