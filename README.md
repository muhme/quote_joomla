# quote_joomla

Joomla! module for zitat-service.de

Supporting Joomla/PHP versions:
| PHP | Joomla |
|-----|--------|
| 8.0 | 3.10   |
| 8.1 | 4.4    |
| 8.2 | 5.0    |

* the Joomla! module is using the new OpenAPI [api.zitat-service.de](https://api.zitat-service.de/)
* development is not yet finished, but the module works in all three Joomla versions

## Test & Development Environment
<details>
  <summary>There is a docker test and development environment prepared, including automated Cypress installation.</summary>

### Docker Containers

There is a Docker based test and development environment prepared:

```
host$ git clone https://github.com/muhme/quote_joomla
host$ cd quote_joomla
host$ docker compose up -d
```

Six Docker containers are running:

```
host$ docker ps
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

As a base for the Cypress test automation the npm package [joomla-projects/joomla-cypress](https://github.com/joomla-projects/joomla-cypress) is used. Currently my fork is used until all the fixes are done with the pull request. If you wish to run Cypress on host machine you have to install the dependencies:
```
host$ npm i
```

### Testing

You can test the Joomla module with automatic Joomla and module installation.

:warning: You have to remember for each new created docker container you can run installation only once.

#### Interactive on Host Machine

You can choose the desired Joomla! version with environment variable `JOOMLA_VERSION`. [Cypress](https://www.cypress.io/) can be started inside subfolder `test`.
```
host$ cd test
host$ JOOMLA_VERSION=4 npx cypress open
```

In Cypress, you use E2E Testing, launch your favorite browser and with the `install.cy.js` script you have automatic Joomla and module installation. This can run once after the Docker containers are created.

![Cypress install screen shoot](images/install_screen.png)

#### Headless With Docker Container

You can use the prepared docker container `quote_joomla_cypress`:
```
host$ docker exec -it quote_joomla_cypress sh -c "JOOMLA_VERSION=5 cypress run --spec cypress/e2e/install.cy.js"

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

### Development

One way to work inside the Docker container is to use "Attach to running Docker container" from VS Code.

If you want to sync your checkout with Docker as well, that's a bit tricky. The reason is that the Joomla container uses a volume for folder `/var/www/html` and inside the folder `modules/mod_zitat_service_en` does not exist before the module installation.  As an example for the Joomla 5 container:
```
host$ docker exec -it quote_joomla_5 /bin/bash
quote_joomla_5# cd /var/www/html/modules
quote_joomla_5# rm -r mod_zitat_service_de
quote_joomla_5# ln -s /quote_joomla mod_zitat_service_de
```

### Scripts for 

There are scripts prepared for a more pleasant and also faster development, see folder [scripts](./scripts/)

</details>

## License

MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe, see [LICENSE](LICENSE)

## Contact

Don't hesitate to ask if you have any questions or comments. If you encounter any problems or have suggestions for enhancements, please feel free to [open an issue](../../issues).
