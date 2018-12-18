//
// Created by Gijs Sijpesteijn on 02/11/2018.
//

#include "lines_player.h"
#include "log.h"
#include <thread>
#include <unistd.h>
#include <mutex>
#include <string>
using namespace std;

// Create a lock
mutex mtx;
list<line> lines;

void plotPoints(laser *lp, list<point> points) {
    std::list<point>::iterator it;
    for (it = points.begin(); it != points.end(); it++){
        point p = *it;
        lp->setPoint(&p);
    }
//#ifdef __APPLE__
//    usleep(100000);
//#endif
//    log::debug("Points plotted");

}

void player(laser *lp, future<void> futureObj) {
//    while (futureObj.wait_for(chrono::milliseconds(1)) == future_status::timeout) {
    for(;;) {
        mtx.lock();
        for (list<line>::iterator it = lines.begin(); it != lines.end(); it++) {
            line l = *it;
            lp->setRed(atoi(l.getRed().c_str()));
            lp->setGreen(atoi(l.getGreen().c_str()));
            lp->setBlue(atoi(l.getBlue().c_str()));
            plotPoints(lp, l.getPoints());
            usleep(10);
        }
        mtx.unlock();
    }
    log::debug("Thread stopped.");
}

lines_player::lines_player(laser *lp, list<line> lns) {
    this->lp = lp;
    lines = move(lns);
    this->futureObj = this->exitSignal.get_future();
    this->runner = thread(player, this->lp, move(this->futureObj));
}

void lines_player::playLines(list<line> lns) {
    mtx.lock();
    lines = move(lns);
    mtx.unlock();
}

void lines_player::stop() {
    exitSignal.set_value();
    this->runner.join();
    log::debug("Stopping");
}
