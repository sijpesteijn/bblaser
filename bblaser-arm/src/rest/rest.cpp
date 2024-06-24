//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#include "rest.h"
#include "../log.h"

rest::rest(const list<rest_resource *> &resources) {
    this->resources = resources;
    auto settings = make_shared<Settings>();
    settings->set_port(1984);
    settings->set_default_headers({{"Connection","spi_close"}, {"Access-Control-Allow-Origin", "*"}});

    for (rest_resource *r_resource: resources) {
        for (const shared_ptr <Resource> &resource: r_resource->getResources()) {
            this->service.publish(resource);
        }
    }
    log::debug("Restbed initialized.");
    this->service.start(settings);
}

void rest::close() {
    for (rest_resource *r_resource: resources) {
        r_resource->close();
    }
}
