//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#ifndef BB_LASER_SPI_H
#define BB_LASER_SPI_H

#include <cstdint>
#include <fcntl.h>

#ifndef __APPLE__

#include <linux/types.h>
#include <linux/spi/spidev.h>

#endif

/*Definitions specific to spidev1.0 */
/**
 * spi0.0: CS = P9_17, SCLK = P9_22, D0 = P9_21, D1 = P9_18
 * spi1.0: CS = P9_28, SCLK = P9_31, D0 = P9_29, D1 = P9_30
 */

class spi {
public:
    explicit spi(uint8_t spi_id);

    void write8Bits(uint8_t reg, uint8_t value) const;

    void write12Bits(uint8_t reg, uint16_t value) const;

    uint8_t send(uint8_t tx[], uint32_t length) const;

    void spi_close() const;

private:
    int spi_fd{};

    uint8_t bits_per_word = 8; /*!< @brief is used to hold the bits per word size of SPI */
    uint8_t mode = 0; /*!< @brief is used to hold the mode of SPI */
    uint32_t speed = 10000000; /*!< @brief is used to hold the speed of SPI */
    uint8_t flags = O_RDWR;
    uint8_t spi_id;

    void connect();

};

#endif //BB_LASER_SPI_H
