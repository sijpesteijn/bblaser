//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#include "rest.h"

rest::rest(list<rest_resource *> resources) {
    auto settings = make_shared< Settings >( );
    settings->set_port( 1984 );
    settings->set_default_header( "Connection", "close" );

    for ( rest_resource *r_resource: resources) {
        for ( shared_ptr<Resource> resource : r_resource->getResources()) {
            this->service.publish( resource );
        }
    }
    this->service.start( settings );
}