//
// Created by Gijs Sijpesteijn on 14/01/2021.
//

#ifndef BB_LASER_ARM_COLOR_H
#define BB_LASER_ARM_COLOR_H

class color {
public:
    color(int red, int green, int blue);
    int getRed() const;
    int getGreen() const;
    int getBlue() const;
private:
    int red;
    int green;
    int blue;
};


#endif //BB_LASER_ARM_COLOR_H
