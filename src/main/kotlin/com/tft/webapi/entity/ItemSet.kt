package com.tft.webapi.entity

import com.querydsl.core.annotations.QueryEntity
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import javax.persistence.Entity

@Entity
@QueryEntity
@Document(collection = "itemSet")
data class ItemSet(
    @Id
    var season: String = "",
    var items: List<String> = listOf(),
    var isProcessed: Boolean = false,
)