//
// Created by Gijs Sijpesteijn on 27/10/2018.
//

#ifndef BB_LASER_LINE_H
#define BB_LASER_LINE_H

#include <list>
#include "point.h"
#include "color.h"

using namespace std;

class segment {
public:
    segment(color *col, int total_points, point *points);

    color *getColor();

    int getTotalPoints() const;

    point *getPoints();

private:
    color *col;
    int total_points;
    point *points;
};

#endif //BB_LASER_LINE_H
