package com.tft.webapi.controller

import com.tft.webapi.controller.request.PutItemMatchesReq
import com.tft.webapi.controller.response.ChampionMatchRes
import com.tft.webapi.controller.response.ItemMatchRes
import com.tft.webapi.service.AdminService
import org.springframework.web.bind.annotation.*

@RestController
class AdminController(
    private val adminService: AdminService
) {

    @GetMapping("/champion_matches")
    fun championMatches(
        @RequestParam
        season: String,
    ): ChampionMatchRes {
        return adminService.getChampionMatches(season)
    }

    @GetMapping("/item_matches")
    fun itemMatches(
        @RequestParam
        season: String,
    ): ItemMatchRes {
        return adminService.getItemMatches(season)
    }

    @PutMapping("/item_matches")
    fun putItemMatches(
        @RequestBody
        putItemMatchesReq: PutItemMatchesReq
    ): Unit {
        adminService.putItemMatches(putItemMatchesReq)
    }
}