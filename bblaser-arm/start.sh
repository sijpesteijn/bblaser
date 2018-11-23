#!/bin/bash

echo 15 > /sys/class/gpio/unexport
echo 48 > /sys/class/gpio/unexport
echo 60 > /sys/class/gpio/unexport
echo 115 > /sys/class/gpio/unexport

./bb_laser_arm