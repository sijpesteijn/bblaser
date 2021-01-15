//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#include "gpio.h"
#include "io.h"
#include "../log.h"
#include <string>
#include <dirent.h>
#include <unistd.h>

using namespace std;

gpio::gpio(int nr) {
    this->nr = nr;
    this->direction = OUTPUT_PIN;
    this->open();
}

gpio::~gpio() {
    this->value_file_descriptor.close();
}

void gpio::open() {
    int result;

    if (opendir(string(string(SYSFS_GPIO_DIR) + "gpio" + to_string(this->nr)).c_str()) == nullptr) {
        string echo_export = string("echo " + to_string(this->nr) + " > " + SYSFS_GPIO_DIR + "export");
        result = system(echo_export.c_str());
        if (result != 0 || errno != 0) {
            log::error("gpio/export failed: " + echo_export);
            perror("gpio/export");
        } else {
            usleep(500);
        }
    } else {
        log::debug("GPIO " + to_string(this->nr) + " already exported.");
    }

    string echo_direction = string(
            "echo " + string(this->direction == OUTPUT_PIN ? "out" : "in") + " > " + SYSFS_GPIO_DIR + "gpio" +
            to_string(this->nr) + "/direction");
    result = system(echo_direction.c_str());
    if (result != 0 || errno != 0) {
        log::error("gpio/direction failed: " + echo_direction);
        perror("gpio/direction");
    }

    this->value_file_descriptor.open(string(SYSFS_GPIO_DIR) + "gpio" + to_string(this->nr) + "/value", std::ofstream::trunc);
    this->setValue(0);
}

void gpio::setValue(int val) {
    this->value_file_descriptor << val;
    this->value_file_descriptor.flush();
}