cmake_minimum_required(VERSION 3.7)
project(bb_laser_arm)

set(CMAKE_CXX_STANDARD 14)


set(SOURCE_FILES src/main.cpp src/log.h src/log.cpp src/rest/rest.cpp src/rest/rest.h src/rest/rest_resource.h src/rest/lifeline_resource.cpp src/rest/lifeline_resource.h src/domain/laser.cpp src/domain/laser.h src/rest/websocket_handshake.cpp src/rest/websocket_handshake.h src/rest/player_resource.cpp src/rest/player_resource.h src/io/gpio.cpp src/io/gpio.h src/io/spi.cpp src/io/spi.h src/domain/line.cpp src/domain/line.h src/lines_player.cpp src/lines_player.h src/domain/point.cpp src/domain/point.h src/io/io.h)

include_directories( /usr/local/include/restbed )
include_directories( /usr/local/include/openssl )
include_directories( /usr/local/include/jansson )

if( APPLE )
    find_package(OpenSSL REQUIRED)
    link_directories(/usr/local/lib)
    link_directories(/usr/local/opt/openssl/lib)
    set(SOURCE_FILES ${SOURCE_FILES})
    set(LIBS restbed OpenSSL::SSL jansson pthread crypto)
else()
    set(SOURCE_FILES ${SOURCE_FILES})
    set(LIBS restbed openssl jansson pthread crypto)
endif()

add_executable(bb_laser_arm ${SOURCE_FILES})
target_link_libraries( bb_laser_arm ${LIBS})