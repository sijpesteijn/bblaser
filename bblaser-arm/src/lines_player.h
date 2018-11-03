//
// Created by Gijs Sijpesteijn on 02/11/2018.
//

#ifndef BB_LASER_LINES_PLAYER_H
#define BB_LASER_LINES_PLAYER_H

#include <future>
#include <list>
#include "laser.h"
#include "line.h"

using namespace std;

class lines_player {
public:
    lines_player(laser *lp, list<line> lines);
    void stop();

private:
    promise<void> exitSignal;
    future<void> futureObj;
    thread runner;
    laser *lp;
};


#endif //BB_LASER_LINES_PLAYER_H
