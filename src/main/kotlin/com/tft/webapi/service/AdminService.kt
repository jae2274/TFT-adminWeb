package com.tft.webapi.service

import com.tft.webapi.controller.request.PutItemMatchesReq
import com.tft.webapi.controller.response.ChampionMatchRes
import com.tft.webapi.controller.response.ItemMatchRes
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
    ): ItemMatchRes {
        val items: List<Item> = itemRepository.findAllBySeasonAndIsFixed(season, false)
                .sortedByDescending { item -> item.similarity }

        return ItemMatchRes(
                itemMatches = items.map {
                    ItemMatchRes.ItemMatch(
                            itemId = it.itemId,
                            itemEngName = it.itemEngName,
                            itemImageUrl = it.imageUrl,
                    )
                }
        )
    }

    @Transactional
    fun putItemMatches(
            request: PutItemMatchesReq
    ) {
        val items: List<Item> =
                itemRepository.findAllBySeasonAndItemEngNameIn(request.season, request.itemMatches.map { it.itemEngName })

        val itemMap: Map<String, PutItemMatchesReq.ItemMatch> =
                request.itemMatches.associateBy({ it.itemEngName }, { it })

        for (item: Item in items) {
            item.itemId = itemMap[item.itemEngName]?.itemId
            item.isFixed = itemMap[item.itemEngName]?.isFixed ?: false
        }

        itemRepository.saveAll(items)
    }
}