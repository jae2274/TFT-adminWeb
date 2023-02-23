package com.tft.webapi.service

import com.tft.webapi.controller.request.PutMatchesReq
import com.tft.webapi.controller.response.ChampionMatchRes
import com.tft.webapi.controller.response.MatchRes
import com.tft.webapi.entity.Champion
import com.tft.webapi.entity.Item
import com.tft.webapi.repository.ChampionRepository
import com.tft.webapi.repository.ItemRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminService(
        private val championRepository: ChampionRepository,
        private val itemRepository: ItemRepository,
) {
    fun getChampionMatches(
            season: String,
    ): ChampionMatchRes {
        val champions: List<Champion> = championRepository.findAllBySeason(season)

        return ChampionMatchRes(
                championMatches = champions.map {
                    ChampionMatchRes.ChampionMatch(
                            championId = it.championId,
                            championEngName = it.championEngName,
                    )
                }
        )
    }

    fun getItemMatches(
            season: String,
    ): MatchRes {
        val items: List<Item> = itemRepository.findAllBySeasonAndIsFixed(season, false)
                .sortedByDescending { item -> item.similarity }

        return MatchRes(
                matches = items.map {
                    MatchRes.MatchData(
                            dataId = it.itemId,
                            engName = it.itemEngName,
                            imageUrl = it.imageUrl,
                    )
                }
        )
    }

    @Transactional
    fun putItemMatches(
            request: PutMatchesReq
    ) {
        val items: List<Item> =
                itemRepository.findAllBySeasonAndItemEngNameIn(request.season, request.matches.map { it.engName })

        val itemMap: Map<String, PutMatchesReq.Match> =
                request.matches.associateBy({ it.engName }, { it })

        for (item: Item in items) {
            item.itemId = itemMap[item.itemEngName]?.dataId
            item.isFixed = itemMap[item.itemEngName]?.isFixed ?: false
        }

        itemRepository.saveAll(items)
    }
}