//
// Created by Gijs Sijpesteijn on 13/01/2021.
//

#ifndef BB_LASER_ARM_HELLO_RESOURCE_H
#define BB_LASER_ARM_HELLO_RESOURCE_H


#include "rest_resource.h"

class hello_resource : public rest_resource {
public:
    hello_resource();

    list <shared_ptr<Resource>> getResources() override;

    void close() override;

private:
    shared_ptr <Resource> resource;
};


#endif //BB_LASER_ARM_HELLO_RESOURCE_H
