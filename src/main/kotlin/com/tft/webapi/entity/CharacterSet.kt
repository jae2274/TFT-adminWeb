package com.tft.webapi.entity

import com.querydsl.core.annotations.QueryEntity
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import javax.persistence.Entity

@Entity
@QueryEntity
@Document(collection = "characterSet")
data class CharacterSet(
    @Id
    var season: String = "",
    var characters: List<String> = listOf(),
    var isProcessed: Boolean = false
)