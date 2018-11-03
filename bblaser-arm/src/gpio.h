//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#ifndef BB_LASER_GPIO_H
#define BB_LASER_GPIO_H


#include <cstdio>
#include <fstream>
using namespace std;

#ifdef __APPLE__
    #define SYSFS_GPIO_DIR "/Users/gijssijpesteijn/programming/c/bb-laser/resources/gpios/"
#else
    #define SYSFS_GPIO_DIR "/sys/class/gpio/"
#endif
#define MAX_BUF 64


typedef enum {
    INPUT_PIN=0,
    OUTPUT_PIN=1
} PIN_DIRECTION;

class gpio {
public:
    gpio(int nr);
    gpio(int nr, PIN_DIRECTION direction);
    ~gpio();
    void setValue(int val);
    int getValue();
private:
    int nr;
    PIN_DIRECTION direction;
    ofstream export_file_descriptor;
    ofstream direction_file_descriptor;
    fstream value_file_descriptor;
    void open();
};


#endif //BB_LASER_GPIO__H
