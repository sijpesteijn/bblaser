
# Beaglebone image
sudo dd bs=1m if=bone-debian-10.3-iot-armhf-2020-04-06-4gb.img of=/dev/disk4

# Image op beaglebone plaatsen

Open /boot/uEnv.txt

Uncomment last line in file, save and reboot

Wait for flashing of EMMC. (knight rider animation then all blinking)

# Beaglebone - breadboard connections

```
P9_2 (gnd) - black
P9_6 (5 Volt) - red
P9_11 (wit) - MCP4922 pin 3 (!CS)
P9_12 (oranje) - MCP4922 pin 8 (!LDAC)
P9_15 (wit) - MCP4901 pin 2 (kleur rood)
P9_18 (groen) - MCP4922 pin 5 (SDI)
P9_22 (geel) - MCP4922 pin 4 (SCK = clock)
P9_24 (wit) - MCP4901 pin 2 (kleur groen)
P9_27 (wit) - MCP4901 pin 2 (kleur blauw)
```

# PCB

MCP4901 (8 bit, 255) dac (colors)

MCP4922 (12 bit, 4096) dac (x/y)

# ILDA connector to pcd connector
```
20 - Blue-
7  - Blue+
19 - Green-
6  - Green+
18 - Red-
5  - Red+
15 - Y-
2  - Y+
14 - X-
1  - X+
25 - Ground
17 - Jumper Interlock B
4  - Jumper Interlock A
```

# Debian on Beaglebone prerequisites

sudo apt update

sudo apt -y install build-essential cmake gdb libjansson-dev

(When needed update static const char -> static const signed char regel 103 in restbed/source/corvusoft/restbed/uri.cpp)

git clone https://github.com/Corvusoft/restbed.git

cd restbed

git submodule init

git submodule update

mkdir build

cd build

cmake -DBUILD_SHARED=YES -DBUILD_EXAMPLES=NO -DBUILD_TESTS=NO -DBUILD_SSL=YES ..

make install

sudo mkdir /usr/local/include/restbed
sudo cp -R ../distribution/include/* /usr/local/include/restbed
sudo cp librestbed.a /usr/local/lib/
sudo cp librestbed.so.4.8 /usr/local/lib/
cd /usr/local/lib/
sudo ln -s librestbed.so.4.8 librestbed.so.4
sudo ln -s librestbed.so.4 librestbed.so
sudo ldconfig
sudo ldconfig -v

Now you can build the application. 
#SPI

- SPI0: Connect wire from P9_18 and P9_21
- SPI1: Connect wire from P9_29 and P9_30

edit /boot/uEnv.txt
add: 
- uboot_overlay_addr4=/lib/firmware/BB-SPIDEV0-00A0.dtbo
- uboot_overlay_addr5=/lib/firmware/BB-SPIDEV1-00A0.dtbo
```
for i in 17 18 19 20 21 22 28 29 30 31 42; 
    do echo config-pin P9.$i spi;
done
```

```
sudo ./spidev_test --device /dev/spidev1.0
```

#SETUP BBB
update /boot/uEnv.txt with `optargs=quiet capemgr.disable_partno=BB-BONELT-HDMI,BB-BONELT-HDMIN`

# For SPI1, /dev/spidev0.0
config-pin p9_17 spi_cs   (chip select)
config-pin p9_18 spi      (serial out)
config-pin p9_21 spi      (serial in)
config-pin p9_22 spi_sclk (clock)

```
sudo ./spidev_test --device /dev/spidev0.0
```

# For SPI0, /dev/spidev1.#
config-pin p9_28 spi_cs   (chip select)
config-pin p9_29 spi      (serial out)
config-pin p9_30 spi      (serial in)
config-pin p9_31 spi_sclk (clock)

```
sudo ./spidev_test --device /dev/spidev1.0
```

config-pin P9.11 gpio (gpio30)
config-pin P9.15 gpio (gpio48)
config-pin P9.24 gpio (gpio15)
config-pin P9.27 gpio (gpio115)

eventueel `echo <number> > export`

