//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#ifndef BB_LASER_REST_H
#define BB_LASER_REST_H

#include <list>
#include <restbed>
#include "rest_resource.h"

using namespace std;
using namespace restbed;

class rest {
public:
    explicit rest(const list<rest_resource *> &resources);

    void close();

private:
    Service service;
    list<rest_resource *> resources;
};


#endif //BB_LASER_REST_H
