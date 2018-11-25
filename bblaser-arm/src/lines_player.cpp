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
//    log::debug("Points plotted");

}

void player(laser *lp, list<line> lines, future<void> futureObj) {
    while (futureObj.wait_for(chrono::milliseconds(1)) == future_status::timeout) {
        for (list<line>::iterator it = lines.begin(); it != lines.end(); it++) {
            line l = *it;
//            lp->setRed(l.getRed());
//            lp->setGreen(l.getGreen());
//            lp->setBlue(l.getBlue());
            lp->setRed(255);
//            lp->setGreen(255);
//            lp->setBlue(255);
//            plotPoints(lp, l.getPoints());
        }
    }

//    log::debug("Stopping thread.");
}


lines_player::lines_player(laser *lp, list<line> lines) {
    this->lp = lp;
    this->futureObj = this->exitSignal.get_future();
    this->runner = thread(player, this->lp, lines, move(this->futureObj));
}

void lines_player::stop() {
    exitSignal.set_value();
    this->runner.join();
}
