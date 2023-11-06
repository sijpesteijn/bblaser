//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#include "spi.h"
#include "../log.h"
#include <unistd.h>
#include <iostream>
#include <sys/ioctl.h>

using namespace std;

void setupSpi_0() {
    system("config-pin p9_17 spi_cs");
    system("config-pin p9_18 spi");
    system("config-pin p9_21 spi");
    system("config-pin p9_22 spi_sclk");
}

void setupSpi_1() {
    system("config-pin p9_28 spi_cs");
    system("config-pin p9_29 spi");
    system("config-pin p9_30 spi");
    system("config-pin p9_31 spi_sclk");
}

spi::spi(uint8_t spi_id) {
    this->spi_id = spi_id;
    this->connect();
}

void spi::connect() {
#ifndef __APPLE__
    spi_id == 0 ? setupSpi_0() : setupSpi_1();
    char filename[20];
    sprintf(filename, "/dev/spidev%d.0", spi_id);
    if ((this->spi_fd = open(filename, this->flags)) < 0) {
        log::error("SPI: Can't open device");
    } else {
        log::debug("SPI 1.0 openend.");
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

u_int8_t spi::send(u_int8_t tx[], uint32_t length) const {
#ifndef __APPLE__
//    cout << "tx: " << tx[0] << " len: " << length << endl;
    char rx[length];
    struct spi_ioc_transfer transfer{};
    transfer.tx_buf = (unsigned long) tx;
    transfer.rx_buf = (unsigned long) rx;
    transfer.len = length;
    transfer.delay_usecs = 0;
    transfer.speed_hz = this->speed;
    transfer.bits_per_word = this->bits_per_word;
    // send the SPI message (all of the above fields, inc. buffers)
    int status = ioctl(this->spi_fd, SPI_IOC_MESSAGE(1), &transfer);
    if (status < 0) {
        log::debug("Spi error: " + to_string(status));
        perror("SPI: SPI_IOC_MESSAGE Failed");
        return -1;
    }
#endif
    return 0;
}

void spi::write8Bits(u_int8_t reg, u_int8_t value) const {
    u_int8_t data[2] = {};
    data[0] = reg | ((value & 0xf0) >> 4);
    data[1] = (value & 0x0f) << 4;
    if (this->send(data, sizeof(data)) == -1) {
        perror("Failed to update output.");
    }
}

void spi::write12Bits(u_int8_t reg, u_int16_t value) const {
    u_int8_t data[2] = {};
    data[0] = reg | ((value & 0xff00) >> 8);
    data[1] = (value & 0x00ff);
    if (this->send(data, sizeof(data)) == -1) {
        perror("Failed to update output.");
    }
}

void spi::spi_close() const {
#ifndef __APPLE__
    close(this->spi_fd);
#endif
}

