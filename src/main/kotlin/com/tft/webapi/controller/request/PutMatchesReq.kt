package com.tft.webapi.controller.request

data class PutMatchesReq(
        var matches: List<Match>,
        var season: String,
) {
    data class Match(
            var dataId: String?,
            var engName: String,
            var isFixed: Boolean = false,
    )
}
