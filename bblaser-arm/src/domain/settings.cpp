//
// Created by Gijs Sijpesteijn on 24/06/2024.
//

#include "settings.h"

double settings::getCorrLX() const {
    return this->corr_l_x;
}

double settings::getCorrRX() const {
    return this->corr_r_x;
}

void settings::setCorrLX(double corr_l_x) {
    this->corr_l_x = corr_l_x;
}

void settings::setCorrRX(double corr_r_x) {
    this->corr_r_x = corr_r_x;
}