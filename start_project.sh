#!/bin/bash

sudo nginx -s stop

CURR_DIR=`pwd`

sudo nginx -c $CURR_DIR'/nginx_bb_laser.conf'

cd ./bblaser-service
mvn spring-boot:run &
cd ../bblaser-web
npm install
npm start &