//
// Created by Gijs Sijpesteijn on 25/10/2018.
//

#include "player_resource.h"
#include "../lines_player.h"
#include "../log.h"
#include <jansson.h>
#include <list>
#include <unistd.h>

#define PLAYER "/play"

using namespace std;
static laser *l;
static lines_player *lp;
segment player_resource::emptyLine = segment(new color(0, 0, 0), 0, nullptr);

color *getColor(json_t *pJson);

point* getPoints(const json_t *pointsJson, int &total_points, point *&points);

json_t *parseRoot(const char *buffer, size_t buflen) {
    json_t *root;
    json_error_t error;
    root = json_loadb(buffer, buflen, 0, &error);
    if (!root) {
        fprintf(stderr, "error: on segment %d: %s\n", error.line, error.text);
        log::debug(string("deserialize parseRoot: error on segment ") + to_string(error.line) + string(error.text));
        return nullptr;
    }
    if (!json_is_object(root)) {
        fprintf(stderr, "error: commit data is not an object\n");
        log::debug("deserialize parseRoot: error commit data is not an object\n");
        json_decref(root);
        return nullptr;
    }
    return root;
}

void post_play_method_handler(const shared_ptr<Session>& session) {
    if (!l->isEnabled()) {
        string error_body = "No lifeline. Laser stopped.";
        session->close(405, error_body, {{"Content-Length", ::to_string(error_body.size())}});
    } else {
        const auto request = session->get_request();
        int content_length = request->get_header("Content-Length", 0);

        session->fetch(content_length, [](const shared_ptr<Session>& session, const Bytes &body) {
            json_t *root = parseRoot((char *) body.data(), (int) body.size());
            json_t *segmentsJson = json_object_get(root, "segments");
            int total_segments = json_array_size(segmentsJson);
            auto *segments = (segment*)malloc(sizeof(segment) * total_segments);
            for (int i = 0; i < total_segments; i++) {
                json_t *segmentJson = json_array_get(segmentsJson, i);
                json_t *colorJson = json_object_get(segmentJson, "color");
                color *col = getColor(colorJson);
                json_t *pointsJson = json_object_get(segmentJson, "points");
                int total_points;
                point *points = getPoints(pointsJson, total_points, points);
                segments[i] = segment(col, total_points, points);
//                json_decref(segmentJson);
//                json_decref(colorJson);
//                json_decref(pointsJson);
            }
            if (total_segments == 0) {
                lp->disable();
            } else {
                lp->playLines(segments, total_segments);
            }
            json_decref(root);
            session->close(OK);
        });
    }
}

point *getPoints(const json_t *pointsJson, int &total_points, point *&points) {
    total_points= json_array_size(pointsJson);
    points= (point*)malloc(sizeof(point) * total_points);
    for(int j=0; j < total_points; j++) {
        json_t *pointJson = json_array_get(pointsJson, j);
        int x = json_integer_value(json_array_get(pointJson, 0));
        int y = json_integer_value(json_array_get(pointJson, 1));
        points[j] = point(x, y);
    }
    return points;
}

color *getColor(json_t *pJson) {
    int red = json_integer_value(json_array_get(pJson, 0));
    int green = json_integer_value(json_array_get(pJson, 1));
    int blue = json_integer_value(json_array_get(pJson, 2));
    return new color(red, green, blue);
}

player_resource::player_resource(laser *laser1) {
    l = laser1;
    lp = new lines_player(l);
    this->resource = make_shared<Resource>();
    this->resource->set_path(PLAYER);
    this->resource->set_method_handler("POST", post_play_method_handler);
    char str[80];
    sprintf(str, "Restbed endpoint: %s", PLAYER);
    log::debug(str);
}

list<shared_ptr<Resource>> player_resource::getResources() {
    return {this->resource};
}

void player_resource::close() {
    lp->stop();
}