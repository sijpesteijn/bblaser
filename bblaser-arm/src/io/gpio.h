//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#ifndef BB_LASER_GPIO_H
#define BB_LASER_GPIO_H


#include <cstdio>
#include <fstream>
using namespace std;

#define OUTPUT_PIN 1

class gpio {
public:
    gpio(int nr);
    ~gpio();
    void setValue(int val);
private:
    int nr;
    int direction;
    fstream value_file_descriptor;
    void open();
};


#endif //BB_LASER_GPIO__H
