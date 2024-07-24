# Test

This `test` subfolder contains a set of automated tests developed for the `mod_zitat_service_de` Joomla module extension. These tests aim to ensure the integrity and reliability of the module's functionality across Joomla versions 3, 4 and 5. 

For an overview of the module and its features, please refer to the main [../README.md](../README.md) file located in the parent directory.

## Test Environment

The following containers are available after the installation step
to perform manual checks in parallel to the automated tests:

| Container | URL | User / Password |
|-----------|-----|---------|
| `quote_joomla_mysqladmin` | http://localhost:2001 | root / root |
| `quote_joomla_3` | http://localhost:2003 | admin / admin12345678 |
| `quote_joomla_4` | http://localhost:2004 | admin / admin12345678 |
| `quote_joomla_5` | http://localhost:2005 | admin / admin12345678 |

[Cypress](https://www.cypress.io/) is used as the platform for the automated browser testing. It can be used either headless with Docker container `quote_joomla_cypress` or from local host installation with GUI. Some scripts are used for a more pleasant working, see folder [../scripts](../scripts/) and commented list of scripts there.

### NPM Package joomla-cypress

As a base for the Cypress installation in Joomla 4 and Joomla 5 the npm package [joomla-projects/joomla-cypress](https://github.com/joomla-projects/joomla-cypress) is used. If you wish to run Cypress on local host machine you have to clean-install the dependencies:
```
npm ci
```

Joomla 3 is not supported by joomla-cypress. Installation and test for Joomla 3 is Cypress 'native' implemented and switched via environment variable `JOOMLA_VERSION`.

### 1st Preparing with the Installation

As preparation for the end-to-end tests you can use automated Joomla and module installation.

:warning: You have to remember for each new created docker container you can run installation only once.

You can use the prepared docker container `quote_joomla_cypress` to install with Cypress headless mode e.g. for Joomla 5:
```
scripts/install.sh 5
```
Sample Output:
```

  (Run Starting)

  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        13.3.0                                                               │
  │ Browser:        Electron 114 (headless)                                              │
  │ Node Version:   v20.6.1 (/usr/local/bin/node)                                        │
  │ Specs:          1 found (install.cy.js)                                              │
  │ Searched:       cypress/e2e/install.cy.j                                             │
  └──────────────────────────────────────────────────────────────────────────────────────┘
                                                                                                    
  Running:  install.cy.js                                                         (1 of 1)

  *** Install Joomla 5 and module zitat-service
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
scripts/install.sh
```

### 2nd Testing

There is the end-to-end test suite `test.cy.js` with actual 76 tests for the backend translation, the different four module and three advanced options in the five supported languages. You can run with script e.g. for Joomla 5:
```
scripts/test.sh 5
```
<details>
  <summary>See screen recording sample.</summary>

  ![Cypress headless test run](../images/test_run.gif)
</details>

#### Interactive on Local Host

You can run Cypress on the host system, e.g. to use the GUI. Choose the desired Joomla version with environment variable `JOOMLA_VERSION`. [Cypress](https://www.cypress.io/) can be started inside subfolder `test`.
```
cd test
JOOMLA_VERSION=4 npx cypress open
```

In Cypress, you use E2E Testing, launch your favorite browser and with the `install.cy.js` script you have automatic Joomla and module installation. This can run once after the Docker containers are created. And you have the end-to-end module test script `test.cy.js` which can be started multiple times.

![Cypress install screen shoot](../images/install_screen.png)

#### Display Console Messages During Installation or Testing

Console messages in Cypress Test Runner from the Electron browser can be displayed in the JavaScript console
of the Cypress GUI.
If Cypress is executed headless with the install or test script then the environment variable
`ELECTRON_ENABLE_LOGGING=1` can be set.
```
export ELECTRON_ENABLE_LOGGING=1
scripts/install.sh 3
```
