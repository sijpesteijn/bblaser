//
// Created by Gijs Sijpesteijn on 03/11/2018.
//

#include "point.h"

point::point(string x, string y) {
    this->x = x;
    this->y = y;
}

string point::getX() {
    return this->x;
}

string point::getY() {
    return this->y;
}