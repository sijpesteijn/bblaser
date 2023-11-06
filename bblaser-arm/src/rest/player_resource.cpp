//
// Created by Gijs Sijpesteijn on 25/10/2018.
//

#include "player_resource.h"
#include "../lines_player.h"
#include "../log.h"
#include <jansson.h>
#include <list>

#define PLAYER "/play"

using namespace std;
static laser *l;
static lines_player *lp;

u_int32_t hex2int(char *hex) {
//    cout << "hex: " << hex << endl;
    u_int32_t number = (u_int32_t) strtol(hex, nullptr, 16);
//    cout << "number: " << number << endl;
    return number;
}

u_int8_t getColor(char d1, char d2) {
    char color[3];
    color[0] = d1;
    color[1] = d2;
    color[2] = '\0';
    return hex2int(color);
}

u_int16_t getCoordinate(char d0, char d1, char d2) {
    char coordinate[4];
    coordinate[0] = d0;
    coordinate[1] = d1;
    coordinate[2] = d2;
    coordinate[3] = '\0';
    return hex2int(coordinate);
}

void post_play_method_handler(const shared_ptr <Session> &session) {
//    if (!l->isOn()) {
//        string error_body = "No lifeline. Laser not accepting.";
//        session->close(405, error_body, {{"Content-Length", ::to_string(error_body.size())}});
//    } else {
    l->on();
    const auto request = session->get_request();
    int content_length = request->get_header("Content-Length", 0);

    session->fetch(content_length, [](const shared_ptr <Session> &session, const Bytes &body) {
        char *p, *data = (char *) &body[0];
        char *lines;
        lines = strtok(data, "\n");
        while (lines != NULL) {
            cout << lines << endl; // print the string token
            lines = strtok(NULL, " , ");
        }
        cout << "Body: " << data << endl;
        uint8_t i;
        vector <segment> segmentVector;
        for (i = 1, p = strtok(data, "\n"); p != nullptr; p = strtok(nullptr, "\n"), i++) {
            uint16_t index = 0, body_length = body.size(), points_length = body_length - 6;
//                cout << "Body len: " << p << endl;
            cout << "Body len: " << body_length << endl;
//                cout << "Point len: " << points_length << endl;
            auto *c = new color(getColor(p[0], p[1]), getColor(p[2], p[3]), getColor(p[4], p[5]));
            if ((body_length - 6) % 6 == 0) {
                auto *points = (point *) malloc(sizeof(point) * (points_length / 4));
                for (int j = 6; j < body_length;) {
                    points[index++] = point(getCoordinate(p[j], p[j + 1], p[j + 2]),
                                            getCoordinate(p[j + 3], p[j + 4], p[j + 5]));
                    j += 6;
                }
                segmentVector.emplace_back(c, points_length / 6, points);
            } else {
                cout << "Content length not okay" << endl;
            }
        }
        if (segmentVector.empty()) {
            lp->disable();
        } else {
            segment *segments = (segment *) malloc(sizeof(segment) * segmentVector.size());
            copy(segmentVector.begin(), segmentVector.end(), segments);
            lines_player::playLines(segments, segmentVector.size());
        }
        session->close(OK);
    });
//    }
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

list <shared_ptr<Resource>> player_resource::getResources() {
    return {this->resource};
}

void player_resource::close() {
    lp->stop();
}