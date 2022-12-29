package com.tft.webapi.controller.response

data class ChampionMatchRes(
    var championMatches: List<ChampionMatch>,
) {
    data class ChampionMatch(
        var championId: String?,
        var championEngName: String,
    )
}