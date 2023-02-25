package com.tft.webapi.controller.response

data class MatchRes(
        val datas: List<MatchData>,
        val dataIds: Collection<String>,
) {
    data class MatchData(
            var engName: String,
            var imageUrl: String,
    )
}
