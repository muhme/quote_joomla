# Scripts for a more pleasant and also faster development

Used on Mac command line, should also work under Linux and Windows subsystem for Linux.

* scripts/build.sh – delete the six docker containers and build them new
* scripts/exec.sh – get access to the Joomla Docker container and linking the module source
* scripts/cypress.sh – open Cypress on host machine for desired Joomla version
* scripts/install.sh - install Joomla and module mod_zitat_service_de
  * with argument 3, 4 or 5 install this Joomla version; w/o argument install all three

And now you are ready for ... double speed :smiley: with the creation of six containers and the installation of Joomla and the modules three times with only one line:
```
$ scripts/build.sh && scripts/install.sh
```
