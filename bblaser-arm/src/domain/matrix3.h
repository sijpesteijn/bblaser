//
// Created by Gijs Sijpesteijn on 24/05/2021.
//

#ifndef BB_LASER_ARM_MATRIX3_H
#define BB_LASER_ARM_MATRIX3_H

#include "point.h"
#include "defines.h"

class matrix3 {

public:
    long m[3][3] = {
            {PRES, 0, 0},
            {0, PRES, 0},
            {0,    0, PRES}
    };

    static point *applyMatrix(const matrix3 &matrix, const point &in);

    static void multiply(const matrix3 &mat1, const matrix3 &mat2, matrix3 &result);

    static matrix3 rotateX(const unsigned int angle);

    static matrix3 rotateY(const unsigned int angle);

    static matrix3 rotateZ(const unsigned int angle);
};

#endif //BB_LASER_ARM_MATRIX3_H
