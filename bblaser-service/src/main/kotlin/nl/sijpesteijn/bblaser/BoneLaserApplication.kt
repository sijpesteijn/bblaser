package nl.sijpesteijn.bblaser

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication


@SpringBootApplication
//@EnableReactiveMongoRepositories
class BoneLaserApplication

fun main(args: Array<String>) {
    runApplication<BoneLaserApplication>(*args)
}