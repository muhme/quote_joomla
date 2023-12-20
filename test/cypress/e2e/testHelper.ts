/// <reference types="cypress" />
/*
 * MIT License, Copyright (c) 2023 Heiko Lübbe
 * https://github.com/muhme/quote_wordpress
 * 
 * test_helper.js - utility methods used in the tests
 */
import "joomla-cypress";

/**
 * Do backend login as admin.
 */
function doLogin() {

  if (Cypress.env("joomla_version") === "3") {
    // do admin login by own
    cy.visit("/administrator/index.php");
    cy.get("#mod-login-username").type(Cypress.env("username"));
    cy.get("#mod-login-password").type(Cypress.env("password"));
    cy.get("button.btn.btn-primary.btn-block.btn-large.login-button").click();
  } else {
    cy.doAdministratorLogin(Cypress.env("username"), Cypress.env("password"));
  }
}
export { doLogin };

/**
 * Open the module zitat-service.de.
 */
function openModule() {

  cy.visit("/administrator/index.php?option=com_modules");
  //cy.searchForItem("zitat-service.de") - don't use as not available for Joomla 3
  cy.contains("a", "zitat-service.de").should("be.visible").click();
}
export { openModule };

  /**
   * Set module options with:
   *   1. backend login as admin
   *   2. open the module zitat-service.de
   *   3. reset all four module options to the default values
   *   4. set given module options with #id to value
   *   5. reset all three advanced options to the default values
   *   6. set given advanced options with #id to value
   *   7. save module configuration
   */
  function setOption(options, advanced = {}) {
    // 1. backend login as admin
    doLogin();

    // 2. open the module zitat-service.de
    openModule();

    // 3. reset all four module options to the default values ('*', respective 'frontend' for language)
    cy.get("#jform_params_user")
      .invoke("val", "")
      .trigger("change", { force: true });
    cy.get("#jform_params_author")
      .invoke("val", "")
      .trigger("change", { force: true });
    cy.get("#jform_params_category")
      .invoke("val", "")
      .trigger("change", { force: true });
    cy.get("#jform_params_language").select("", { force: true });

    // 4. set given module options with #id to value
    Object.entries(options).forEach(([id, value]) => {
      cy.log(`Set module parameter "${id}" to "${value}"`);
      cy.get(id).invoke("val", value).trigger("change", { force: true });
    });

    // 5. reset all three advanced options to the default values (clear, respective 1 for the radio-button)
    if (Cypress.env("joomla_version") === "3") {
      // Joomla 3 uses the Bootstrap 2.x framework for its admin UI
      cy.contains("li a", "Advanced").click();
    } else {
      cy.get(
        'div[role="tablist"] button[aria-controls="attrib-advanced"]'
      ).click();
    }
    cy.get("#jform_params_target").clear();
    cy.get(
      'input[type="radio"][name="jform[params][script]"][value="1"]'
    ).check();
    cy.get("#jform_params_height").clear({ force: true });

    // 6. set given advanced options with #id to value
    Object.entries(advanced).forEach(([id, value]) => {
      if (value === "check") {
        cy.log(`Check advanced parameter "${id}"`);
        cy.get(id).check();
        cy.wait(3000);
      } else {
        cy.log(`Set advanced parameter "${id}" to "${value}"`);
        cy.get(id).invoke("val", value).trigger("change", { force: true });
      }
    });


    // 7. save module configuration
    cy.get("button.button-save").contains("Save & Close").click();
    // Check for the success message (Joomla 3 w/o final dot)
    cy.contains(".alert-message", /Module saved\.?/, { timeout: 30000 }).should(
      "be.visible"
    );

    // ignore backend admin logout
  }
  export {setOption};

  /**
   * do cy.visit() and check for deprecated notice
   * @param string path
   */
  function myVisit(path) {
    cy.visit(path);
    // wait for the body element to be available
    cy.get("body").should(($body) => {
      // get the text of the body element
      const text = $body.text();
      // assert that the 'Deprecated: ' string is not present
      expect(text).not.to.include("Deprecated: ");
      // assert that the 'Warning: ' string is not present
      expect(text).not.to.include("Warning: ");
      // assert that the 'Error: ' string is not present
      expect(text).not.to.include("Error: ");
    });
  }
  export {myVisit};
