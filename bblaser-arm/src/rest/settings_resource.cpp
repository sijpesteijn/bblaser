//
// Created by Gijs Sijpesteijn on 13/01/2021.
//

#define SETTINGS "/settings"

#include "settings_resource.h"
#include "../log.h"
#include <jansson.h>

static settings *s;

void post_settings_method_handler(const shared_ptr <Session> &session) {
    const auto request = session->get_request();
    int content_length = request->get_header("Content-Length", 0);

    session->fetch(content_length, [](const shared_ptr <Session> &session, const Bytes &body) {
        char *data = (char *) &body[0];
        uint16_t body_length = body.size();
        cout << "Body: " << data << endl;
        cout << "Body len: " << body_length << endl;
        json_t *root;
        json_error_t error;
        root = json_loads(data, 0, &error);
        string corr_l_x = json_string_value(json_object_get(root, "corr_l_x"));
        string corr_r_x = json_string_value(json_object_get(root, "corr_r_x"));
        s->setCorrLX(stod(corr_l_x));
        s->setCorrRX(stod(corr_r_x));
        json_decref(root);
//        lines = strtok(data, "\n");
//        while (lines != NULL) {
//            cout << lines << endl; // print the string token
//            lines = strtok(NULL, " , ");
//        }

    });
    session->close(OK);
//        const auto &request = session->get_request();
//
//    const string body = "Hello world!";
//    session->close(OK, body, {{"Content-Length", ::to_string(body.size())}});
}

settings_resource::settings_resource(settings * sett) {
    s = sett;
    this->resource = make_shared<Resource>();
    this->resource->set_path(SETTINGS);
    this->resource->set_method_handler("POST", post_settings_method_handler);
    char str[80];
    sprintf(str, "Restbed endpoint: %s", SETTINGS);
    log::debug(str);
}

list <shared_ptr<Resource>> settings_resource::getResources() {
    return {this->resource};
}

void settings_resource::close() {
}