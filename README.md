# quote_joomla
Joomla! module for zitat-service.de

Prepared for Joomla versions 3, 4 and 5. But today it is necessary to note:
* the Joomla! module is currently still using the old API (Perl script) and is to be migrated to the new OpenAPI [api.zitat-service.de](https://api.zitat-service.de/)
* Joomla 3 – there is no automatic installation with Cypress
* Joomla 4 - the automatic installation with Cypress works :smiley:
* Joomla 5 - the automatic installation with Cypress works :smiley:

## Installation

### Docker Containers

There is a Docker based test and development environment prepared:

```
$ git clone https://github.com/muhme/quote_joomla
$ cd quote_joomla
$ docker compose up -d
```

Six Docker containers are running:

```
$ docker ps
IMAGE                   PORTS                  NAMES
mysql                   3306/tcp, 33060/tcp    quote_joomla_mysql
phpmyadmin/phpmyadmin   0.0.0.0:2001->80/tcp   quote_joomla_mysqladmin
joomla:3                0.0.0.0:2003->80/tcp   quote_joomla_3
joomla:4                0.0.0.0:2004->80/tcp   quote_joomla_4
joomla:5.0              0.0.0.0:2005->80/tcp   quote_joomla_5
cypress/included        0.0.0.0:2080->80/tcp   quote_joomla_cypress
```

- quote_joomla_mysqladmin – phpMyAdmin (database user root/root)
  - http://localhost:2001
- quote_joomla_3 – Joomla! 3, ready for installation
  - http://localhost:2003
- quote_joomla_4 – Joomla! 4, ready for installation
  - http://localhost:2004
- quote_joomla_5 – Joomla! 5, ready for installation
  - http://localhost:2005

### joomla-cypress

As a base for the Cypress test automation the npm package [joomla-projects/joomla-cypress](https://github.com/joomla-projects/joomla-cypress) is used. Currently my fork is used until all the fixes are done with the pull request. To install the dependencies do:
```
$ npm i
```

## Testing

You can test the Joomla module with automatic Joomla and module installation.

:warning: You have to remember for each new created docker container you can run installation only once.

### Interactive on Host Machine
You can choose the desired Joomla! version with environment variable `JOOMLA_VERSION`. [Cypress](https://www.cypress.io/) can be started inside subfolder `test`.
```
$ cd test
$ JOOMLA_VERSION=4 npx cypress open
```

In Cypress, you use E2E Testing, launch your favorite browser and with the `install.cy.js` script you have automatic Joomla and module installation. This can run once after the Docker containers are created.

![Cypress install screen shoot](images/install_screen.png)

### Headless With Docker Container
You can use the prepared docker container `quote_joomla_cypress`:
```
$ docker exec -it quote_joomla_cypress cypress run

  (Run Starting)

  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        13.3.0                                                               │
  │ Browser:        Electron 114 (headless)                                              │
  │ Node Version:   v20.6.1 (/usr/local/bin/node)                                        │
  │ Specs:          1 found (install.cy.js)                                              │
  │ Searched:       cypress/e2e/**/*.cy.{js,jsx,ts,tsx}                                  │
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
