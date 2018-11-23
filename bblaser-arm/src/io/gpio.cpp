//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#include "gpio.h"
#include "io.h"
#include "../log.h"
#include <string>
#include <syslog.h>

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
    log::debug("gpio_open: export gpio: " + to_string(this->nr));

    int result = system(string("echo " + to_string(this->nr) + " >> " + SYSFS_GPIO_DIR + "export").c_str());
    if (result != 0 && errno != 0) {
        log::error("gpio/export failed for gpio: " + to_string(this->nr));
        perror("gpio/export");
    }

    result = system(string("echo " + string(this->direction == OUTPUT_PIN ? "out" : "in") + " >> " + SYSFS_GPIO_DIR + "gpio" + to_string(this->nr) + "/direction").c_str());
    if (result != 0 && errno != 0) {
        log::error("gpio/direction failed for gpio: " + to_string(this->nr));
        perror("gpio/direction");
    }

    this->setValue(0);
    this->value_file_descriptor.open(string(SYSFS_GPIO_DIR) + "gpio" + to_string(this->nr) + "/value");
}

void gpio::setValue(int val) {
    int result = system(string("echo " + to_string(val) + " >> " + string(SYSFS_GPIO_DIR) + "gpio" + to_string(this->nr) + "/value").c_str());
    if (result != 0 && errno != 0) {
        log::error("gpio/value failed for gpio: " + to_string(this->nr));
        perror("gpio/value");
    }
}

int gpio::getValue() {
    this->value_file_descriptor.seekg (0, ios::beg);
    string line;
    getline(this->value_file_descriptor, line);
    return stoi(line);
}