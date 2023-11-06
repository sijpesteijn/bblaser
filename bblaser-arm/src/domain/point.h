//
// Created by Gijs Sijpesteijn on 03/11/2018.
//

#ifndef BB_LASER_POINT_H
#define BB_LASER_POINT_H

#include <sys/types.h>

class point {
public:
    point(u_int16_t x, u_int16_t y);

    point(u_int16_t x, u_int16_t y, u_int16_t z);

    u_int16_t getX() const;

    u_int16_t getY() const;

    u_int16_t getZ() const;

private:
    u_int16_t _x;
    u_int16_t _y;
    u_int16_t _z;
};


#endif //BB_LASER_POINT_H
