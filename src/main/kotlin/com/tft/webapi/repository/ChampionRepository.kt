package com.tft.webapi.repository


import com.tft.webapi.entity.Champion
import org.springframework.data.mongodb.repository.MongoRepository

interface ChampionRepository : MongoRepository<Champion, String> {
    fun findAllBySeasonAndEngNameIn(season: String, championEngNames: List<String>): List<Champion>
    fun findAllBySeasonAndIsFixed(season: String, isFixed: Boolean): List<Champion>
    fun findAllBySeason(season: String): List<Champion>
}