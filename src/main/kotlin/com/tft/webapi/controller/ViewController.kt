package com.tft.webapi.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.servlet.ModelAndView

@Controller
class ViewController {
    @GetMapping("/view/{subUrl}")
    fun view(
            @PathVariable subUrl: String
    ): ModelAndView {
        val mv = ModelAndView("matches")
        mv.addObject("subUrl", subUrl)

        return mv
    }
}