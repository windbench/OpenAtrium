FROM php:5.6.30-apache

LABEL maintainer="pgancarski@cener.com"
LABEL maintainer="ezubillaga@cener.com"


ENV OA_VERSION 7.x-2.613

RUN apt-get update && apt-get install -y php5-mysql libpng-dev
RUN docker-php-ext-install pdo pdo_mysql
RUN docker-php-ext-install gd
RUN a2enmod rewrite


WORKDIR /var/www/html/

RUN curl -SL https://ftp.drupal.org/files/projects/openatrium-$OA_VERSION-core.tar.gz \
    | tar -zxC /var/www/html --strip-components=1

ADD --chown=www-data:www-data windbench .
ADD --chown=www-data:www-data backup_files ./sites/default/files

COPY config/php.ini /usr/local/etc/php/
COPY --chown=www-data:www-data config/settings.php ./sites/default/settings.php


RUN /etc/init.d/apache2 restart 
