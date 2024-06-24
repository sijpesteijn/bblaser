//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#include "gpio.h"
#include "io.h"
#include "../log.h"
#include <string>
#include <unistd.h>
#include <iostream>

using namespace std;

gpio::gpio(uint16_t nr, char *header_name) {
    this->nr = nr;
    this->header_name = header_name;
    this->direction = OUTPUT_PIN;
    this->open();
}

gpio::~gpio() {
    this->value_file_descriptor.close();
}

void gpio::open() {
    uint8_t result;
    char filename[21];
    sprintf(filename, "config-pin %s gpio", header_name);
    system(filename);
    string echo_direction = string(
            "echo " + string(this->direction == OUTPUT_PIN ? "out" : "in") + " > " + SYSFS_GPIO_DIR + "gpio" +
            to_string(this->nr) + "/direction");
    result = system(echo_direction.c_str());
    if (result != 0 || errno != 0) {
        log::error("gpio/direction failed: " + echo_direction);
        perror("gpio/direction");
    }

    this->value_file_descriptor.open(string(SYSFS_GPIO_DIR) + "gpio" + to_string(this->nr) + "/value",
                                     std::ofstream::trunc);
    this->setValue(0);
}

void gpio::setValue(uint16_t val) {
    this->value_file_descriptor << val << endl;
//    usleep(250);
}