# quote_joomla

![Joomla module mod_zitat_service_de configuration screen shot](images/quote_joomla.png)

Joomla module `mod_zitat_service_de` to display random quotes from community [zitat-service.de](https://www.zitat-service.de).

Help for the Joomla module administration is available in five languages at [https://github.com/muhme/quote_joomla/wiki](https://github.com/muhme/quote_joomla/wiki).

Tested Joomla/PHP versions are:
| Joomla | PHP |
|--------|-----|
| 3.10   | 8.0 |
| 4.4    | 8.1 |
| 5.0    | 8.2 |

* the Joomla module is using the new OpenAPI [api.zitat-service.de](https://api.zitat-service.de/)

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
- quote_joomla_3 – Joomla 3, ready for installation
  - http://localhost:2003
- quote_joomla_4 – Joomla 4, ready for installation
  - http://localhost:2004
- quote_joomla_5 – Joomla 5, ready for installation
  - http://localhost:2005

### Testing

Automated Cypress tests are in subfolder [test](./test/) and detailed README there.

### Development

One way to work inside the Docker container is to use "Attach to running Docker container" from VS Code.

If you want to sync your checkout with Docker as well, that's a bit tricky. The reason is that the Joomla container uses a volume for folder `/var/www/html` and inside the folder `modules/mod_zitat_service_en` does not exist before the module installation.  As an example for the Joomla 5 container:
```
host$ docker exec -it quote_joomla_5 /bin/bash
quote_joomla_5# cd /var/www/html/modules
quote_joomla_5# rm -r mod_zitat_service_de
quote_joomla_5# ln -s /quote_joomla mod_zitat_service_de
```

> [!WARNING]
> If you uninstall the module after symbolic linking the module folder you delete all source files in your host folder! :point_right: Inside container, you have to delete symbolic link before.

### Scripts

There are scripts prepared for a more pleasant and also faster development, see folder [scripts](./scripts/) and commented list of scripts there.

</details>

## License

MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe, see [LICENSE](LICENSE)

## Contact

Don't hesitate to ask if you have any questions or comments. If you encounter any problems or have suggestions for enhancements, please feel free to [open an issue](../../issues).
