package com.tft.webapi.repository


import com.tft.webapi.entity.ItemSet
import org.springframework.data.mongodb.repository.MongoRepository

interface ItemSetRepository : MongoRepository<ItemSet, String> {

}