package com.tft.webapi.repository;

import com.tft.webapi.entity.IdSet
import com.tft.webapi.entity.IdType
import org.springframework.data.mongodb.repository.MongoRepository

interface IdSetRepository : MongoRepository<IdSet, String> {
    fun findBySeasonAndType(season: String, type: IdType): IdSet
}