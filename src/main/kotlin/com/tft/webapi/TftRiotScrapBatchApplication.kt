package com.tft.webapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [DataSourceAutoConfiguration::class])
class TftRiotScrapBatchApplication

fun main(args: Array<String>) {
    runApplication<TftRiotScrapBatchApplication>(*args)
}
