
/*
 * MIT License, Copyright (c) 2023 Heiko Lübbe
 * https://github.com/muhme/quote_wordpress
 * 
 * joomla-cypress.d.ts - declare used methods
 */
declare namespace Cypress {
    interface Chainable {
        // only this that I use in testHelper.ts
        doAdministratorLogin(username: string, password: string): Chainable<Element>;
    }
}
