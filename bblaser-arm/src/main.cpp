#include <syslog.h>
#include "log.h"
#include "rest/rest.h"
#include "domain/laser.h"
#include "rest/lifeline_resource.h"
#include "rest/player_resource.h"
#include "rest/hello_resource.h"
#include "domain/drawing.h"
#include "rest/settings_resource.h"
#include "domain/settings.h"


laser *laser1;
rest *rest1;
settings *sett;

void closeResources() {
    rest1->close();
    laser1->close();
    log::info("Closed BBLaser...");
}

int main() {
#ifndef __APPLE__
    openlog("bb-laser", (LOG_CONS | LOG_PID), LOG_USER);
    setlogmask(LOG_UPTO(LOG_DEBUG));
#endif

    log::info("Starting BBLaser...");
    atexit(closeResources);
    sett = new settings();
    laser1 = new laser(sett);

    lifeline_resource ll_resource(laser1);
    player_resource p_resource(laser1);
    hello_resource h_resource;
    settings_resource s_resource(sett);
    rest1 = new rest({&ll_resource, &p_resource, &h_resource, &s_resource});

//    const char *str = "Moemoe";
//    int w1 = drawing::stringAdvance(str);
//    drawing::drawString(str, -w1 / 2, -500, 1);
    log::info("Stopping BBLaser...");
#ifndef __APPLE__
    closelog();
#endif
//    pthread_exit(nullptr);
    return EXIT_SUCCESS;
}