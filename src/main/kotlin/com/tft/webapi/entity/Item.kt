package com.tft.webapi.entity

import com.querydsl.core.annotations.QueryEntity
import org.springframework.data.mongodb.core.mapping.Document
import javax.persistence.Entity
import javax.persistence.Id

@Entity
@QueryEntity
@Document
data class Item(
    @Id
    var _id: String? = null,
    var itemName: String = "",
    var itemEngName: String = "",
    var itemEffect: String = "",
    var itemSpec: String = "",
    var imageUrl: String = "",
    var childItems: List<String> = listOf(),
    var season: String = "",
    var itemId: String? = null,
    var similarity: Double = 0.0,
    var isFixed: Boolean = false,
)