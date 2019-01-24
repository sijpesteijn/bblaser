//
// Created by Gijs Sijpesteijn on 21/11/2018.
//

#ifndef BB_LASER_ARM_IO_H
#define BB_LASER_ARM_IO_H

#ifdef __APPLE__
#define SYSFS_GPIO_DIR "/Users/gijs.sijpesteijn/programming/java/bblaser/bblaser-arm/resources/gpios/"
#else
#define SYSFS_GPIO_DIR "/sys/class/gpio/"
#define SYSFS_SPI_DIR "/sys/class/spidev/"
#endif


#endif //BB_LASER_ARM_IO_H
