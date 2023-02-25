package com.tft.webapi.repository


import com.tft.webapi.entity.Champion
import com.tft.webapi.entity.Item
import org.springframework.data.mongodb.repository.MongoRepository

interface ItemRepository : MongoRepository<Item, String> {
    fun findAllBySeasonAndEngNameIn(season: String, itemEngNames: List<String>): List<Item>
    fun findAllBySeason(season: String): List<Item>
    fun findAllBySeasonAndIsFixed(season: String, isFixed: Boolean): List<Item>
}