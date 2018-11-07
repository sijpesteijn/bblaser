#!/bin/bash

echo Update ubuntu
apt-get update
apt-get -y upgrade
apt-get -y install cmake

# Format sd card

(maybe: apt-get install parted)

parted /dev/mmcblk0 -s "mklabel GPT"
parted /dev/mmcblk0 -s "mkpart primary 0% 100%"
mkfs.ext2 /dev/mmcblk0p1

echo Mounting sd card
mkdir /media/card
sudo mount -t ext4 -o rw /dev/mmcblk0p1 /media/card

touch /media/card/uEnv.txt
# mmcdev=1
# bootpart=1:2
# mmcroot=/dev/mmcblk1p2 ro
# optargs=quiet

# add to /etc/fstab /dev/mmcblk0p1    /media/card      auto   rw   0 0

echo Moving stuff to sdcard
mkdir /media/card/notouch
mkdir /media/card/notouch/home
mkdir /media/card/notouch/root
mkdir /media/card/notouch/var
mkdir /media/card/notouch/var/cache
cp -R /home /media/card/notouch/home
cp -R /root /media/card/notouch/root
cp -R /var/cache /media/card/notouch/var/cache
rm -rf /home
rm -rf /root
rm -rf /var/cache
ln -s /media/card/notouch/home /home
ln -s /media/card/notouch/root /root
ln -s /media/card/notouch/var/cache /var/cache
mount --bind /media/card/notouch/home /home
mount --bind /media/card/notouch/root /root
mount --bind /media/card/notouch/var/cache /var/cache

echo Installing restbed

git clone https://github.com/Corvusoft/restbed.git
apt-get -y install libssl-dev
cd restbed
git submodule init
git submodule update
mkdir build
cd build
cmake -DBUILD_SHARED=YES -DBUILD_EXAMPLES=NO -DBUILD_TESTS=NO -DBUILD_SSL=YES ..
make install

mkdir /usr/local/include/restbed
cp -R ../distribution/include/* /usr/local/include/restbed
cp ../distribution/library/librestbed.so.4.6.0 /usr/local/lib
ln -s /usr/local/lib/librest.so.4.6.0 /usr/local/lib/librestbed.so.4
ln -s /usr/local/lib/librest.so.4 /usr/local/lib/librestbed.so
ldconfig

echo Installing jansson
apt-get -y install libjansson-dev

echo Finished