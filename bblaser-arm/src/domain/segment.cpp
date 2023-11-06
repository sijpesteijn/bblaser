//
// Created by Gijs Sijpesteijn on 27/10/2018.
//

#include "segment.h"

segment::segment(color *col, int total_points, point *points) {
    this->col = col;
    this->total_points = total_points;
    this->points = points;
}

color *segment::getColor() {
    return this->col;
}

point *segment::getPoints() {
    return this->points;
}

int segment::getTotalPoints() const {
    return this->total_points;
}