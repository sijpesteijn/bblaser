//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#include "laser.h"
#include "../log.h"
#include "segment.h"
#include "defines.h"
#include "settings.h"
#include <unistd.h>
#include <iostream>
#include <valarray>


/**
* spi1.0: CS = P9_42, SCLK = P9_20, D0 = P9_29, D1 = P9_30
*/
laser::laser(settings *sett) {
    this->sett = sett;
    char P9_11[] = "P9_11";
    this->_axis_cs = new gpio(30, P9_11); // P9_11
    this->_axis_cs->setValue(1);

    char P9_12[] = "P9_12";
    this->_axis_ldac = new gpio(60, P9_12); // P9_12
    this->_axis_ldac->setValue(1);

    char P9_15[] = "P9_15";
    this->_red_cs = new gpio(48, P9_15); // P9_15
    this->_red_cs->setValue(1);

    char P9_24[] = "P9_24";
    this->_green_cs = new gpio(15, P9_24); // P9_24
    this->_green_cs->setValue(1);

    char P9_27[] = "P9_27";
    this->_blue_cs = new gpio(115, P9_27); // P9_27
    this->_blue_cs->setValue(1);

    this->_spi_bus = new spi(0);
    this->setColor(new color(0, 0, 0));
    _enable3D = false;
    _border = 95;
    _scale = 1.0;
    _offset = new point(0, 0);
    _previousPoint = new point(0, 0);
    _moved = 0;
    _maxMove = -1;
    resetClipArea();
    usleep(500);
    log::debug("Laser initialized.");
}

void laser::sendTo(point *p) {
    point *pp = p;
    if (_enable3D) {
        point p1(p->getX(), p->getY(), p->getZ());
        point *p2 = matrix3::applyMatrix(_matrix, p1);
        pp = new point(((_zDist * (long) p2->getX()) / (_zDist + (long) p2->getZ())) + 2048,
                       ((_zDist * (long) p2->getY()) / (_zDist + (long) p2->getZ())) + 2048);
    }
    point *newPoint = new point(TO_INT((u_int64_t)(pp->getX() * _scale)) + _offset->getX(),
                                TO_INT((u_int64_t)(pp->getY() * _scale)) + _offset->getY());
    point *clipPoint = new point(newPoint->getX(), newPoint->getY());
    point *previousPoint = new point(_previousPoint->getX(), _previousPoint->getY(), _previousPoint->getZ());
    if (clipLine(previousPoint, clipPoint)) {
        if (previousPoint->getX() != _previousPoint->getX() || previousPoint->getY() != _previousPoint->getY()) {
            sendToRaw(previousPoint);
        }
        sendToRaw(newPoint);
    }
    _previousPoint = newPoint;
}

void laser::sendToRaw(point *p) {
    // devide into equal parts, using _quality
    long fdiffx = p->getX() - _p->getX();
    long fdiffy = p->getY() - _p->getY();
    long diffx = TO_INT(abs(fdiffx) * _quality);
    long diffy = TO_INT(abs(fdiffy) * _quality);

    // store movement for max move
    long moved = _moved;
    _moved += abs(fdiffx) + abs(fdiffy);

    // use the bigger direction
    if (diffx < diffy) {
        diffx = diffy;
    }
    fdiffx = FROM_INT(fdiffx) / diffx;
    fdiffy = FROM_INT(fdiffy) / diffx;
    // interpolate in FIXPT
    long tmpx = 0;
    long tmpy = 0;
    for (int i = 0; i < diffx - 1; i++) {
        // for max move, stop inside of line if required...
        if (_maxMove != -1) {
            long moved2 = moved + abs(TO_INT(tmpx)) + abs(TO_INT(tmpy));
            if (!_laserForceOff && moved2 > _maxMove) {
                blank();
                _laserForceOff = true;
                _maxMovePoint = new point(_p->getX() + TO_INT(tmpx), _p->getY() + TO_INT(tmpy));
            }
        }
        tmpx += fdiffx;
        tmpy += fdiffy;
        setPoint(new point(_p->getX() + TO_INT(tmpx), _p->getY() + TO_INT(tmpy)));
#ifdef LASER_MOVE_DELAY
        wait(LASER_MOVE_DELAY);
#endif
    }

    // for max move, stop if required...
    if (!_laserForceOff && _maxMove != -1 && _moved > _maxMove) {
        blank();
        _laserForceOff = true;
        _maxMovePoint = p;
    }

    _p = p;
    setPoint(_p);
    wait(LASER_END_DELAY);
}

void laser::setPoint(point *p) {
    if (this->_enabled) {
//        cout << "x: " << p->getX() << endl;
//        cout << "y: " << p->getY() << endl;
//        long d = 0, e = 1000;
//        double x_angle = atan((p->getX() - 2048)/(sqrt(pow(d,2)+pow((p->getY() - 2048),2)) + e));
//        x_angle = (4096/(M_PI/2))*x_angle + 2048;
//        float y_angle = atan((p->getY() - 2048)/(sqrt(pow(d,2)-pow((p->getX() - 2048),2)/5)));
//        y_angle = (2048/(M_PI/2))*y_angle + 2048;
//        cout << "xc: " << x_angle << endl;
//        cout << "yc" << y_angle << endl;
//        cout << "P " << p->getX() << ", " << p->getY() << endl;
        u_int16_t x;
        if (p->getX() < 2047) {
            x = p->getX() + pow(p->getY() -2046, 2) * this->sett->getCorrLX();
        } else {
            x = p->getX() - pow(p->getY() -2047, 2) * this->sett->getCorrRX();
        }
////        cout << "x: " << x << endl;
        this->_axis_cs->setValue(0);
        this->_spi_bus->write12Bits(0xf0, x);
//        this->_spi_bus->write12Bits(0xf0, p->getX());
//        usleep(5);
        this->_axis_cs->setValue(1);
        this->_axis_cs->setValue(0);
        this->_spi_bus->write12Bits(0x70, p->getY());
//        usleep(5);
        this->_axis_cs->setValue(1);
        this->_axis_ldac->setValue(0);
//        usleep(5);
        this->_axis_ldac->setValue(1);
//        usleep(2);
    }
}

