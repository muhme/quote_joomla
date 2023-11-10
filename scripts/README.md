# Scripts for a more pleasant and also faster development

These scripts support the development and testing of Joomla module extension `mod_zitat_service_de` (see [../README.md](../README.md)).

The scripts are used on the Mac command line, but should also work on Linux and the Windows subsystem for Linux.

* scripts/compose.sh – delete the six docker containers and build them new
* scripts/exec.sh – get access to the Joomla Docker container and linking the module source
* scripts/cypress.sh – open Cypress in GUI mode on host machine for desired Joomla version
* scripts/install.sh - install Joomla and module mod_zitat_service_de
  * using Cypress in headless mode
  * with argument 3, 4 or 5 install this Joomla version; w/o argument install all three
  * with environment variable CYPRESS_OPTIONS, e.g. CYPRESS_OPTIONS="video=true" scripts/install.sh 4
* scripts/pack.sh - create Joomla extension ZIP, including SHA512

And now you are ready for ... double speed :smiley: with the creation of six Docker containers and the installation of Joomla and the modules three times with only one command line:
```
$ scripts/compose.sh && sleep 5 && scripts/install.sh
```
