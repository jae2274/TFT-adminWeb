function swapIndexes(array, futureIndex, movingIndex) {
    const futureItem = array[futureIndex]
    const movingItem = array[movingIndex]
    const newArray = Object.assign([], array)
    newArray[futureIndex] = movingItem
    newArray[movingIndex] = futureItem

    return newArray
}

function matchMostSimilarities(firstArray, secondArray, priorityKeyword) {
    let priorityFirstArray = []
    let prioritySecondArray = []

    if (priorityKeyword !== '') {
        priorityFirstArray = search(priorityKeyword, firstArray)
        firstArray = removeAll(firstArray, priorityFirstArray)

        prioritySecondArray = search(priorityKeyword, secondArray)
        secondArray = removeAll(secondArray, prioritySecondArray)
    }

    const [sortedPriorityFirstArray, sortedPrioritySecondArray] = matchMostSimilarity(priorityFirstArray, prioritySecondArray);
    const [newFirstArray, newSecondArray] = matchMostSimilarity(firstArray, secondArray);

    return [[...sortedPriorityFirstArray, ...newFirstArray], [...sortedPrioritySecondArray, ...newSecondArray]]
}

function setFixed(similarities, array) {
    return array.map((value, index) => {
        const newValue = Object.assign({}, value)
        newValue.isFixed = similarities[index] > 0.99
        return newValue
    })
}

function setTargetForCompare(array, removeStrings, replaceStrings) {
    return array.map(element => {
        let target = element.original

        for (const removeString of removeStrings) {
            target = target.replaceAll(removeString, "")
        }

        for (const {searchValue, replaceValue} of replaceStrings) {
            target = target.replaceAll(searchValue, replaceValue)
        }

        const newElement = Object.assign({}, element)
        newElement.target = target
        return newElement
    })
}

function search(keyword, array) {
    return array.filter(value => value.target.toLowerCase().includes(keyword.toLowerCase()));
}

function getSimilaritiesOfTwoArrays(firstArray, secondArray) {
    return zip2(firstArray.map(value => value.target), secondArray.map(value => value.target))
        .filter(values => values[0] && values[1])
        .map(values => calculateSimilarity(values[0], values[1]))
}

function matchMostSimilarity(firstArray, secondArray) {
    const newFirstArray = []
    const newSecondArrays = []

    for (let goalSimilarity = 0.95; goalSimilarity > 0.05; goalSimilarity -= 0.05) {
        for (let firstItem of firstArray) {
            if (secondArray.length == 0)
                break

            const mostSimilarStr = getMostSimilarity(firstItem.target, secondArray.map(value => value.target))

            if (calculateSimilarity(firstItem.target, mostSimilarStr) > goalSimilarity) {
                const newSecondItem = secondArray.find(value => value.target === mostSimilarStr)

                newFirstArray.push(firstItem)
                newSecondArrays.push(newSecondItem)
            }
            secondArray = removeAll(secondArray, newSecondArrays)
        }
        firstArray = removeAll(firstArray, newFirstArray)
    }

    return [[...newFirstArray, ...firstArray], [...newSecondArrays, ...secondArray]]
}

function removeAll(targetArray, removeArray) {
    return targetArray.filter(targetValue => removeArray.findIndex(removeValue => removeValue.original == targetValue.original) < 0)
}
