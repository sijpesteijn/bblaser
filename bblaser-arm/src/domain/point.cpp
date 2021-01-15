//
// Created by Gijs Sijpesteijn on 03/11/2018.
//

#include "point.h"

point::point(int x, int y) {
    this->x = x;
    this->y = y;
}

int point::getX() const {
    return this->x;
}

int point::getY() const {
    return this->y;
}