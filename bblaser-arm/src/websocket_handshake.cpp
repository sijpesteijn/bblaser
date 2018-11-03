//
// Created by Gijs Sijpesteijn on 24/10/2018.
//

#include "websocket_handshake.h"


string base64_encode( const unsigned char* input, int length )
{
    BIO* bmem, *b64;
    BUF_MEM* bptr;

    b64 = BIO_new( BIO_f_base64( ) );
    bmem = BIO_new( BIO_s_mem( ) );
    b64 = BIO_push( b64, bmem );
    BIO_write( b64, input, length );
    ( void ) BIO_flush( b64 );
    BIO_get_mem_ptr( b64, &bptr );

    char* buff = ( char* )malloc( bptr->length );
    memcpy( buff, bptr->data, bptr->length - 1 );
    buff[ bptr->length - 1 ] = 0;

    BIO_free_all( b64 );

    return buff;
}

multimap< string, string > build_websocket_handshake_response_headers( const shared_ptr< const Request >& request )
{
    auto key = request->get_header( "Sec-WebSocket-Key" );
    key.append( "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" );

    Byte hash[ SHA_DIGEST_LENGTH ];
    SHA1( reinterpret_cast< const unsigned char* >( key.data( ) ), key.length( ), hash );

    multimap< string, string > headers;
    headers.insert( make_pair( "Upgrade", "websocket" ) );
    headers.insert( make_pair( "Connection", "Upgrade" ) );
    headers.insert( make_pair( "Sec-WebSocket-Accept", base64_encode( hash, SHA_DIGEST_LENGTH ) ) );

    return headers;
}

