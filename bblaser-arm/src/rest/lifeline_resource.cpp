//
// Created by Gijs Sijpesteijn on 24/10/2018.
//
#include <map>

#include "../log.h"
#include "lifeline_resource.h"
#include "../domain/laser.h"
#include "websocket_handshake.h"


#define LIFELINE "/lifeline"

static laser *laser1;
static map<string, shared_ptr<WebSocket> > sockets = {};
static pthread_mutex_t checker_lock = PTHREAD_MUTEX_INITIALIZER;
static shared_ptr<Service> service = nullptr;


void lifeline_close_handler(const shared_ptr<WebSocket> socket) {
    log::debug("Lifeline close handler");
    if (socket->is_open()) {
        auto response = make_shared<WebSocketMessage>(WebSocketMessage::CONNECTION_CLOSE_FRAME, Bytes({10, 00}));
        socket->send(response);
    }

    const auto key = socket->get_key();
    sockets.erase(key);
    log::debug(string(to_string(sockets.size())));
    if (!laser1->isEnabled() && sockets.size() == 0) {
        log::debug("No connections car stopped");
        laser1->setEnabled(false);
    }

    log::debug("Closed connection to " + string(key.data()));
}

void lifeline_error_handler(const shared_ptr<WebSocket> socket, const error_code error) {
    const auto key = socket->get_key();
    log::debug("WebSocket Errored " + string(error.message().data()) + " for " + string(key.data()));
    sockets.erase(key);
}

void lifeline_message_handler(const shared_ptr<WebSocket> source, const shared_ptr<WebSocketMessage> message) {
    const auto opcode = message->get_opcode();

    if (opcode == WebSocketMessage::TEXT_FRAME) {
        const string body = "pong";
        auto response = make_shared<WebSocketMessage>(WebSocketMessage::TEXT_FRAME, body);
        source->send(response);
    }
}

void get_lifeline_method_handler(const shared_ptr<Session> session) {
    const auto request = session->get_request();
    const auto connection_header = request->get_header("connection", String::lowercase);

    if (connection_header.find("upgrade") not_eq string::npos) {
        if (request->get_header("upgrade", String::lowercase) == "websocket") {
            const auto headers = build_websocket_handshake_response_headers(request);

            session->upgrade(SWITCHING_PROTOCOLS, headers, [](const shared_ptr<WebSocket> socket) {
                if (socket->is_open()) {
                    if (pthread_mutex_lock(&checker_lock) != 0) {
                        log::debug("Sockethandler: Could not get a lock on the queue");
                    }
                    socket->set_close_handler(lifeline_close_handler);
                    socket->set_error_handler(lifeline_error_handler);
                    socket->set_message_handler(lifeline_message_handler);

                    const string body = "Lifeline connected";
                    socket->send(body, [](const shared_ptr<WebSocket> socket) {
                        const auto key = socket->get_key();
                        sockets.insert(make_pair(key, socket));
                    });
                    if (pthread_mutex_unlock(&checker_lock) != 0) {
                        log::debug("Sockethandler: Could not unlock the queue");
                    }
                } else {
                    fprintf(stderr, "WebSocket Negotiation Failed: Client closed connection.\n");
                }
            });

            return;
        }
    }

    session->close(BAD_REQUEST);
}

void *connectionChecker(void *params) {
    laser *l = (laser *) params;
    for (;;) {
        if (pthread_mutex_lock(&checker_lock) != 0) {
            log::debug("Sockethandler: Could not get a lock on the queue");
        }
        if (l->isEnabled() == false && sockets.size() > 0) {
            log::debug("New connection. Laser enabled.");
            l->setEnabled(true);
        }
        if (l->isEnabled() && sockets.size() == 0) {
            log::debug("No connections. Laser disabled.");
            l->setEnabled(false);
        }
        if (pthread_mutex_unlock(&checker_lock) != 0) {
            log::debug("Sockethandler: Could not unlock the queue");
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
    }
}

lifeline_resource::lifeline_resource(laser *l_p) {
    laser1 = l_p;
    this->resource = make_shared<Resource>();
    this->resource->set_path(LIFELINE);
    this->resource->set_method_handler("GET", get_lifeline_method_handler);
    char str[80];
    sprintf(str, "Restbed websocket: %s", LIFELINE);
    log::debug(str);
    pthread_t checker;
    pthread_create(&checker, NULL, connectionChecker, l_p);
}

list<shared_ptr<Resource>> lifeline_resource::getResources() {
    return {this->resource};
}
