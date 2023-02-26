package com.tft.webapi.entity

import org.springframework.data.mongodb.core.mapping.Document
import javax.persistence.Id

@Document
data class Synergy(
        @Id
        var _id: String? = null,
        val season: String,
        val name: String,
        val type: SynergyType,
        val desc: String,
        val stats: List<String>,
        val imageUrl: String,
        val champions: List<String>,
        override val engName: String,
        override var dataId: String? = null,
        override var isFixed: Boolean = false,
        override var similarity: Double? = null,
) : TFTData