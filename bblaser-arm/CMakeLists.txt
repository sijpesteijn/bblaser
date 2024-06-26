cmake_minimum_required(VERSION 3.13.4)
project(bb_laser_arm)

set(CMAKE_CXX_STANDARD 20)


set(SOURCE_FILES src/domain/font.h src/main.cpp src/log.h src/log.cpp src/rest/rest.cpp src/rest/rest.h src/rest/rest_resource.h src/rest/lifeline_resource.cpp src/rest/lifeline_resource.h src/domain/laser.cpp src/domain/laser.h src/rest/websocket_handshake.cpp src/rest/websocket_handshake.h src/rest/player_resource.cpp src/rest/player_resource.h src/io/gpio.cpp src/io/gpio.h src/io/spi.cpp src/io/spi.h src/domain/segment.cpp src/domain/segment.h src/lines_player.cpp src/lines_player.h src/domain/point.cpp src/domain/point.h src/io/io.h src/rest/hello_resource.cpp src/rest/hello_resource.h src/domain/color.cpp src/domain/color.h src/domain/matrix3.cpp src/domain/matrix3.h src/domain/defines.h src/domain/drawing.cpp src/domain/drawing.h  src/rest/settings_resource.h src/rest/settings_resource.cpp src/domain/settings.h src/domain/settings.cpp)


#include_directories( /usr/local/include/openssl )
#include_directories( /usr/local/include/jansson )

if( APPLE )
    message("Running on Apple")
    set( OPENSSL_ROOT_DIR "/usr/local/opt/openssl")
    find_package(OpenSSL REQUIRED)
    if ( OPENSSL_FOUND )
        message(STATUS "OpenSSL Found: ${OPENSSL_VERSION}")
        message(STATUS "OpenSSL Include: ${OPENSSL_INCLUDE_DIR}")
        message(STATUS "OpenSSL Libraries: ${OPENSSL_LIBRARIES}")
        include_directories(${OPENSSL_INCLUDE_DIR})
    endif()
    link_directories(/usr/local/lib)
    find_library(RESTBED_LIBRARY restbed)
    find_library(JANSSON_LIBRARY jansson)
    find_library(CRYPTO_LIBRARY crypto)

    message(STATUS "RESTBED: ${RESTBED_LIBRARY}")
    message(STATUS "JANSSON: ${JANSSON_LIBRARY}")
    message(STATUS "CRYPTO: ${CRYPTO_LIBRARY}")
    set(SOURCE_FILES ${SOURCE_FILES})
    set(LIBS OpenSSL::SSL jansson pthread restbed)
else()
    message("Running on Beaglebone Black")
    set( OPENSSL_ROOT_DIR "/usr/bin/openssl")
    find_package(OpenSSL REQUIRED)
    if ( OPENSSL_FOUND )
        message(STATUS "OpenSSL Found: ${OPENSSL_VERSION}")
        message(STATUS "OpenSSL Include: ${OPENSSL_INCLUDE_DIR}")
        message(STATUS "OpenSSL Libraries: ${OPENSSL_LIBRARIES}")
        include_directories(${OPENSSL_INCLUDE_DIR})
    endif()
    include_directories(/home/debian/restbed/distribution/include)
    link_directories(/usr/lib)
#    find_library(RESTBED_LIBRARY restbed)
    find_library(JANSSON_LIBRARY jansson)
    find_library(CRYPTO_LIBRARY crypto)

#    message(STATUS "RESTBED: ${RESTBED_LIBRARY}")
    message(STATUS "JANSSON: ${JANSSON_LIBRARY}")
    message(STATUS "CRYPTO: ${CRYPTO_LIBRARY}")

    set(SOURCE_FILES ${SOURCE_FILES})
    set(LIBS OpenSSL::SSL jansson pthread restbed)
endif()


add_executable(bb_laser_arm ${SOURCE_FILES})
target_link_libraries( bb_laser_arm ${LIBS})