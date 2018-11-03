//
// Created by Gijs Sijpesteijn on 25/10/2018.
//

#include "player_resource.h"
#include "lines_player.h"
#include "log.h"
#include "line.h"

#include <thread>
#include <jansson.h>
#include <list>
#include <unistd.h>

#define PLAYER "/play"

using namespace std;
static laser *l;
static lines_player *lp;

json_t *parseRoot(const char *buffer, size_t buflen) {
    json_t *root;
    json_error_t error;
    root = json_loadb(buffer, buflen, 0, &error);
    if (!root) {
        fprintf(stderr, "error: on line %d: %s\n", error.line, error.text);
        log::debug(string("deserialize parseRoot: error on line ") + to_string(error.line) + string(error.text));
        return NULL;
    }
    if (!json_is_object(root)) {
        fprintf(stderr, "error: commit data is not an object\n");
        log::debug("deserialize parseRoot: error commit data is not an object\n");
        json_decref(root);
        return NULL;
    }
    return root;
}

void post_play_method_handler(const shared_ptr<Session> session) {
    if (l->isEnabled() == false) {
        string error_body = "No lifeline. Laser stopped.";
        session->close(405, error_body, {{"Content-Length", ::to_string(error_body.size())}});
    } else {
        const auto request = session->get_request();
        int content_length = request->get_header("Content-Length", 0);

        session->fetch(content_length, [](const shared_ptr<Session> session, const Bytes &body) {
            list<line> lines;
            json_t *root = parseRoot((char *) body.data(), (int) body.size());
            json_t *shapesJson = json_object_get(root, "shapes");
            int total_shapes = json_array_size(shapesJson);
            for (int i = 0; i < total_shapes; i++) {
                json_t *shapeJson = json_array_get(shapesJson, i);
                if (json_is_string(shapeJson)) {
                    char *val = strdup(json_string_value(shapeJson));
                    json_decref(shapeJson);
                    line line1(val);
                    lines.push_back(line1);
                }
            }
//            log::debug("Begin new lines");
            lp->stop();
            free(lp);
            lp = new lines_player(l, lines);

//            log::debug("New lines");
            session->close(OK);
        });
    }
}

player_resource::player_resource(laser *laser1) {
    l = laser1;
    lp = new lines_player(l, {});
    this->resource = make_shared<Resource>();
    this->resource->set_path(PLAYER);
    this->resource->set_method_handler("POST", post_play_method_handler);
    char str[80];
    sprintf(str, "Restbed websocket: %s", PLAYER);
    log::debug(str);
}

list<shared_ptr<Resource>> player_resource::getResources() {
    return {this->resource};
}