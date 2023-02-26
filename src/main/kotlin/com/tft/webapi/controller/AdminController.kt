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

    @PutMapping("/champion_matches")
    fun putChampionMatches(
            @RequestBody
            putChampionMatchesReq: PutMatchesReq
    ): Unit {
        adminService.putChampionMatches(putChampionMatchesReq)
    }

    @GetMapping("/item_matches")
    fun itemMatches(
            @RequestParam
            season: String,
    ): MatchRes {
        val itemMatches = adminService.getItemMatches(season)
        return itemMatches
    }

    @PutMapping("/item_matches")
    fun putItemMatches(
            @RequestBody
            putItemMatchesReq: PutMatchesReq
    ): Unit {
        adminService.putItemMatches(putItemMatchesReq)
    }

    @GetMapping("/synergy_matches")
    fun synergyMatches(
            @RequestParam
            season: String,
    ): MatchRes {
        return adminService.getSynergyMatches(season)
    }

    @PutMapping("/synergy_matches")
    fun putSynergyMatches(
            @RequestBody
            request: PutMatchesReq
    ): Unit {
        adminService.putSynergyMatches(request)
    }

    @GetMapping("/augment_matches")
    fun augmentMatches(
            @RequestParam
            season: String,
    ): MatchRes {
        return adminService.getAugmentMatches(season)
    }

    @PutMapping("/augment_matches")
    fun putAugmentMatches(
            @RequestBody
            request: PutMatchesReq
    ): Unit {
        adminService.putAugmentMatches(request)
    }

}