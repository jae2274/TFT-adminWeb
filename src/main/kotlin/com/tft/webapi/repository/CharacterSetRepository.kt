package com.tft.webapi.repository


import com.tft.webapi.entity.CharacterSet
import org.springframework.data.mongodb.repository.MongoRepository

interface CharacterSetRepository : MongoRepository<CharacterSet, String> {
}