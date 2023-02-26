package com.tft.webapi.entity

import com.querydsl.core.annotations.QueryEntity
import org.springframework.data.mongodb.core.mapping.Document
import javax.persistence.Id

@Document
data class Champion(
        @Id
        var _id: String? = null,
        var championName: String = "",
        var cost: Int = 0,
        var traits: List<Trait> = listOf(),
        var attachRange: Int = 0,
        var skillName: String = "",
        var skillExplanation: String = "",
        var powersByLevel: List<Map<Int, PowerByLevel>> = listOf(),
        var initMana: Int = 0,
        var maxMana: Int = 0,
        var imageUrl: String = "",
        var season: String = "",
        override var isFixed: Boolean = false,
        override var engName: String = "",
        override var dataId: String? = null,
        override var similarity: Double? = null,
) : TFTData {
    data class PowerByLevel(
            var effectName: String = "",
            var effectPower: String = "",
    )
}