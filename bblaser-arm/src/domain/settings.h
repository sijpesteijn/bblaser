//
// Created by Gijs Sijpesteijn on 24/06/2024.
//

#ifndef BB_LASER_ARM_SETTINGS_H
#define BB_LASER_ARM_SETTINGS_H

#include <sys/types.h>

class settings {
public:
    double getCorrLX() const;
    double getCorrRX() const;
    void setCorrLX(double corr_l_x);
    void setCorrRX(double corr_r_x);
private:
    double corr_l_x = 0.00005;
    double corr_r_x = 0.00005;
};



#endif //BB_LASER_ARM_SETTINGS_H
