package com.tft.webapi.controller

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.print
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap

@SpringBootTest
@AutoConfigureMockMvc
internal class AdminControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun championMatches() {
        val info: MultiValueMap<String, String> = LinkedMultiValueMap()

        info.add("season", "8")

        mockMvc.perform(
            get("/champion_matches")       // 1, 2
                .params(info)
        )              // 3
            .andExpect(status().isOk())     // 4
            .andDo(print())                // 5

    }
}