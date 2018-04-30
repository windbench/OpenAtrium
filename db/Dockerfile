FROM mysql:5.7
LABEL maintainer="ezubillaga@cener.com"

ARG DB_USER
ARG DB_PASSWORD

# Change the working directory
WORKDIR /docker-entrypoint-initdb.d

# Copy the database schema to the /data directory

# TODO move the secrets to .env file
ENV MYSQL_DATABASE=OADrupal7
ENV MYSQL_USER ${DB_USER}
ENV MYSQL_PASSWORD ${DB_PASSWORD}
ENV MYSQL_ALLOW_EMPTY_PASSWORD=yes

RUN service mysql restart 


