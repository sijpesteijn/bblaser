//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#ifndef BB_LASER_LIFELINE_RESOURCE_H
#define BB_LASER_LIFELINE_RESOURCE_H


#include "rest_resource.h"
#include "../domain/laser.h"

class lifeline_resource : public rest_resource {
public:
    explicit lifeline_resource(laser *l_p);

    list <shared_ptr<Resource>> getResources() override;

    void close() override;

private:
    shared_ptr <Resource> resource;
};


#endif //BB_LASER_LIFELINE_RESOURCE_H
