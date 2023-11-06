//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#ifndef BB_LASER_LASER_H
#define BB_LASER_LASER_H

#include "../io/spi.h"
#include "../io/gpio.h"
#include "segment.h"
#include "matrix3.h"

#define MCP23S08_ALL_DOWN        0x00
#define MCP4902_1_CS            0x01        //GPIO_0 0000 0001
#define MCP4902_2_CS            0x02        //GPIO_1 0000 0010
#define MCP4922_CS                0x04        //GPIO_2 0000 0100
#define MCP23S08_LDAC            0x08        //GPIO_3 0000 1000
#define MCP23S08_SCK            0x10        //GPIO_4 0001 0000
#define MCP23S08_SDI            0x20        //GPIO_5 0010 0000
#define MCP23S08_SHUTTER        0x40        //GPIO_6 0100 0000
#define MCP23S08_SHUTTER_RETURN    0x80        //GPIO_7 1000 0000
#define AXIS_MIN                0
#define AXIS_MAX                4095

// -- The following flags can be used to fine tune the laser timing

// defines the granularity of the line interpolation. 64 means that each line is split into steps of 64 pixels in the longer direction.
// setting smaller values will slow down the rendering but will cause more linearity in the galvo movement,
// setting bigger values will cause faster rendering, but lines will not be straight anymore.
#define LASER_QUALITY 64

// Defines how long the galvos wait for the on/off toggling of the laser pointer (in microseconds), this will depend on your laser pointer.
#define LASER_TOGGLE_DELAY 500
// Defines how long the galvos wait at the end of a line (currently only used for the 3D cube rendering, in microseconds).
#define LASER_LINE_END_DELAY 200
// Defines the delay the laser waits after reaching a given position (in microseconds).
#define LASER_END_DELAY 5
// Defines the delay after each laser movement (used when interpolating lines, in microseconds), if not defines, 0 is used
//#define LASER_MOVE_DELAY 5

class laser {
public:
    laser();

    bool isOn() const;

    void setColor(color *col);

    void setPoint(point *p);

    void sendTo(point *p);

    void sendToRaw(point *p);

    void close();

    void on();

    void blank();

    void setScale(float scale);

    void setOffset(point *offset);

    void setEnable3D(bool flag) { _enable3D = flag; }

    void setMatrix(const matrix3 &matrix) { _matrix = matrix; }

    void setZDist(u_int64_t zDist) { _zDist = zDist; }

    void resetClipArea();

    void setClipArea(point *p1, point *p2);

    void resetMaxMove() {
        _maxMove = -1;
        _laserForceOff = false;
    }

    void setMaxMove(long length) {
        _moved = 0;
        _maxMove = length;
        _laserForceOff = false;
    }

    bool maxMoveReached() { return _laserForceOff; }

    point *getMaxMoveFinalPosition() { return _maxMovePoint; }

    int computeOutCode(point *p1);

    void wait(long length);

    void drawline(color *c, point *p1, point *p2);

    bool clipLine(point *p1, point *p2);

private:
    bool _enabled = false;
    u_int16_t _border;
    spi *_spi_bus;
    gpio *_axis_cs;
    gpio *_axis_ldac;
    gpio *_red_cs;
    gpio *_green_cs;
    gpio *_blue_cs;
    gpio *_color_ldac;
    point *_p;
    point *_previousPoint;
    uint64_t _scale;
    bool _enable3D;
    point *_offset;
    point *_clipMin;
    point *_clipMax;
    matrix3 _matrix;
    u_int16_t _zDist;
    uint64_t _quality;
    u_int16_t _moved;
    u_int16_t _maxMove;
    bool _laserForceOff;
    point *_maxMovePoint;
};

#endif //BB_LASER_LASER_H
