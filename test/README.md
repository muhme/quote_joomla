# Test

This `test` subfolder contains a set of automated tests developed for the `mod_zitat_service_de` Joomla module extension. These tests aim to ensure the integrity and reliability of the module's functionality across Joomla versions 3, 4 and 5. 

For an overview of the module and its features, please refer to the main [../README.md](../README.md) file located in the parent directory.

## Test Environment

[Cypress](https://www.cypress.io/) is used as the platform for the automated browser testing. It can be used either headless with Docker container `quote_joomla_cypress` or from local host installation with GUI.

### NPM Package joomla-cypress

As a base for the Cypress test automation in Joomla 4 and Joomla 5 the npm package [joomla-projects/joomla-cypress](https://github.com/joomla-projects/joomla-cypress/tree/develop) in development branch is used. Currently my fork is used until all the fixes are packed in next version. If you wish to run Cypress on local host machine you have to install the dependencies:
```
host$ npm i
```

Joomla 3 is not supported, installation and test is Cypress 'native' implemented and switched via environment variable `JOOMLA_VERSION`.

### 1st Preparing with the Installation

As preparation for the end-to-end tests you can use automated Joomla and module installation.

:warning: You have to remember for each new created docker container you can run installation only once.

You can use the prepared docker container `quote_joomla_cypress` to install with Cypress headless mode e.g. for Joomla 5:
```
host$ scripts/install.sh 5

  (Run Starting)

  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        13.3.0                                                               │
  │ Browser:        Electron 114 (headless)                                              │
  │ Node Version:   v20.6.1 (/usr/local/bin/node)                                        │
  │ Specs:          1 found (install.cy.js)                                              │
  │ Searched:       cypress/e2e/install.cy.j                                             │
  └──────────────────────────────────────────────────────────────────────────────────────┘
                                                                                                    
  Running:  install.cy.js                                                         (1 of 1)

  Install Joomla 4 and module zitat-service
    ✓ Install Joomla and module zitat-service (40084ms)

  (Run Finished)

       Spec                                    Tests  Passing  Failing  Pending  Skipped  
  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  install.cy.js                  00:40        1        1        -        -        - │
  └──────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!              00:40        1        1        -        -        -  
```

:bulb: **Tip:** You can also install all three Joomla versions at once:
```
host$ scripts/install.sh
```

### 2nd Testing

There is the end-to-end test suite `test.cy.js` with actual 66 tests for the different four module and three advanced options in the five supported languages. You can run with script e.g. for Joomla 5:
```
host$ scripts/test.sh 5
```
<details>
  <summary>See screen recording sample.</summary>

  ![Cypress headless test run](../images/test_run.gif)
</details>

#### Interactive on Local Host

You can choose the desired Joomla! version with environment variable `JOOMLA_VERSION`. [Cypress](https://www.cypress.io/) can be started inside subfolder `test`.
```
host$ cd test
host$ JOOMLA_VERSION=4 npx cypress open
```

In Cypress, you use E2E Testing, launch your favorite browser and with the `install.cy.js` script you have automatic Joomla and module installation. This can run once after the Docker containers are created. And you have the end-to-end module test script `test.cy.js` which can be started multiple times.

![Cypress install screen shoot](../images/install_screen.png)
