//
// Created by Gijs Sijpesteijn on 02/11/2018.
//

#include "lines_player.h"
#include "log.h"
#include <thread>

// Create a lock and thread condition
pthread_mutex_t player_lock = PTHREAD_MUTEX_INITIALIZER;

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
    if (this->is_running) {
        this->stop();
    }
    if (pthread_mutex_lock(&player_lock) != 0) {
        log::error("Lines player: Can't get the lock on the player state.");
    }
    this->futureObj = this->exitSignal.get_future();
    this->is_running = true;
    this->runner = thread(player, this->lp, lines, move(this->futureObj));
    if (pthread_mutex_unlock(&player_lock) != 0) {
        log::error("Lines player: Can't unlock on the player state.");
    }
}

void lines_player::stop() {
    if (pthread_mutex_lock(&player_lock) != 0) {
        log::error("Lines player: Can't get the lock on the player state.");
    }
    exitSignal.set_value();
    this->runner.join();
    this->is_running = false;
    this->lp->setRed(0);
    this->lp->setGreen(0);
    this->lp->setBlue(0);
//    point p(0,0);
//    this->lp->setPoint(&p);
    log::debug("Stopping");
    if (pthread_mutex_unlock(&player_lock) != 0) {
        log::error("Lines player: Can't unlock on the player state.");
    }
}
