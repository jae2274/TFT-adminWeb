package com.tft.webapi.repository


import com.tft.webapi.entity.Augment
import org.springframework.data.mongodb.repository.MongoRepository

interface AugmentRepository : MongoRepository<Augment, String> {
    fun findAllBySeasonAndEngNameIn(season: String, championEngNames: List<String>): List<Augment>
    fun findAllBySeasonAndIsFixed(season: String, isFixed: Boolean): List<Augment>
    fun findAllBySeason(season: String): List<Augment>

}