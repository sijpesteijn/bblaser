//
// Created by Gijs Sijpesteijn on 25/10/2018.
//

#ifndef BB_LASER_PLAYER_RESOURCE_H
#define BB_LASER_PLAYER_RESOURCE_H

#include "../domain/laser.h"
#include "rest_resource.h"

class player_resource : public rest_resource {
public:
    explicit player_resource(laser *laser1);

    list <shared_ptr<Resource>> getResources() override;

    void close() override;

private:
    shared_ptr <Resource> resource;
};


#endif //BB_LASER_PLAYER_RESOURCE_H
