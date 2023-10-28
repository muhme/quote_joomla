# Scripts for a more pleasant and also faster development

Used on Mac command line, should also work under Linux and Windows subsystem for Linux.

* scripts/build.sh – delete the six docker containers and build them new
* scripts/exec.sh – get access to the Joomla Docker container and linking the module source
* scripts/cypress.sh – open Cypress on host machine for desired Joomla version

And now you are ready for ... double speed :smiley:
```
$ scripts/build.sh && scripts/cypress.sh 3 
```
