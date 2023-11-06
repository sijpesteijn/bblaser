//
// Created by Gijs Sijpesteijn on 14/01/2021.
//


#include <ostream>
#include "color.h"

color::color(u_int8_t red, u_int8_t green, u_int8_t blue) {
    this->red = red;
    this->green = green;
    this->blue = blue;
}

u_int8_t color::getRed() const {
    return this->red;
}

u_int8_t color::getGreen() const {
    return this->green;
}

u_int8_t color::getBlue() const {
    return this->blue;
}