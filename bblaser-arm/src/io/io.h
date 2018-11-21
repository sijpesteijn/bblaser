//
// Created by Gijs Sijpesteijn on 21/11/2018.
//

#ifndef BB_LASER_ARM_IO_H
#define BB_LASER_ARM_IO_H

#ifdef __APPLE__
#define SYSFS_GPIO_DIR "/Users/gijssijpesteijn/programming/c/bb-laser/resources/gpios/"
#else
#define SYSFS_GPIO_DIR "/sys/class/gpio/"
#define SYSFS_SPI_DIR "/sys/class/spi/"
#endif


#endif //BB_LASER_ARM_IO_H
