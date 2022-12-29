package com.tft.webapi.repository


import com.tft.webapi.entity.Item
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface ItemRepository : MongoRepository<Item, String>, QuerydslPredicateExecutor<Item> {
    fun findAllBySeasonAndItemEngNameIn(season: String, itemEngNames: List<String>): List<Item>
    fun findAllBySeason(season: String): List<Item>
    fun findAllBySeasonAndIsFixed(season: String, isFixed: Boolean): List<Item>
}