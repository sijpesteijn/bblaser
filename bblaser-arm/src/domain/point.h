//
// Created by Gijs Sijpesteijn on 03/11/2018.
//

#ifndef BB_LASER_POINT_H
#define BB_LASER_POINT_H

class point {
public:
    point(int x, int y);
    int getX() const;
    int getY() const;

private:
    int x;
    int y;
};


#endif //BB_LASER_POINT_H
