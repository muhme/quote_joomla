# quote_joomla
Joomla! module for zitat-service.de

## Docker Containers

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

- quote_joomla_mysql – MySQL database server
  - admin user is root/root
- quote_joomla_mysqladmin – phpMyAdmin (user root/root)
  - http://localhost:2001
- quote_joomla_3 – Joomla! 3, ready for installation
  - http://localhost:2003
- quote_joomla_4 – Joomla! 4, ready for installation
  - http://localhost:2003
- quote_joomla_5 – Joomla! 5, ready for installation
  - http://localhost:2003
