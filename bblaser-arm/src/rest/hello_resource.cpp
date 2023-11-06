//
// Created by Gijs Sijpesteijn on 13/01/2021.
//

#define HELLO "/hello"

#include "hello_resource.h"
#include "../log.h"

void get_hello_method_handler(const shared_ptr <Session> &session) {
    const auto &request = session->get_request();

    const string body = "Hello world!";
    session->close(OK, body, {{"Content-Length", ::to_string(body.size())}});
}

hello_resource::hello_resource() {
    this->resource = make_shared<Resource>();
    this->resource->set_path(HELLO);
    this->resource->set_method_handler("GET", get_hello_method_handler);
    char str[80];
    sprintf(str, "Restbed endpoint: %s", HELLO);
    log::debug(str);
}

list <shared_ptr<Resource>> hello_resource::getResources() {
    return {this->resource};
}

void hello_resource::close() {
}