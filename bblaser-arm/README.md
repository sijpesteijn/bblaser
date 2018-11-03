echo Installing restbed

git clone https://github.com/Corvusoft/restbed.git
apt-get -y install libssl-dev
cd restbed
git submodule init
git submodule update
mkdir build
cd build
cmake -DBUILD_SHARED=YES -DBUILD_EXAMPLES=NO -DBUILD_TESTS=NO ..
make install

mkdir /usr/local/include/restbed
cp -R ../distribution/include/* /usr/local/include/restbed
cp ../distribution/library/librestbed.so.4.6.0 /usr/local/lib
ln -s /usr/local/lib/librest.so.4.6.0 /usr/local/lib/librestbed.so.4
ln -s /usr/local/lib/librest.so.4 /usr/local/lib/librestbed.so
ldconfig

echo Installing jansson
apt-get -y install libjansson-dev

echo Installing wifi dongle TL-WN823N

apt-get install linux-headers-$(uname -r)
git clone https://github.com/Mange/rtl8192eu-linux-driver.git
cd rtl8192eu-linux-driver
make ARCH=arm
make install

echo Finished