void laser::setColor(color *col) {
    if (this->_enabled) {
        this->_red_cs->setValue(0);
        this->_spi_bus->write8Bits(0x70, col->getRed());
//        usleep(5);
        this->_red_cs->setValue(1);
        this->_green_cs->setValue(0);
        this->_spi_bus->write8Bits(0x70, col->getGreen());
//        usleep(5);
        this->_green_cs->setValue(1);
        this->_blue_cs->setValue(0);
        this->_spi_bus->write8Bits(0x70, col->getBlue());
//        usleep(5);
        this->_blue_cs->setValue(1);
    }
}


void laser::resetClipArea() {
    _clipMin = new point(_border, _border);
    _clipMax = new point(4095 - _border, 4095 - _border);
}

void laser::setClipArea(point *pMin, point *pMax) {
    _clipMin = pMin;
    _clipMax = pMax;
}

const int INSIDE = 0; // 0000
const int LEFT = 1;   // 0001
const int RIGHT = 2;  // 0010
const int BOTTOM = 4; // 0100
const int TOP = 8;    // 1000

int laser::computeOutCode(point *p) {
    int code = INSIDE;          // initialised as being inside of [[clip window]]

    if (p->getX() < _clipMin->getX())           // to the left of clip window
        code |= LEFT;
    else if (p->getX() > _clipMax->getX())      // to the right of clip window
        code |= RIGHT;
    if (p->getY() < _clipMin->getY())           // below the clip window
        code |= BOTTOM;
    else if (p->getY() > _clipMax->getY())      // above the clip window
        code |= TOP;

    return code;
}

// Cohen–Sutherland clipping algorithm clips a line from
// P0 = (x0, y0) to P1 = (x1, y1) against a rectangle with
// diagonal from (_clipXMin, _clipYMin) to (_clipXMax, _clipYMax).
bool laser::clipLine(point *p1, point *p2) {
    // compute outcodes for P0, P1, and whatever point lies outside the clip rectangle
    int outcode0 = computeOutCode(p1);
    int outcode1 = computeOutCode(p2);
    bool accept = false;

    while (true) {
        if (!(outcode0 | outcode1)) { // Bitwise OR is 0. Trivially accept and get out of loop
            accept = true;
            break;
        } else if (outcode0 & outcode1) { // Bitwise AND is not 0. Trivially reject and get out of loop
            break;
        } else {
            // failed both tests, so calculate the line segment to clip
            // from an outside point to an intersection with clip edge
            long x, y;

            // At least one endpoint is outside the clip rectangle; pick it.
            int outcodeOut = outcode0 ? outcode0 : outcode1;

            // Now find the intersection point;
            // use formulas y = y0 + slope * (x - x0), x = x0 + (1 / slope) * (y - y0)
            if (outcodeOut & TOP) {           // point is above the clip rectangle
                x = p1->getX() +
                    (p2->getX() - p1->getX()) * float(_clipMax->getY() - p1->getY()) / float(p2->getY() - p1->getY());
                y = _clipMax->getY();
            } else if (outcodeOut & BOTTOM) { // point is below the clip rectangle
                x = p1->getX() +
                    (p2->getX() - p1->getX()) * float(_clipMin->getY() - p1->getY()) / float(p2->getY() - p1->getY());
                y = _clipMin->getY();
            } else if (outcodeOut & RIGHT) {  // point is to the right of clip rectangle
                y = p1->getY() +
                    (p2->getY() - p1->getY()) * float(_clipMax->getX() - p1->getX()) / float(p2->getX() - p1->getX());
                x = _clipMax->getX();
            } else if (outcodeOut & LEFT) {   // point is to the left of clip rectangle
                y = p1->getY() +
                    (p2->getY() - p1->getY()) * float(_clipMin->getX() - p1->getX()) / float(p2->getX() - p1->getX());
                x = _clipMin->getX();
            }

            // Now we move outside point to intersection point to clip
            // and get ready for next pass.
            if (outcodeOut == outcode0) {
                p1 = new point(x, y);
                outcode0 = computeOutCode(p1);
            } else {
                p2 = new point(x, y);
                outcode1 = computeOutCode(p2);
            }
        }
    }
    return accept;
}

void laser::close() {
    setColor(new color(0, 0, 0));
    this->_enabled = false;
    this->_spi_bus->spi_close();
    log::debug("Laser halted.");
}

bool laser::isOn() const {
    return _enabled;
}

void laser::on() {
    if (!this->_enabled) {
        this->_enabled = true;
    }
}

void laser::blank() {
    this->setColor(new color(0, 0, 0));
    this->_axis_cs->setValue(0);
    this->_axis_ldac->setValue(0);
    this->_red_cs->setValue(0);
    this->_green_cs->setValue(0);
    this->_blue_cs->setValue(0);
}

void laser::drawline(color *c, point *p1, point *p2) {
    if (this->_p->getX() != p1->getX() || this->_p->getY() != p1->getY()) {
        blank();
        sendTo(p1);
    }
    setColor(c);
    sendTo(p2);
    wait(LASER_LINE_END_DELAY);
}

void laser::setOffset(point *pOffset) {
    _offset = pOffset;
}

void laser::setScale(float scale) {
    _scale = FROM_FLOAT(scale);
}

void laser::wait(long length) {
    usleep(length);
}