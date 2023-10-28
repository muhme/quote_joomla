/// <reference types="cypress" />

// Copyright (c) 2023 Heiko Lübbe
// This software is licensed under the MIT License.
// For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
//
// Cypress automated Joomla 3.10 multilingual installation with five languages + module installation and configuration

describe(`Install Joomla 3 and module zitat-service`, () => {
  it("Install Joomla 3 and module zitat-service", function () {

    const languages = ["German", "Japanese", "Spanish", "Ukrainian"];

    // load installation page
    cy.visit('installation/index.php')

    // Select en-GB as installation language
    // This element <select#jform_language.chzn-select-deselect> is not visible because it has CSS property: display: none
    // cy.get('#jform_language').select('English (United Kingdom)')
    cy.get('#jform_language').select('English (United Kingdom)', {force: true})

    // 1st screen: fill sitename
    cy.get('#jform_site_name').type(Cypress.env("sitename"))
    // fill admin
    cy.get('#jform_admin_user').type(Cypress.env("username"))
    cy.get('#jform_admin_password').type(Cypress.env("password"))
    cy.get('#jform_admin_password2').type(Cypress.env("password"))
    cy.get('#jform_admin_email').type(Cypress.env("email"))

    // click Next
    cy.get('a.btn.btn-primary').first().click()

    // 2nd screen: database
    cy.get('#jform_db_host').clear().type(Cypress.env("db_host"))
    cy.get('#jform_db_user').type(Cypress.env("db_user"))
    cy.get('#jform_db_pass').type(Cypress.env("db_password"))
    cy.get('#jform_db_name').clear().type(Cypress.env("db_name"))

    // click Next
    cy.get('a.btn.btn-primary').first().click()

    // 3rd screen
    // click Next
    cy.get('a.btn.btn-primary').first().click()

    // 4th screen
    // install additional languages
    cy.get('a#instLangs.btn.btn-primary').click()

    // 5th screen
    languages.forEach((language) => {
      cy.contains('label', language).click()
    })
    // click Next
    cy.get('a.btn.btn-primary').first().click()

    // 6th screen
    // activate multi language
    // This element <input#jform_activateMultilanguage> is not visible because it has CSS property: display: none
    // cy.get('#jform_activateMultilanguage0', { timeout: 60000, force: true }).check()
    cy.get('label[for="jform_activateMultilanguage0"]', { timeout: 60000 }).click();

    // click Next
    cy.get('a.btn.btn-primary').first().click()

    // 7th screen
    // delete installation directory
    cy.get('.btn.btn-warning').click()

    // do admin login
    cy.visit('administrator/index.php')
    cy.get('#mod-login-username').type(Cypress.env("username"))
    cy.get('#mod-login-password').type(Cypress.env("password"))
    cy.get('button.btn.btn-primary.btn-block.btn-large.login-button').click()

    // install module
    cy.visit('administrator/index.php?option=com_installer#folder')
    cy.get('#install_directory', {force: true}).clear().type("/quote_joomla/src")
    cy.get('#installbutton_directory').click()

    // configure module 1/3 - open Module tab
    cy.visit('administrator/index.php?option=com_modules')
    cy.get('a').contains('zitat-service.de').click()
    // This element <select#jform_published.chzn-color-state> is not visible because it has CSS property: display: none
    cy.get('#jform_published.chzn-color-state').select('Published', {force: true})
    
    // configure module 2/3 - choose position-7
    cy.get('#jform_position + .chzn-container').click();
    cy.get('.chzn-drop .chzn-results li').contains('position-7').click();
    
    // configure module 3/3 - Menu assignment tab
    cy.get('a[href="#assignment"]').click()
    // cy.get('#jform_assignment').select('On all pages')
    // This element <select#jform_assignment> is not visible because it has CSS property: display: none
    // ChatGPT "Joomla 3.10 uses a JavaScript library called "Chosen" to enhance <select> dropdowns
    //          in the administration area. The "Chosen" library transforms standard select boxes into more
    //          user-friendly dropdowns. Understanding this can help us create the right Cypress commands." :)
    cy.get('#jform_assignment + .chzn-container').click()
    cy.get('.chzn-drop .chzn-results li').contains('On all pages').click()
    // Save & Close
    cy.get('button.btn.btn-small.button-save').click()

    // show the module zitat-service at home page
    cy.visit("/");
  })

});
