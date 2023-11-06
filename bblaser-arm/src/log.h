//
// Created by Gijs Sijpesteijn on 20/12/2017.
//


#ifndef BBLASER_LOG_H
#define BBLASER_LOG_H

#include <string>

class log {
public:
    static void info(const std::string &message);

    static void debug(const std::string &message);

    static void error(const std::string &message);
};


#endif //BBLASER_LOG_H
