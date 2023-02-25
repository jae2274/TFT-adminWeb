package com.tft.webapi.entity

interface TFTData {
    val engName: String
    var dataId: String?
    val similarity: Double?
    var isFixed: Boolean
}