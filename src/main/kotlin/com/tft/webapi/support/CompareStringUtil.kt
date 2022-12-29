package com.tft.webapi.support

import java.util.*

object CompareStringUtil {
    fun similarity(s1: String, s2: String, ignoreCase: Boolean = true): Double {
        val s1 = if (ignoreCase) s1.lowercase() else s1
        val s2 = if (ignoreCase) s2.lowercase() else s2

        var longer = s1
        var shorter = s2

        if (s1.length < s2.length) {
            longer = s2
            shorter = s1
        }
        val longerLength = longer.length
        return if (longerLength == 0) 1.0 else (longerLength - editDistance(longer, shorter)) / longerLength.toDouble()
    }

    fun getMostSimilarity(target: String, strings: Collection<String>, ignoreCase: Boolean = true): String {

        var maxSimilarity = 0.0
        var mostSimilarity = ""
        for (string in strings) {
            val similarity = similarity(target, string, ignoreCase)
            if (maxSimilarity < similarity) {
                maxSimilarity = similarity
                mostSimilarity = string
            }
        }
        return mostSimilarity
    }

    private fun editDistance(s1: String, s2: String): Int {
        var s1 = s1
        var s2 = s2
        s1 = s1.lowercase(Locale.getDefault())
        s2 = s2.lowercase(Locale.getDefault())
        val costs = IntArray(s2.length + 1)
        for (i in 0..s1.length) {
            var lastValue = i
            for (j in 0..s2.length) {
                if (i == 0) {
                    costs[j] = j
                } else {
                    if (j > 0) {
                        var newValue = costs[j - 1]
                        if (s1[i - 1] != s2[j - 1]) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
                        }
                        costs[j - 1] = lastValue
                        lastValue = newValue
                    }
                }
            }
            if (i > 0) costs[s2.length] = lastValue
        }
        return costs[s2.length]
    }
}