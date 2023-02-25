package com.tft.webapi.entity

import com.querydsl.core.annotations.QueryEntity
import org.springframework.data.mongodb.core.mapping.Document
import javax.persistence.Entity
import javax.persistence.Id


@Document
data class Item(
        @Id
        var _id: String? = null,
        var itemName: String = "",
        var itemEffect: String = "",
        var itemSpec: String = "",
        var imageUrl: String = "",
        var childItems: List<String> = listOf(),
        var season: String = "",
        override var isFixed: Boolean = false,
        override var engName: String = "",
        override var dataId: String? = null,
        override var similarity: Double? = null,
) : TFTData