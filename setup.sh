#!/bin/bash

nginx -s stop

CURR_DIR=`pwd`

nginx -c $CURR_DIR'/nginx_bb_laser.conf'

echo "Setting maven repo"
rm -rf ~/.m2/settings.xml
ln -s ~/.m2/settings.xml_normal ~/.m2/settings.xml

echo "Setting npm"
rm -rf ~/.npmrc
ln -s ~/.npmrc_normal ~/.npmrc