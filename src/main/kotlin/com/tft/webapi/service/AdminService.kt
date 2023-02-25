package com.tft.webapi.service

import com.tft.webapi.controller.request.PutMatchesReq
import com.tft.webapi.controller.response.MatchRes
import com.tft.webapi.entity.Champion
import com.tft.webapi.entity.IdType
import com.tft.webapi.entity.Item
import com.tft.webapi.entity.TFTData
import com.tft.webapi.repository.ChampionRepository
import com.tft.webapi.repository.IdSetRepository
import com.tft.webapi.repository.ItemRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminService(
        private val championRepository: ChampionRepository,
        private val itemRepository: ItemRepository,
        private val idSetRepository: IdSetRepository,
) {
    fun getChampionMatches(
            season: String,
    ): MatchRes {
        val champions: List<Champion> = championRepository.findAllBySeason(season)
        val alreadyMatchedIds = champions.filter { it.isFixed }.map { it.dataId }

        val dataIds = idSetRepository.findBySeasonNumberAndType(season.toInt(), IdType.CHAMPION).ids
                .filterNot { alreadyMatchedIds.contains(it) }

        return MatchRes(
                datas = champions.filterNot { it.isFixed }.map {
                    MatchRes.MatchData(
                            engName = it.engName,
                            imageUrl = it.imageUrl,
                    )
                },
                dataIds = dataIds,
        )
    }

    fun getItemMatches(
            season: String,
    ): MatchRes {
        val items: List<Item> = itemRepository.findAllBySeason(season)
        val alreadyMatchedIds = items.filter { it.isFixed }.map { it.dataId }

        val dataIds = idSetRepository.findBySeasonNumberAndType(season.toInt(), IdType.ITEM).ids
                .filterNot { alreadyMatchedIds.contains(it) }

        return MatchRes(
                datas = items.filterNot { it.isFixed }.map {
                    MatchRes.MatchData(
                            engName = it.engName,
                            imageUrl = it.imageUrl,
                    )
                },
                dataIds = dataIds,
        )
    }

    @Transactional
    fun putItemMatches(
            request: PutMatchesReq
    ) {
        val items: List<Item> =
                itemRepository.findAllBySeasonAndEngNameIn(request.season, request.matches.map { it.engName })

        matching(request, items)
        itemRepository.saveAll(items)
    }

    @Transactional
    fun putChampionMatches(request: PutMatchesReq) {
        val champions: List<Champion> =
                championRepository.findAllBySeasonAndEngNameIn(request.season, request.matches.map { it.engName })


        matching(request, champions)
        championRepository.saveAll(champions)

    }

    fun matching(request: PutMatchesReq, tftDatas: List<TFTData>) {
        val dataMap: Map<String, PutMatchesReq.Match> =
                request.matches.associateBy({ it.engName }, { it })

        for (tftData: TFTData in tftDatas) {
            tftData.dataId = dataMap[tftData.engName]?.dataId
            tftData.isFixed = dataMap[tftData.engName]?.isFixed ?: false
        }
    }
}