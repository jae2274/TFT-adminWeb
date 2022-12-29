package com.tft.webapi.controller.response

data class ItemMatchRes(
    var itemMatches: List<ItemMatch>,
) {
    data class ItemMatch(
        var itemId: String?,
        var itemEngName: String,
        var itemImageUrl: String,
    )
}