package com.tft.webapi.entity

import com.querydsl.core.annotations.QueryEntity
import org.springframework.data.mongodb.core.mapping.Document
import javax.persistence.Entity
import javax.persistence.Id


@Document
data class Item(
        @Id
        val _id: String? = null,
        val itemName: String,
        val itemEffect: String,
        val itemSpec: String,
        val imageUrl: String,
        val childItems: List<String> = listOf(),
        val season: String,
        override val engName: String,
        val engName2: String,
        override var dataId: String? = null,
        override var isFixed: Boolean = false,
        override var similarity: Double? = null,
) : TFTData