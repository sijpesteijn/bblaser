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
#include <fcntl.h>
#include <unistd.h>

#ifndef __APPLE__
#include <linux/spi/spidev.h>
#endif

spi::spi(int nr) {
    this->nr = nr;
    this->connect();
}

void spi::connect() {
#ifndef __APPLE__
    char filename[20];
    sprintf(filename, "/dev/spidev1.%d", this->nr);
    if ((this->spi_fd = open(filename, this->flags)) < 0) {
        log::error("SPI: Can't open device");
    } else {
        log::debug("SPI " + to_string(this->nr) + " openend.");
    }
    if (ioctl(this->spi_fd, SPI_IOC_WR_MODE, &this->mode) == -1) {
        log::error("SPI: Can't set SPI mode.");
    } else {
        log::debug("SPI mode set to " + to_string(this->mode));
    }
    if (ioctl(this->spi_fd, SPI_IOC_WR_BITS_PER_WORD, &this->bits_per_word) == -1) {
        log::error("SPI: Can't set bits per word.");
    } else {
        log::debug("SPI bits per word set to " + to_string(this->bits_per_word));
    }
    if (ioctl(this->spi_fd, SPI_IOC_WR_MAX_SPEED_HZ, &this->speed) == -1) {
        log::error("SPI: Can't set max HZ");
    } else {
        log::debug("SPI speed set to " + to_string(this->speed));
    }
#endif
}

int spi::send(unsigned char tx[], unsigned int length) {
#ifndef __APPLE__
    unsigned char rx[length];
    struct spi_ioc_transfer transfer;
    transfer.tx_buf = (unsigned long)tx;
    transfer.rx_buf = (unsigned long)rx;
    transfer.len = length;
    transfer.delay_usecs = 0;
    transfer.speed_hz = this->speed;
    transfer.bits_per_word = this->bits_per_word;
    // send the SPI message (all of the above fields, inc. buffers)
    int status = ioctl(this->spi_fd, SPI_IOC_MESSAGE(1), &transfer);
    if (status < 0) {
        log::debug("Spi error: " + to_string(status));
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
    if (this->send(data, sizeof(data)) == -1) {
        perror("Failed to update output.");
    }
}

void spi::spi_close() {
#ifndef __APPLE__
    close(this->spi_fd);
#endif
}

