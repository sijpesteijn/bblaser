//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#ifndef BB_LASER_SPI_H
#define BB_LASER_SPI_H

#include <unitypes.h>
#include <fstream>

#ifdef __APPLE__
#define SYSFS_SPI_DIR "/Users/gijssijpesteijn/programming/c/bb-laser/resources/spis/"
#else
#define SYSFS_GPIO_DIR "/dev/spidev1."
#endif

using namespace std;
class spi {
public:
    spi(int nr, int bit_per_word, int mode, int speed, int flags);
    void write8Bits(unsigned char reg, unsigned char value);
    void write12Bits(unsigned char reg, unsigned char value);
private:
    fstream spi_fd;
    int nr;
    uint8_t bits_per_word; /*!< @brief is used to hold the bits per word size of SPI */
    uint8_t mode; /*!< @brief is used to hold the mode of SPI */
    uint32_t speed; /*!< @brief is used to hold the speed of SPI */
    uint8_t flags;
    void open();
    int send(unsigned char tx[], int length);
};


#endif //BB_LASER_SPI_H
