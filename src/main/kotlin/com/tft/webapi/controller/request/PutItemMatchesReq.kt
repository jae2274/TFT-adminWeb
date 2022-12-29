package com.tft.webapi.controller.request

data class PutItemMatchesReq(
    var itemMatches: List<ItemMatch>,
    var season: String,
) {
    data class ItemMatch(
        var itemId: String?,
        var itemEngName: String,
        var isFixed: Boolean = false,
    )
}
