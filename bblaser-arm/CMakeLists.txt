cmake_minimum_required(VERSION 3.12)
project(bb_laser_arm)

set(CMAKE_CXX_STANDARD 14)

find_package(OpenSSL REQUIRED)

set(SOURCE_FILES src/main.cpp src/log.h src/log.cpp src/rest.cpp src/rest.h src/rest_resource.h src/lifeline_resource.cpp src/lifeline_resource.h src/laser.cpp src/laser.h src/websocket_handshake.cpp src/websocket_handshake.h src/player_resource.cpp src/player_resource.h src/gpio.cpp src/gpio.h src/spi.cpp src/spi.h src/line.cpp src/line.h src/lines_player.cpp src/lines_player.h src/point.cpp src/point.h)

include_directories( /usr/local/include/restbed )
include_directories( /usr/local/include/openssl )
include_directories( /usr/local/include/jansson )

if( APPLE )
    link_directories(/usr/local/lib)
    link_directories(/usr/local/opt/openssl/lib)
    set(SOURCE_FILES ${SOURCE_FILES})
else()
    set(SOURCE_FILES ${SOURCE_FILES})
endif()

set(LIBS restbed OpenSSL::SSL jansson pthread crypto)
add_executable(bb_laser_arm ${SOURCE_FILES})
target_link_libraries( bb_laser_arm ${LIBS})