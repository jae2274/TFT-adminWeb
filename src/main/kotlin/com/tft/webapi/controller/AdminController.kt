package com.tft.webapi.controller

import com.tft.webapi.controller.request.PutMatchesReq
import com.tft.webapi.controller.response.MatchRes
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
    ): MatchRes {
        return adminService.getChampionMatches(season)
    }

    @GetMapping("/item_matches")
    fun itemMatches(
            @RequestParam
            season: String,
    ): MatchRes {
        return adminService.getItemMatches(season)
    }

    @PutMapping("/item_matches")
    fun putItemMatches(
            @RequestBody
            putItemMatchesReq: PutMatchesReq
    ): Unit {
        adminService.putItemMatches(putItemMatchesReq)
    }

    @PutMapping("/champion_matches")
    fun putChampionMatches(
            @RequestBody
            putChampionMatchesReq: PutMatchesReq
    ): Unit {
        adminService.putChampionMatches(putChampionMatchesReq)
    }
}