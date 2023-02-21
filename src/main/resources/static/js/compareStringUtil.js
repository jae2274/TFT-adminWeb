function calculateSimilarity(s1, s2, ignoreCase = true) {
    s1 = ignoreCase ? s1.toLowerCase() : s1;
    s2 = ignoreCase ? s2.toLowerCase() : s2;

    let longer = s1;
    let shorter = s2;

    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    const longerLength = longer.length;
    return longerLength === 0 ? 1.0 : (longerLength - editDistance(longer, shorter)) / longerLength;
}

function getMostSimilarity(target, strings, ignoreCase = true) {
    let maxSimilarity = 0.0;
    let mostSimilarity = "";
    for (let string of strings) {
        const similarity = calculateSimilarity(target, string, ignoreCase);
        if (maxSimilarity < similarity) {
            maxSimilarity = similarity;
            mostSimilarity = string;
        }
    }
    return mostSimilarity;
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const costs = new Array(s2.length + 1);
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}