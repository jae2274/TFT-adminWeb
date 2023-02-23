package com.tft.webapi.controller.response

data class MatchRes(
        var matches: List<MatchData>,
) {
    data class MatchData(
            var dataId: String?,
            var engName: String,
            var imageUrl: String,
    )
}
