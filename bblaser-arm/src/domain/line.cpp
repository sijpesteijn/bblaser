//
// Created by Gijs Sijpesteijn on 27/10/2018.
//

#include "line.h"
#include "../log.h"

line::line(string str) {
    this->red = str.substr(0, 2);
    this->green = str.substr(2, 2);
    this->blue = str.substr(4, 2);
    this->setPoints(str.substr(6, str.length()));
}

string line::getRed() {
    return this->red;
}

string line::getGreen() {
    return this->green;
}

string line::getBlue() {
    return this->blue;
}

void line::setPoints(string str) {
    int total = str.length() / 8;
    for (int i = 0; i < total; i++) {
//        log::debug(str.substr(i * 8, 4) + " " + str.substr((i * 8) + 4, 4));
        point p(str.substr(i * 8, 4), str.substr((i * 8) + 4, 4));
        this->points.push_back(p);
    }
}

list<point> line::getPoints() {
    return this->points;
}