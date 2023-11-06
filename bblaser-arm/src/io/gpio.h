//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#ifndef BB_LASER_GPIO_H
#define BB_LASER_GPIO_H


#include <cstdio>
#include <fstream>

#define OUTPUT_PIN 1

using namespace std;

class gpio {
public:
    explicit gpio(uint16_t nr, char *header_name);

    ~gpio();

    void setValue(uint16_t val);

private:
    uint16_t nr;
    char *header_name;
    uint16_t direction;
    ofstream value_file_descriptor;

    void open();
};


#endif //BB_LASER_GPIO__H
