## BB-Laser

#flash beaglebone

download latest image: https://beagleboard.org/latest-images

unzip using 'The Unarchiver'

sudo dd bs=1m if=bone-debian-9.5-iot-armhf-2018-10-07-4gb.img of=/dev/disk2

insert in beaglebone, once booted edit uEnv.txt and  uncomment cmdline=init=/opt/scripts/tools/eMMC/init-eMMC-flasher-v3.sh

reboot (with flash button pressed) and wait for flashing to finish

#wifi

connmanctl
agent on
services
connect <wifi_id>

#install libraries

follow instructions in ./bblaser-arm/setup_bb.sh
