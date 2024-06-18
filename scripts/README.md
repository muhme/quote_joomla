# Scripts for a more pleasant and also faster development

These scripts support the development and testing of Joomla module extension `mod_zitat_service_de` (see [../README.md](../README.md)).

The scripts are used on the macOS command line, but should also work on Linux and the Windows subsystem for Linux.

| Script | Description | Additional Info |
| --- | --- | --- |
| [scripts/compose.sh](./compose.sh) | Delete the six Docker containers and build them new | - with optional argument `build` an  docker compose build --no-cache is executed in advance |
| [scripts/exec.sh](./exec.sh) | Get access to the Joomla Docker container and **linking** the module source | - Linking maps the local host folder into the Joomla Docker container to test code changes immediately |
| [scripts/cypress.sh](./cypress.sh) | Open Cypress in GUI mode on local host for desired Joomla version | Needs Cypress installed on host. |
| [scripts/install.sh](./install.sh) | Install Joomla and module `mod_zitat_service_de` | - Using Cypress in headless mode<br>- With argument 3, 4, or 5 you install this one Joomla version; without argument install all three<br>- With environment variable `CYPRESS_OPTIONS`, e.g., `CYPRESS_OPTIONS="video=true" scripts/install.sh 5`<br />- Can only be executed once |
| [scripts/test.sh](./test.sh) | Module end-to-end test | - Using Cypress in headless mode<br>- With argument 3, 4, or 5 you test this one Joomla version; without argument to test all three versions<br>- With environment variable `CYPRESS_OPTIONS`, e.g., `CYPRESS_OPTIONS="video=true" scripts/test.sh 5` |
| [scripts/pack.sh](./pack.sh) | Create Joomla extension ZIP, including SHA512 |  |
| [scripts/clean.sh](./clean.sh) | Removes all quote_joomla_* Docker containers |  |

And now you are ready for ... triple speed :smiley: with the creation of six Docker containers, the installation of Joomla and the modules three times and testing the module in all three Joomla versions with only one command line.
```bash
scripts/compose.sh && scripts/install.sh && scripts/test.sh
```

> [!WARNING]
> After using `scripts/exec.sh` the module folder inside Docker container is symbolic linked. If you uninstall the module in Joomla, you will delete all source files in your host folder! :point_right: Inside container, you have to delete symbolic link before.
