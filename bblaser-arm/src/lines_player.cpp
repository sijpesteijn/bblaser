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
#include <cmath>

using namespace std;
#define ONE_SEC 1000000
#define TENTH_SEC 0
// Create a lock
mutex mtx;
segment *segments;
int total_segments;

void smoothPoints(laser *lp, point *prev, point *cur) {
    int smoothing = 100;
    int dX = cur->getX() - prev->getX();
    int dY = cur->getY() - prev->getY();
    double distance = sqrt(pow(dX, 2) + pow(dY, 2));
    double nrOfPoints = floor(distance / smoothing);
    for (int i=1;i<=nrOfPoints;i++) {
        int x = prev->getX() + i*(dX/nrOfPoints);
        int y = prev->getY() + i*(dY/nrOfPoints);
        lp->setPoint(new point(x, y));
    }
}

void plotPoints(laser *lp, point *points, int total_points, color *col) {
    point *prev = nullptr;
    for (int i = 0; i < total_points; i++) {
        if (i > 0) {
            smoothPoints(lp, prev, &points[i]);
        }
        lp->setPoint(&points[i]);
        if (i == 0) {
            lp->setColor(col);
        }
        prev = &points[i];
//        usleep(TENTH_SEC);
//        this_thread::sleep_for(chrono::seconds(1));
    }
    lp->setColor(new color(0,0,0));
#ifdef __APPLE__
    //    usleep(10000);
#endif
}

[[noreturn]] void player(laser *lp) {
    for (;;) {
        mtx.lock();
        for (int i = 0; i < total_segments; i++) {
//            lp->setColor(segments[i].getColor());
//            cout << "Total: " << segments[i].getTotalPoints() << endl;
            plotPoints(lp, segments[i].getPoints(), segments[i].getTotalPoints(), segments[i].getColor());
//            this_thread::sleep_for(chrono::seconds(1));
        }
        mtx.unlock();
    }
}

void lines_player::playLines(segment *segs, int total_segs) {
    mtx.lock();
//    cout << "Total segments " << total_segs << endl;
    free(segments);
    segments = segs;
    total_segments = total_segs;
    mtx.unlock();
}

void lines_player::disable() {
    this->lp->blank();
}

void lines_player::stop() {
    exitSignal.set_value();
    this->runner.join();
    log::debug("Stopping");
}

lines_player::lines_player(laser *lp) {
    this->lp = lp;
//    this->futureObj = this->exitSignal.get_future();
    this->runner = thread(player, this->lp);
}