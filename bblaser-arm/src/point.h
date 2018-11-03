//
// Created by Gijs Sijpesteijn on 03/11/2018.
//

#ifndef BB_LASER_POINT_H
#define BB_LASER_POINT_H

#include <string>

using namespace std;

class point {
public:
    point(string x, string y);
    string getX();
    string getY();

private:
    string x;
    string y;
};


#endif //BB_LASER_POINT_H
