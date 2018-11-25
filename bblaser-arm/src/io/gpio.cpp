//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#include "gpio.h"
#include "io.h"
#include "../log.h"
#include <string>
#include <syslog.h>
#include <dirent.h>
#include <unistd.h>

using namespace std;

gpio::gpio(int nr) {
    this->nr = nr;
    this->direction = OUTPUT_PIN;
    this->open();
}

gpio::gpio(int nr, PIN_DIRECTION direction) {
    this->nr = nr;
    this->direction = direction;
    this->open();
}

gpio::~gpio() {
    this->value_file_descriptor.close();
}

void gpio::open() {
    int result;

    if (opendir(string(string(SYSFS_GPIO_DIR) + "gpio" + to_string(this->nr)).c_str()) == NULL) {
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
    } else {
        log::debug(echo_direction);
    }

//    this->value_file_descriptor.open(string(SYSFS_GPIO_DIR) + "gpio" + to_string(this->nr) + "/value");
    this->setValue(0);
    this->setValue(1);
    this->setValue(0);
    this->setValue(1);
}

void gpio::setValue(int val) {
    string echo_value = string(
            "echo " + to_string(val) + " > " + string(SYSFS_GPIO_DIR) + "gpio" + to_string(this->nr) + "/value");
    int result = system(echo_value.c_str());
    if (result != 0 || errno != 0) {
        log::error("gpio/value failed: " + echo_value);
        perror("gpio/value");
    }
}

int gpio::getValue() {
    this->value_file_descriptor.seekg(0, ios::beg);
    string line;
    getline(this->value_file_descriptor, line);
    return stoi(line);
}