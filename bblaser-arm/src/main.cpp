#include <syslog.h>
#include "log.h"
#include "rest/rest.h"
#include "domain/laser.h"
#include "rest/lifeline_resource.h"
#include "rest/player_resource.h"

laser *laser1;
void closeResources(void) {
    laser1->close();
    log::info("Closed BBLaser...");
}

int main() {
#ifndef __APPLE__
    openlog("bb-laser", ( LOG_CONS | LOG_PID), LOG_USER);
    setlogmask(LOG_UPTO(LOG_DEBUG));
#endif

    log::info("Starting BBLaser...");
    atexit(closeResources);
    laser1 = new laser();

    laser1->setEnabled(true);
    lifeline_resource ll_resource(laser1);
    player_resource p_resource(laser1);
//    rest r({&ll_resource, &p_resource});

    log::info("Stopping BBLaser...");
#ifndef __APPLE__
    closelog();
#endif
    pthread_exit(NULL);
}