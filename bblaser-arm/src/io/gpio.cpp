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
    log::debug(string("gpio_open: export gpio: ") + string(to_string(this->nr)));
    this->export_file_descriptor.open(SYSFS_GPIO_DIR "export");
    if (!this->export_file_descriptor.is_open()) {
        perror("gpio/export");
    }
    this->export_file_descriptor << this->nr;
    this->export_file_descriptor.close();

    string direction = SYSFS_GPIO_DIR;
    direction += "gpio" + to_string(this->nr) + "/direction";
    this->direction_file_descriptor.open(direction);
    if (!this->direction_file_descriptor.is_open()) {
        perror("gpio/direction");
    }
    this->direction_file_descriptor << (this->direction == OUTPUT_PIN ? "out" : "in");
    this->direction_file_descriptor.close();

    string value = SYSFS_GPIO_DIR;
    value += "gpio" + to_string(this->nr) + "/value";
    this->value_file_descriptor.open(value);
    if (!this->value_file_descriptor.is_open()) {
        perror("gpio/value");
    }
}

void gpio::setValue(int val) {
    this->value_file_descriptor << val;
    this->value_file_descriptor.flush();
}

int gpio::getValue() {
    this->value_file_descriptor.seekg (0, ios::beg);
    string line;
    getline(this->value_file_descriptor, line);
    return stoi(line);
}