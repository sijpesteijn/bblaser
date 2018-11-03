//
// Created by Gijs Sijpesteijn on 27/10/2018.
//

#ifndef BB_LASER_LINE_H
#define BB_LASER_LINE_H

#include <string>
#include <list>
#include "point.h"

using namespace std;

//struct point {
//    string x;
//    string y;
//};

class line {
public:
    line(string str);

    string getRed();

    string getGreen();

    string getBlue();

    list<point> getPoints();

private:
    string red;
    string green;
    string blue;
    list<point> points;
    void setPoints(string str);
};

#endif //BB_LASER_LINE_H
