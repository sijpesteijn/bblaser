//
// Created by Gijs Sijpesteijn on 03/11/2018.
//


#include "point.h"

point::point(u_int16_t x, u_int16_t y) {
    this->_x = x;
    this->_y = y;
    this->_z = 0;
}

point::point(u_int16_t x, u_int16_t y, u_int16_t z) {
    this->_x = x;
    this->_y = y;
    this->_z = z;
}

u_int16_t point::getX() const {
    return this->_x;
}

u_int16_t point::getY() const {
    return this->_y;
}

u_int16_t point::getZ() const {
    return this->_z;
}