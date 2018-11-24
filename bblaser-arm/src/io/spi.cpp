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
    sprintf(filename, "/sys/class/spidev/spidev1.%d", this->nr);
    if ((this->spi_fd = open(filename, this->flags)) < 0) {
        perror("SPI: Can't open device");
    }
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

