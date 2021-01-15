//
// Created by Gijs Sijpesteijn on 02/11/2018.
//

#include "lines_player.h"
#include "log.h"
#include <thread>
#include <unistd.h>
#include <mutex>
#include <string>
#include <iostream>
using namespace std;

// Create a lock
mutex mtx;
segment* segments;
int total_segments;

void plotPoints(laser *lp, point* points, int total_points) {
    for (int i=0; i < total_points; i++){
        lp->setPoint(&points[i]);
    }
#ifdef __APPLE__
    usleep(10000);
#endif
}

[[noreturn]] void player(laser *lp, future<void> futureObj) {
    for(;;) {
        mtx.lock();
        for (int i=0;i<total_segments;i++) {
            lp->setColor(segments[i].getColor());
            plotPoints(lp, segments->getPoints(), segments->getTotalPoints());
            usleep(10);
        }
        mtx.unlock();
    }
}

void lines_player::playLines(segment *segs, int total_segs) {
    mtx.lock();
    cout << "Total segments " << total_segs << endl;
    segments = segs;
    total_segments = total_segs;
    mtx.unlock();
}

void lines_player::disable() {
    this->lp->disable();
}

void lines_player::stop() {
    exitSignal.set_value();
    this->runner.join();
    log::debug("Stopping");
}

lines_player::lines_player(laser *lp) {
    this->lp = lp;
    this->futureObj = this->exitSignal.get_future();
    this->runner = thread(player, this->lp, move(this->futureObj));
}