//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#include "laser.h"
#include "../log.h"
#include "segment.h"
#include <unistd.h>

laser::laser() {
    this->axis_gpio = new gpio(60); // P9_12
    this->axis_gpio->setValue(1);

    this->colors1_gpio = new gpio(15); // P9_24
    this->colors1_gpio->setValue(1);

    this->colors2_gpio = new gpio(48); // P9_15
    this->colors2_gpio->setValue(1);

    this->axis_ldac_gpio = new gpio(115); // P9_27
    this->axis_ldac_gpio->setValue(1);

    this->spi_bus = new spi(0);
    this->setColor(new color(0,0,0));
    usleep(500);
    log::debug("Laser initialized.");
}

void laser::close() {
    this->spi_bus->spi_close();
    log::debug("Laser halted.");
}

bool laser::isEnabled() const {
    return enable;
}

void laser::enabled() {
    this->enable = true;
}

void laser::disable() {
    this->enable = false;
    this->setPoint(new point(0,0));
    this->setColor(new color(0,0,0));
}

void laser::setPoint(point *p) {
    this->axis_gpio->setValue(0);
    this->spi_bus->write12Bits(0x70, p->getX());
    this->spi_bus->write12Bits(0xf0, p->getY());
    this->axis_gpio->setValue(1);

    this->axis_ldac_gpio->setValue(0);
//    usleep(10);
    this->axis_ldac_gpio->setValue(1);
}

void laser::setColor(color *col) {
    this->colors1_gpio->setValue(0);
    this->spi_bus->write8Bits(0x70, col->getRed());
    this->colors1_gpio->setValue(1);
    this->colors1_gpio->setValue(0);
    this->spi_bus->write8Bits(0xf0, col->getGreen());
    this->colors1_gpio->setValue(1);
    this->colors2_gpio->setValue(0);
    this->spi_bus->write8Bits(0xf0, col->getBlue());
    this->colors2_gpio->setValue(1);
}