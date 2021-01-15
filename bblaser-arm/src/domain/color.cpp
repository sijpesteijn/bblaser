//
// Created by Gijs Sijpesteijn on 14/01/2021.
//

#include "color.h"

color::color(int red, int green, int blue) {
    this->red = red;
    this->green = green;
    this->blue = blue;
}

int color::getRed() const {
    return this->red;
}

int color::getGreen() const {
    return this->green;
}

int color::getBlue() const {
    return this->blue;
}