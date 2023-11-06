//
// Created by Gijs Sijpesteijn on 24/05/2021.
//

#include <cmath>
#include "matrix3.h"
#include "defines.h"


static long pMultiply(long x, long y) {
    return ((x * y) + PROUNDBIT) >> PSHIFT;
}

// ----------------------------------------------
// Matrix operation
// ----------------------------------------------
void matrix3::multiply(const matrix3 &mat1, const matrix3 &mat2, matrix3 &mat) {
    unsigned char r, c;
    for (c = 0; c < 3; c++)
        for (r = 0; r < 3; r++)
            mat.m[c][r] = pMultiply(mat1.m[0][r], mat2.m[c][0]) +
                          pMultiply(mat1.m[1][r], mat2.m[c][1]) +
                          pMultiply(mat1.m[2][r], mat2.m[c][2]);
}

matrix3 matrix3::rotateX(const unsigned int angle) {
    matrix3 mat;
    mat.m[1][1] = cos(angle);
    mat.m[1][2] = sin(angle);
    mat.m[2][1] = -sin(angle);
    mat.m[2][2] = cos(angle);
    return mat;
}

matrix3 matrix3::rotateY(const unsigned int angle) {
    matrix3 mat;
    mat.m[0][0] = cos(angle);
    mat.m[0][2] = -sin(angle);
    mat.m[2][0] = sin(angle);
    mat.m[2][2] = cos(angle);
    return mat;
}

matrix3 matrix3::rotateZ(const unsigned int angle) {
    matrix3 mat;
    mat.m[0][0] = cos(angle);
    mat.m[0][1] = sin(angle);
    mat.m[1][0] = -sin(angle);
    mat.m[1][1] = cos(angle);
    return mat;
}

point *matrix3::applyMatrix(const matrix3 &matrix, const point &in) {
    u_int16_t x = (matrix.m[0][0] * in.getX() +
                   matrix.m[1][0] * in.getY() +
                   matrix.m[2][0] * in.getZ()) >> PSHIFT;

    u_int16_t y = (matrix.m[0][1] * in.getX() +
                   matrix.m[1][1] * in.getY() +
                   matrix.m[2][1] * in.getZ()) >> PSHIFT;

    u_int16_t z = (matrix.m[0][2] * in.getX() +
                   matrix.m[1][2] * in.getY() +
                   matrix.m[2][2] * in.getZ()) >> PSHIFT;
    return new point(x, y, z);
}
