//
// Created by Gijs Sijpesteijn on 02/11/2018.
//

#include "lines_player.h"
#include "log.h"
#include <thread>



void plotPoints(laser *lp, list<point> points) {
    std::list<point>::iterator it;
    for (it = points.begin(); it != points.end(); it++){
        point p = *it;
        lp->setPoint(&p);
    }
    log::debug("Points plotted");

}

void player(laser *lp, list<line> lines, future<void> futureObj) {
    while (futureObj.wait_for(chrono::milliseconds(1)) == future_status::timeout) {
        for (list<line>::iterator it = lines.begin(); it != lines.end(); it++) {
            line l = *it;
            lp->setRed(atoi(l.getRed().c_str()));
            lp->setGreen(atoi(l.getGreen().c_str()));
            lp->setBlue(atoi(l.getBlue().c_str()));
            plotPoints(lp, l.getPoints());
        }
    }

    log::debug("Stopping thread.");
}


lines_player::lines_player(laser *lp, list<line> lines) {
    this->lp = lp;
    this->futureObj = this->exitSignal.get_future();
    this->runner = thread(player, this->lp, lines, move(this->futureObj));
}

void lines_player::stop() {
    exitSignal.set_value();
    this->runner.join();
//    this->lp->setRed(0);
//    this->lp->setGreen(0);
//    this->lp->setBlue(0);
//    this->lp->setPoint(new point(0,0));
    log::debug("Stopping");
}
