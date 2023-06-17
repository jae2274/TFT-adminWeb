const season = "9"

let app = new Vue({
    el: '#app',
    data: {
        // removeEngStrings: [{target: ' '}, {target: '\''}],
        // removeIdStrings: [{target: 'TFT8_Item_'}, {target: 'TFT4_Item_'}, {target: 'TFT5_Item_'}, {target: 'Ornn'}, {target: 'Item'}, {target: 'TFT__'}],
        removeEngStrings: [{target: '.tft'}, {target: '-'}],
        removeIdStrings: [{target: 'TFT8_'}, {target: 'TFT7_'}, {target: 'TFT6_'}, {target: 'TFT5_'}, {target: 'TFT4_'}, {target: 'TFT3_'}, {target: 'TFT2_'}, {target: 'TFT1_'}, {target: 'Augment_'}],
        replaceEngStrings: [{searchValue: '1', replaceValue: 'I'}, {
            searchValue: '2',
            replaceValue: 'II'
        }, {searchValue: '3', replaceValue: 'III'}],
        replaceIdStrings: [{searchValue: '1', replaceValue: 'I'}, {
            searchValue: '2',
            replaceValue: 'II'
        }, {searchValue: '3', replaceValue: 'III'}],
        engNameValues: [],
        isAlias: false,
        dataIdValues: [],
        similarities: [],
        jobs: [],
        affiliations: [],
        targets: [],
        searchTarget: '',
    },
    async mounted() {
        this.reload()
    },
    methods: {
        handleIds() {
            this.dataIdValues = swapIndexes(this.dataIdValues, this.futureIndex, this.movingIndex)
            this.setSimilarities()
        },
        handleEngNames() {
            this.engNameValues = swapIndexes(this.engNameValues, this.futureIndex, this.movingIndex)

            this.setSimilarities()
        },
        checkMove: function (evt) {
            const {index, futureIndex} = evt.draggedContext
            this.movingIndex = index
            this.futureIndex = futureIndex
            return false // disable sort
        },
        putMatcheDatas: async function () {

            const matcheDatas = this.engNameValues.map((value, index) => {
                const dataIdValue = this.dataIdValues[index]
                return {
                    engName: value.engName,
                    dataId: dataIdValue?dataIdValue.original:null,
                    isFixed: dataIdValue?dataIdValue.isFixed:false,
                }
            });

            const request = {
                season,
                matches: matcheDatas
            }

            await callApi("PUT", "http://localhost:8081/" + subUrl + "?season=", request)
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
            this.engNameValues = setTargetForCompare(this.engNameValues, this.removeEngStrings.map(value => value.target), this.replaceEngStrings)
            this.dataIdValues = setTargetForCompare(this.dataIdValues, this.removeIdStrings.map(value => value.target), this.replaceIdStrings)

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
        newReplaceIdString(index) {
            this.replaceIdStrings = [...this.replaceIdStrings.slice(0, index + 1), {target: ''}, ...this.replaceIdStrings.slice(index + 1, this.replaceIdStrings.length)]

        },
        replaceIdStringInput(index) {
            if (this.replaceIdStrings.length == 1)
                return
            this.replaceIdStrings = [...this.replaceIdStrings.slice(0, index), ...this.replaceIdStrings.slice(index + 1, this.replaceIdStrings.length)]
        },
        newReplaceEngString(index) {
            this.replaceEngStrings = [...this.replaceEngStrings.slice(0, index + 1), {target: ''}, ...this.replaceEngStrings.slice(index + 1, this.replaceEngStrings.length)]

        },
        replaceEngStringInput(index) {
            if (this.replaceEngStrings.length == 1)
                return
            this.replaceEngStrings = [...this.replaceEngStrings.slice(0, index), ...this.replaceEngStrings.slice(index + 1, this.replaceEngStrings.length)]
        },
        async reload() {
            const response = await getMatchDatas();
            this.dataIdValues = response.dataIds
                .map((dataId, index) => {
                    return {original: dataId, index: index, isFixed: false};
                });


            this.engNameValues = response.datas
                .map((value, index) => {
                        return {
                            original: value.engName,
                            imageUrl: value.imageUrl,
                            index: index,
                            engName: value.engName,
                            engName2: value.engName2,
                        };
                    }
                );

            this.removeTargetStrings()
            this.matchMostSimilarity()
        },
        setSimilarities() {
            this.similarities = getSimilaritiesOfTwoArrays(this.engNameValues, this.dataIdValues)

            this.dataIdValues = setFixed(this.similarities, this.dataIdValues)
        },
        sortSimilarities() {
            this.setSimilarities()
            const package = zip3(this.engNameValues, this.dataIdValues, this.similarities)
                .sort((prev, next) => next[2] && prev[2] ? (next[2] - prev[2]) : Number.MIN_VALUE)

            this.engNameValues = package.filter(value => value[0]).map(value => value[0])
            this.dataIdValues = package.filter(value => value[1]).map(value => value[1])
            this.similarities = package.filter(value => value[2]).map(value => value[2])
        },
        matchMostSimilarity() {
            this.removeTargetStrings()

            let [newEngValues, newdataIdValues] = matchMostSimilarities(this.engNameValues, this.dataIdValues, this.searchTarget)

            this.engNameValues = newEngValues
            this.dataIdValues = newdataIdValues

            this.setSimilarities()
        },

        toggleAlias() {
            this.isAlias = !this.isAlias
            this.engNameValues.forEach(value => {
                const willUsedName = this.isAlias ? value.engName2 : value.engName
                value.original = willUsedName
                value.target = willUsedName
            })
            this.removeTargetStrings()
            this.setSimilarities()
        }
    }
})


async function getMatchDatas() {
    let response = await fetch("http://localhost:8081/" + subUrl + "?season=" + season);
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

function zip2(a, b) {
    const biggetLength = a.length > b.length ? a.length : b.length
    return Array.from({length: biggetLength}, (_, i) => [a[i], b[i]])
}

function zip3(a, b, c) {
    const biggetLength = Math.max(a.length, b.length, c.length)
    return Array.from({length: biggetLength}, (_, i) => [a[i], b[i], c[i]])
}

