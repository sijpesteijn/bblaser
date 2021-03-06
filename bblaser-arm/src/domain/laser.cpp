//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#include <cmath>
#include <sstream>
#include <fcntl.h>
#include "laser.h"
#include "../log.h"
#include "line.h"
#include <unistd.h>

laser::laser() {
    this->pixels_per_bit = 65535/AXIS_MAX;
    this->axis_gpio = new gpio(60);
    this->axis_gpio->setValue(1);

    this->colors1_gpio = new gpio(15);
    this->colors1_gpio->setValue(1);

    this->colors2_gpio = new gpio(48);
    this->colors2_gpio->setValue(1);

    this->axis_ldac_gpio = new gpio(115);
    this->axis_ldac_gpio->setValue(1);

    this->spi_bus = new spi(0);
    usleep(500);
    log::debug("Laser initialized.");
}

void laser::close() {
    this->spi_bus->spi_close();
    log::debug("Laser halted.");
}

bool laser::isEnabled() {
    return enabled;
}

void laser::setEnabled(bool enabled) {
    this->enabled = enabled;
}

unsigned int hextoint(string hex) {
    unsigned int x;
    stringstream ss;
    ss << std::hex << hex;
    ss >> x;
    return x;
}

void laser::setPoint(point *p) {
    this->p = p;

//    log::debug(this->p->getX());
//    log::debug(to_string((int)hextoint(this->p->getX())));

    this->axis_gpio->setValue(0);
    this->spi_bus->write12Bits(0x70, (int)hextoint(this->p->getX()));
    this->spi_bus->write12Bits(0xf0, (int)hextoint(this->p->getY()));
    this->axis_gpio->setValue(1);

    this->axis_ldac_gpio->setValue(0);
//    usleep(10);
    this->axis_ldac_gpio->setValue(1);
}

void laser::setRed(int red) {
    this->colors1_gpio->setValue(0);
    this->spi_bus->write8Bits(0x70, red);
//    usleep(10);
    this->colors1_gpio->setValue(1);
}

void laser::setGreen(int green) {
    this->colors1_gpio->setValue(0);
    this->spi_bus->write8Bits(0xf0, green);
//    usleep(10);
    this->colors1_gpio->setValue(1);
}

void laser::setBlue(int blue) {
    this->colors2_gpio->setValue(0);
    this->spi_bus->write8Bits(0xf0, blue);
//    usleep(10);
    this->colors2_gpio->setValue(1);
}