FROM mysql:5.7
LABEL maintainer="ezubillaga@cener.com"

# Change the working directory
WORKDIR /docker-entrypoint-initdb.d

# Copy the database schema to the /data directory

# TODO move the secrets to .env file
ENV MYSQL_DATABASE=OADrupal7
ENV MYSQL_USER user_db
ENV MYSQL_PASSWORD pass_db
ENV MYSQL_ALLOW_EMPTY_PASSWORD=yes

RUN service mysql restart 


