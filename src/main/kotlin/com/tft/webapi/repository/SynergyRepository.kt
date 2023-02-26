package com.tft.webapi.repository

import com.tft.webapi.entity.Synergy
import org.springframework.data.mongodb.repository.MongoRepository

interface SynergyRepository : MongoRepository<Synergy, String> {
    fun findAllBySeasonAndEngNameIn(season: String, engNames: List<String>): List<Synergy>
    fun findAllBySeason(season: String): List<Synergy>
}