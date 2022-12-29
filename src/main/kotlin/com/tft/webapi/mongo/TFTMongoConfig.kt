package com.tft.apibatch.mongo

import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.data.mongodb.config.EnableMongoAuditing
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@EnableMongoAuditing
@EnableMongoRepositories(basePackages = ["com.tft.webapi.scrapper.repository"])
@EnableJpaRepositories(basePackages = [])
@Configuration
class TFTMongoConfig : MongoConfig {
//    @Value("\${mongodb.uri}")
//    private lateinit var uri: String
//
//    @Value("\${mongodb.dbname}")
//    private lateinit var dbname: String
//
//    @Bean("mongoClient")
//    fun mongoClient(): MongoClient {
//        return MongoClients.create(mongoClientSettings(uri, generalPoolSettings()))
//    }
//
//    @Bean("mongoTemplate")
//    fun mongoTemplate(
//        @Qualifier("mongoClient") mongoClient: MongoClient
//    ): MongoTemplate {
//        return MongoTemplate(mongoClient, dbname)
//    }
}