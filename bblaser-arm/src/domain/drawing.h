//
// Created by Gijs Sijpesteijn on 24/05/2021.
//

#ifndef BB_LASER_ARM_DRAWING_H
#define BB_LASER_ARM_DRAWING_H


#include "point.h"
#include "segment.h"

class drawing {
public:
    //! Draws the given string at x,y position. Count indicates how often the drawing is repeated.
    static void drawString(const char *text, int x, int y, int repeat = 1);

    //! Draws the given letter (A-Z, 0-9, !? are currently supported in the font), returns the x advance...
    static long drawLetter(const char letter, long translateX = 0, long translateY = 0);

    //! Get X advance for given char
    static long advance(const char letter);

    //! Get X advance for string
    static long stringAdvance(const char *text);

    //! Draws the given data (which needs to be in PROGMEM). Size indicates the number
    //! of draw commands (so it is sizeof(data)/4).
    static void drawObject(const unsigned short *data, int size, long translateX = 0, long translateY = 0);

    //! Draws the given data (which needs to be in PROGMEM). Size indicates the number
    //! of draw commands (so it is sizeof(data)/4).
    static void drawObjectRotated(const unsigned short *data, int size, long centerX, long centerY, int angle);

    //! Draws the object and rotates in 3D.
    static void
    drawObjectRotated3D(const unsigned short *data, int size, long centerX, long centerY, int angleX, int angleY,
                        int fov);

    //! Returns the center of the object (center of bounding box)
    static void
    calcObjectBox(segment *segments, int total_segments, long &centerX, long &centerY, long &width, long &height);

};


#endif //BB_LASER_ARM_DRAWING_H
