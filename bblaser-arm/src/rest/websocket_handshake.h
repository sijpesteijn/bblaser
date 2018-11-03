//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#ifndef BB_LASER_WEBSOCKET_HANDSHAKE_H
#define BB_LASER_WEBSOCKET_HANDSHAKE_H

#include <restbed>
#include <map>
#include <iostream>
#include <chrono>
#include <string>
#include <cstring>
#include <memory>
#include <utility>
#include <cstdlib>
#include <restbed>
#include <system_error>
#include <openssl/sha.h>
#include <openssl/hmac.h>
#include <openssl/evp.h>
#include <openssl/bio.h>
#include <openssl/buffer.h>

using namespace restbed;
using namespace std;

multimap< string, string > build_websocket_handshake_response_headers( const shared_ptr< const Request >& request);
//    void close_handler( const shared_ptr< WebSocket > socket );
//    void* checkObservers(void* params);


#endif //BB_LASER_WEBSOCKET_HANDSHAKE_H
