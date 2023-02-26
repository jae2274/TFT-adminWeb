package com.tft.webapi.entity

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document


@Document
data class Augment(

        @Id
        var _id: String? = null,
        val season: String,
        val name: String,
        val augmentId: String? = null,
        val tier: Int,
        val tierName: String,
        val desc: String,
        val imageUrl: String,
        override var isFixed: Boolean = false,
        override var engName: String = "",
        override var dataId: String? = null,
        override var similarity: Double? = null,
) : TFTData
