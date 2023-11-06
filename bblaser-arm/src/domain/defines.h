//
// Created by Gijs Sijpesteijn on 24/05/2021.
//


#ifndef BB_LASER_ARM_DEFINES_H
#define BB_LASER_ARM_DEFINES_H

#define PRES             16384
#define PSHIFT           14
#define PROUNDBIT        (1 << (PSHIFT-1))
#define TO_INT(a) ((a + PROUNDBIT)>> PSHIFT)
#define FROM_INT(a) (a << PSHIFT)
#define FROM_FLOAT(a) (long(a*PRES))

#endif //BB_LASER_ARM_DEFINES_H
