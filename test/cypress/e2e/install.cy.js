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

const major = parseInt(Cypress.env("joomla_version"), 10);

describe(`Install Joomla ${major} and module zitat-service`, () => {
  it("Install Joomla and module zitat-service", function () {
    if (major === 3) {
      // for Joomla 3.* user Cypress 'native' installation
      const languages = ["German", "Japanese", "Spanish", "Ukrainian"];

      // load installation page
      cy.visit("installation/index.php");

      // Select en-GB as installation language
      // This element <select#jform_language.chzn-select-deselect> is not visible because it has CSS property: display: none
      // cy.get('#jform_language').select('English (United Kingdom)')
      cy.get("#jform_language").select("English (United Kingdom)", {
        force: true,
      });

      // 1st screen: fill sitename
      cy.get("#jform_site_name").type(Cypress.env("sitename"));
      // fill admin
      cy.get("#jform_admin_user").type(Cypress.env("username"));
      cy.get("#jform_admin_password").type(Cypress.env("password"));
      cy.get("#jform_admin_password2").type(Cypress.env("password"));
      cy.get("#jform_admin_email").type(Cypress.env("email"));

      // click Next
      cy.get("a.btn.btn-primary", { timeout: 30000 }).first().click();

      // 2nd screen: database
      cy.get("#jform_db_host").clear().type(Cypress.env("db_host"));
      cy.get("#jform_db_user").type(Cypress.env("db_user"));
      cy.get("#jform_db_pass").type(Cypress.env("db_password"));
      cy.get("#jform_db_name").clear().type(Cypress.env("db_name"));

      // click Next
      cy.get("a.btn.btn-primary", { timeout: 30000 }).first().click();

      // 3rd screen
      // click Next
      cy.get("a.btn.btn-primary", { timeout: 30000 }).first().click();

      // 4th screen
      // install additional languages
      cy.get("a#instLangs.btn.btn-primary", { timeout: 30000 }).click();

      // 5th screen
      languages.forEach((language) => {
        cy.contains("label", language).click();
      });
      // click Next
      cy.get("a.btn.btn-primary", { timeout: 30000 }).first().click();

      // 6th screen
      // activate multi language
      // This element <input#jform_activateMultilanguage> is not visible because it has CSS property: display: none
      // cy.get('#jform_activateMultilanguage0', { timeout: 60000, force: true }).check()
      cy.get('label[for="jform_activateMultilanguage0"]', {
        timeout: 60000,
      }).click();

      // click Next
      cy.get("a.btn.btn-primary", { timeout: 30000 }).first().click();

      // 7th screen
      // delete installation directory
      cy.get(".btn.btn-warning", { timeout: 30000 }).click();

      // do admin login
      cy.visit("administrator/index.php");
      cy.get("#mod-login-username").type(Cypress.env("username"));
      cy.get("#mod-login-password").type(Cypress.env("password"));
      cy.get("button.btn.btn-primary.btn-block.btn-large.login-button").click();

      // install module
      cy.visit("administrator/index.php?option=com_installer#folder");
      cy.get("#install_directory", { force: true })
        .clear()
        .type("/quote_joomla/src");
      cy.get("#installbutton_directory").click();

      // configure module 1/3 - open Module tab
      cy.visit("administrator/index.php?option=com_modules");
      cy.get("a").contains("zitat-service.de").click();
      // This element <select#jform_published.chzn-color-state> is not visible because it has CSS property: display: none
      cy.get("#jform_published.chzn-color-state").select("Published", {
        force: true,
      });

      // configure module 2/3 - choose position-7
      cy.get("#jform_position + .chzn-container").click();
      cy.get(".chzn-drop .chzn-results li").contains("position-7").click();

      // configure module 3/3 - Menu assignment tab
      cy.get('a[href="#assignment"]').click();
      // cy.get('#jform_assignment').select('On all pages')
      // This element <select#jform_assignment> is not visible because it has CSS property: display: none
      // ChatGPT "Joomla 3.10 uses a JavaScript library called "Chosen" to enhance <select> dropdowns
      //          in the administration area. The "Chosen" library transforms standard select boxes into more
      //          user-friendly dropdowns. Understanding this can help us create the right Cypress commands." :)
      cy.get("#jform_assignment + .chzn-container").click();
      cy.get(".chzn-drop .chzn-results li").contains("On all pages").click();
      // Save & Close
      cy.get("button.btn.btn-small.button-save").click();
    } else {
      // starting with Joomla 4 use NPM joomla-cypress
      cy.exec("rm configuration.php", { failOnNonZeroExit: false });

      let config = {
        joomla_version: major,
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

      let languages = ["German", "Japanese", "Spanish", "Ukrainian"];

      cy.installJoomlaMultilingualSite(config, languages);

      cy.doAdministratorLogin(config.username, config.password);

      // from Joomla version 5.1 onward, we need to disable the Guided Tour to ensure that subsequent visuals remain unobstructed.
      if (major >= 5) {
        cy.visit("administrator");
        cy.cancelTour();
      }

      // install multilingual sample data
      cy.visit("administrator");
      cy.get('button[data-type="multilang"]').click();
      cy.get("#system-message-container .alert-message", {
        timeout: 30000,
      }).should("contain", "Sample data installed.");

      // added to visit admin
      cy.visit("administrator");
      cy.disableStatistics();

      cy.setErrorReportingToDevelopment();

      cy.installExtensionFromFolder("/quote_joomla/src"); // as mounted in docker image

      cy.publishModule("zitat-service.de");

      cy.displayModuleOnAllPages("zitat-service.de");
      cy.setModulePosition("zitat-service.de", "sidebar-right");

      cy.doAdministratorLogout();
    }

    // show the module zitat-service at home page
    cy.visit("/");

    // first test in asynchron mode
    cy.get("#zitat-service").should("not.be.empty");
    cy.get("#zitat-service .quote").should("exist").and("not.be.empty");
    cy.get("#zitat-service .quote .quotation")
      .should("exist")
      .and("not.be.empty");
  });
});
