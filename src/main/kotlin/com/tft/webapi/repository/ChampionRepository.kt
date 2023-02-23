package com.tft.webapi.repository


import com.tft.webapi.entity.Champion
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface ChampionRepository : MongoRepository<Champion, String>, QuerydslPredicateExecutor<Champion> {
    fun findAllBySeasonAndChampionEngNameIn(season: String, championEngNames: List<String>): List<Champion>
    fun findAllBySeasonAndIsFixed(season: String, isFixed: Boolean): List<Champion>
}