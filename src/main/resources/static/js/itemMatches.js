let app = new Vue({
    el: '#app',
    data: {
        removeEngStrings: [{target: ' '}, {target: '\''}],
        removeIdStrings: [{target: 'TFT8_Item_'}, {target: 'TFT4_Item_'}, {target: 'TFT5_Item_'}, {target: 'Ornn'}, {target: 'Item'}, {target: 'TFT__'}],
        itemEngValues: [],
        itemIdValues: [],
        similarities: [],
        jobs: [],
        affiliations: [],
        itemsMap: {},
        targets: [],
        itemsMapById: {},
        searchTarget: '',
    },
    async mounted() {
        this.reload()
    },
    methods: {
        handleIds() {
            this.itemIdValues = swapIndexes(this.itemIdValues, this.futureIndex, this.movingIndex)

            this.setSimilarities()
        },
        handleEngNames() {
            this.itemEngValues = swapIndexes(this.itemEngValues, this.futureIndex, this.movingIndex)

            this.setSimilarities()
        },
        checkMove: function (evt) {
            const {index, futureIndex} = evt.draggedContext
            this.movingIndex = index
            this.futureIndex = futureIndex
            return false // disable sort
        },
        putItemMatches: async function () {

            const itemMatches = this.itemEngValues.map((value, index) => {
                return {
                    itemEngName: value.original,
                    itemId: this.itemIdValues[index].original,
                    isFixed: this.itemIdValues[index].isFixed,
                }
            });

            const request = {
                season: "8",
                itemMatches: itemMatches
            }

            await callApi("PUT", "http://localhost:8080/item_matches?season=", request)
            await this.reload()
        },
        newRemoveEngString(index) {
            this.removeEngStrings = [...this.removeEngStrings.slice(0, index), {target: ''}, ...this.removeEngStrings.slice(index, this.removeEngStrings.length)]

        },
        removeEngStringInput(index) {
            if (this.removeEngStrings.length == 1)
                return
            this.removeEngStrings = [...this.removeEngStrings.slice(0, index), ...this.removeEngStrings.slice(index + 1, this.removeEngStrings.length)]
        },
        removeTargetStrings() {
            this.itemEngValues = setTargetForCompare(this.itemEngValues, this.removeEngStrings.map(value => value.target))
            this.itemIdValues = setTargetForCompare(this.itemIdValues, this.removeIdStrings.map(value => value.target))

            this.sortSimilarities()
        },
        newRemoveIdString(index) {
            this.removeIdStrings = [...this.removeIdStrings.slice(0, index + 1), {target: ''}, ...this.removeIdStrings.slice(index + 1, this.removeIdStrings.length)]

        },
        removeIdStringInput(index) {
            if (this.removeIdStrings.length == 1)
                return
            this.removeIdStrings = [...this.removeIdStrings.slice(0, index), ...this.removeIdStrings.slice(index + 1, this.removeIdStrings.length)]
        },
        async reload() {
            const response = await getItemMatches();
            this.itemIdValues = response.itemMatches
                .map((value, index) => {
                    return {original: value.itemId, index: index, isFixed: false, target: value.itemId};
                });


            this.itemEngValues = response.itemMatches
                .map((value, index) => {
                        return {
                            original: value.itemEngName,
                            itemImageUrl: value.itemImageUrl,
                            target: value.itemEngName,
                            index: index
                        };
                    }
                );

            this.removeTargetStrings()
            this.matchMostSimilarity()
        },
        setSimilarities() {
            this.similarities = getSimilaritiesOfTwoArrays(this.itemEngValues, this.itemIdValues)

            this.itemIdValues = setFixed(this.similarities, this.itemIdValues)
        },
        sortSimilarities() {
            this.setSimilarities()
            const package = zip3(this.itemEngValues, this.itemIdValues, this.similarities)
                .sort((prev, next) => next[2] - prev[2])

            this.itemEngValues = package.map(value => value[0])
            this.itemIdValues = package.map(value => value[1])
            this.similarities = package.map(value => value[2])
        },
        matchMostSimilarity() {
            this.removeTargetStrings()

            let [newItemEngValues, newItemIdValues] = matchMostSimilarities(this.itemEngValues, this.itemIdValues, this.searchTarget)

            this.itemEngValues = newItemEngValues
            this.itemIdValues = newItemIdValues

            this.setSimilarities()
        }
    }
})


async function getItemMatches() {
    let response = await fetch("http://localhost:8080/item_matches?season=" + 8);
    let json = response.json();

    return json;
}


async function callApi(method, url = '', data = {}) {
    // 옵션 기본 값은 *로 강조
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE 등
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
    });
    return response; // JSON 응답을 네이티브 JavaScript 객체로 파싱
}

const zip2 = (a, b) => a.map((k, i) => [k, b[i]]);
const zip3 = (a, b, c) => a.map((k, i) => [k, b[i], c[i]]);
