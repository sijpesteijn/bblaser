//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#include <cstdio>
#include <syslog.h>
#include "spi.h"
#include "io.h"
#include "../log.h"
#include <sys/ioctl.h>
#include <cmath>

#ifndef __APPLE__
#include <linux/spi/spidev.h>
#endif

spi::spi(int nr, uint8_t bits_per_word, uint8_t mode, uint32_t speed, uint8_t flags) {
    this->nr = nr;
    this->connect();
    this->bits_per_word = bits_per_word;
    this->mode = mode;
    this->speed = speed;
    this->flags = flags;
}

void spi::connect() {
#ifndef __APPLE__
    char filename[20];
    sprintf(filename, "/dev/spidev1.%d", this->nr);
    this->spi_fd = open(filename, this->flags);
    if (ioctl(this->spi_fd, SPI_IOC_WR_MODE, this->mode) == -1) {
        perror("SPI: Can't set SPI mode.");
    }
    if (ioctl(this->spi_fd, SPI_IOC_WR_BITS_PER_WORD, this->bits_per_word) == -1) {
        perror("SPI: Can't set bits per word.");
    }
    if (ioctl(this->spi_fd, SPI_IOC_WR_MAX_SPEED_HZ, this->speed) == -1) {
        perror("SPI: Can't set max HZ");
    }
#endif
}

int spi::send(unsigned char tx[], int length) {
#ifndef __APPLE__
    unsigned char rx[length];
    struct spi_ioc_transfer transfer = {
            .tx_buf = tx,
            .rx_buf = rx,
            .len = length,
            .delay_usecs = 0,
            .speed_hz = this->speed,
            .bits_per_word = this->bits_per_word,
    };
    // send the SPI message (all of the above fields, inc. buffers)
    int status = ioctl(this->spi_fd, SPI_IOC_MESSAGE(1), &transfer);
    if (status < 0) {
        perror("SPI: SPI_IOC_MESSAGE Failed");
    }
#endif
return 0;
}

void spi::write8Bits(unsigned char reg, unsigned char value) {
    unsigned char data[2] = {};
    data[0] = reg | ((value & 0xf0) >> 4);
    data[1] = (value & 0x0f) << 4;
    if (this->send(data, sizeof(data)) == -1) {
        perror("Failed to update output.");
    }

}

void spi::write12Bits(unsigned char reg, unsigned char value) {
    unsigned char data[2] = {};
    data[0] = reg | ((value & 0xff00) >> 8);
    data[1] = (value & 0x00ff);
//    log::debug("write12Bits");
//    log::debug(to_string(data[0]));
//    log::debug(to_string(data[1]));
    if (this->send(data, sizeof(data)) == -1) {
        perror("Failed to update output.");
    }
}

