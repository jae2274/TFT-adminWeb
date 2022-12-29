package com.tft.webapi.entity

import com.querydsl.core.annotations.QueryEntity
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import javax.persistence.Entity

@Entity
@QueryEntity
@Document(collection = "synergySet")
data class SynergySet(
    @Id
    var season: String = "",
    var synergies: List<String> = listOf()
)