//
// Created by Gijs Sijpesteijn on 13/01/2021.
//

#ifndef BB_LASER_ARM_SETTINGS_RESOURCE_H
#define BB_LASER_ARM_SETTINGS_RESOURCE_H


#include "rest_resource.h"
#include "../domain/settings.h"

class settings_resource : public rest_resource {
public:
    settings_resource(settings *sett);

    list <shared_ptr<Resource>> getResources() override;

    void close() override;

private:
    shared_ptr <Resource> resource;
    settings *sett;
};


#endif //BB_LASER_ARM_SETTINGS_RESOURCE_H
