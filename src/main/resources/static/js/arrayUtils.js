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
        return Object.assign({isFixed: (similarities[index] > 0.9)}, value)
    })
}

function setTargetForCompare(array, removeStrings) {
    return array.map(element => {
        let target = element.original
        for (let removeString of removeStrings) {
            target = target.replaceAll(removeString, "")
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
