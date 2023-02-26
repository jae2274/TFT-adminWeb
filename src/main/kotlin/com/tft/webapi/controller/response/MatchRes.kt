package com.tft.webapi.controller.response

data class MatchRes(
        val datas: List<MatchData>,
        val dataIds: Collection<String>,
) {
    data class MatchData(
            val engName: String,
            val imageUrl: String,
            val engName2: String? = null,
    )
}
