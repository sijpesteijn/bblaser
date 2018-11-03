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
    rest(list<rest_resource*> resources);

private:
    Service service;
};


#endif //BB_LASER_REST_H
