//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#ifndef BB_LASER_REST_RESOURCE_H
#define BB_LASER_REST_RESOURCE_H

#include <restbed>
#include <string>
#include <list>
#include <memory>
#include <system_error>
#include <map>
#include <iostream>
#include <chrono>
#include <string>
#include <cstring>
#include <utility>
#include <cstdlib>

using namespace std;
using namespace restbed;

class rest_resource {

public:
    virtual ~rest_resource() {}
    void sendError(const shared_ptr<Session> session, string msg) {
        const string body = "{\"error\": \"" + msg + "\"}";
        session->close(500, body, {
                { "Content-Type", "application/json" },
                { "Content-Length", ::to_string(body.size()) }
        });
    }
    virtual list<shared_ptr<Resource>> getResources() = 0;

    virtual void close() = 0;
};


#endif //BB_LASER_REST_RESOURCE_H
