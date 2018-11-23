//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#ifndef BB_LASER_LASER_H
#define BB_LASER_LASER_H

#include "../io/spi.h"
#include "../io/gpio.h"
#include "line.h"

#define MCP23S08_ALL_DOWN		0x00
#define MCP4902_1_CS	 		0x01		//GPIO_0 0000 0001
#define MCP4902_2_CS 			0x02		//GPIO_1 0000 0010
#define MCP4922_CS 				0x04		//GPIO_2 0000 0100
#define MCP23S08_LDAC			0x08		//GPIO_3 0000 1000
#define MCP23S08_SCK			0x10		//GPIO_4 0001 0000
#define MCP23S08_SDI			0x20		//GPIO_5 0010 0000
#define MCP23S08_SHUTTER		0x40		//GPIO_6 0100 0000
#define MCP23S08_SHUTTER_RETURN	0x80		//GPIO_7 1000 0000
#define AXIS_MIN				0
#define AXIS_MAX				4095

class laser {
public:
    laser();
    void setEnabled(bool enabled);
    bool isEnabled();
    void setRed(int red);
    void setGreen(int green);
    void setBlue(int blue);
    void setPoint(point *p);
    void close();
private:
    bool enabled;
    point *p;
    int pixels_per_bit;
    spi *spi_bus;
    gpio *axis_gpio;
    gpio *axis_ldac_gpio;
    gpio *colors1_gpio;
    gpio *colors2_gpio;
};

#endif //BB_LASER_LASER_H
