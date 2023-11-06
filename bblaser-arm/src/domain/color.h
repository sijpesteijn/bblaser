//
// Created by Gijs Sijpesteijn on 14/01/2021.
//

#ifndef BB_LASER_ARM_COLOR_H
#define BB_LASER_ARM_COLOR_H

class color {
public:
    color(u_int8_t red, u_int8_t green, u_int8_t blue);

    u_int8_t getRed() const;

    u_int8_t getGreen() const;

    u_int8_t getBlue() const;

private:
    u_int8_t red;
    u_int8_t green;
    u_int8_t blue;
};


#endif //BB_LASER_ARM_COLOR_H
