let app = new Vue({
    el: '#app',
    data: {
        // synergies:{},
        removeEngStrings: [{target: ' '}, {target: '\''}],
        removeIdStrings: [{target: 'TFT8_Item_'}, {target: 'TFT4_Item_'}, {target: 'TFT5_Item_'}, {target: 'Ornn'}, {target: 'Item'}],
        itemEngValues: [],
        itemIdValues: [],
        similarities: [],
        jobs: [],
        affiliations: [],
        itemsMap: {},
        targets: [],
        itemsMapById: {},
        winners: []
    },
    async mounted() {
        this.reload()
    },
    methods: {
        handleIds() {
            // this.$toast.show('dragEnd')
            if (this.itemIdValues[this.movingIndex].isFixed || this.itemIdValues[this.futureIndex].isFixed)
                return

            this.futureItem = this.itemIdValues[this.futureIndex]
            this.movingItem = this.itemIdValues[this.movingIndex]
            const _items = Object.assign([], this.itemIdValues)
            _items[this.futureIndex] = this.movingItem
            _items[this.movingIndex] = this.futureItem

            this.itemIdValues = _items

            this.setSimilarities()
        },
        handleEngNames() {
            // this.$toast.show('dragEnd')
            if (this.itemIdValues[this.movingIndex].isFixed || this.itemIdValues[this.futureIndex].isFixed)
                return

            this.futureItem = this.itemEngValues[this.futureIndex]
            this.movingItem = this.itemEngValues[this.movingIndex]
            const _items = Object.assign([], this.itemEngValues)
            _items[this.futureIndex] = this.movingItem
            _items[this.movingIndex] = this.futureItem

            this.itemEngValues = _items

            this.setSimilarities()
        },
        checkMove: function (evt) {
            // return this.itemIdValues[evt.draggedContext.element.index].isFixed == false;
            const {index, futureIndex} = evt.draggedContext
            this.movingIndex = index
            this.futureIndex = futureIndex
            return false // disable sort
        },
        putItemMatches: async function () {

            const itemMatches = this.itemEngValues.map((value, index) => {
                return {
                    itemEngName: value.itemEngName,
                    itemId: this.itemIdValues[index].itemId,
                    isFixed: this.itemIdValues[index].isFixed,
                }
            });

            const request = {
                season: "8",
                itemMatches: itemMatches
            }

            await callApi("PUT", "http://localhost:8080/item_matches?season=", request)
            this.reload()
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
            // let replacedItemEngs = this.itemEngValues.map(value => value.target)
            //
            // for (let removeString of this.removeEngStrings) {
            //     replacedItemEngs = replacedItemEngs.map(itemEngName => itemEngName.replaceAll(removeString.target, ""))
            // }

            for (let removeString of this.removeEngStrings) {
                for (let engValue of this.itemEngValues) {
                    engValue.target = engValue.target.replaceAll(removeString.target, "")
                }
            }
            for (let removeString of this.removeIdStrings) {
                for (let idValue of this.itemIdValues) {
                    idValue.target = idValue.target.replaceAll(removeString.target, "")
                }
            }


            // let replacedItemIds = this.itemIdValues.map(value => value.target)
            //
            // for (let removeString of this.removeIdStrings) {
            //     replacedItemIds = replacedItemIds.map(itemId => itemId.replaceAll(removeString.target, ""))
            // }

            this.sortSimilarities()
        },
        newRemoveIdString(index) {
            this.removeIdStrings = [...this.removeIdStrings.slice(0, index), {target: ''}, ...this.removeIdStrings.slice(index, this.removeIdStrings.length)]

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
                    return {itemId: value.itemId, index: index, isFixed: false, target: value.itemId};
                });


            this.itemEngValues = response.itemMatches
                .map((value, index) => {
                        return {
                            itemEngName: value.itemEngName,
                            itemImageUrl: value.itemImageUrl,
                            target: value.itemEngName,
                            index: index
                        };
                    }
                );

            this.removeTargetStrings()
            // this.setSimilarities(this.itemEngValues.map(value => value.itemEngName), this.itemIdValues.map(value => value.itemId))
        },
        setSimilarities() {
            this.similarities = zip2(this.itemEngValues.map(value => value.target), this.itemIdValues.map(value => value.target))
                .map(values => calculateSimilarity(values[0], values[1]))
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
            let newItemIdValues = []
            let newItemEngValues = []

            for (let i = 0; i < 10; i++) {
                for (let itemEngValue of this.itemEngValues) {
                    const mostSimliarId = getMostSimilarity(itemEngValue.target, this.itemIdValues.map(value => value.target))
                    if (calculateSimilarity(itemEngValue.target, mostSimliarId) > 0.8) {
                        const newItemIdValue = this.itemIdValues.find(value => value.target === mostSimliarId)
                        const removeIndex = this.itemIdValues.indexOf(newItemIdValue)

                        newItemIdValues.push(newItemIdValue)
                        newItemEngValues.push(itemEngValue)
                    }
                }
                removeAll(this.itemIdValues, newItemIdValues)
                removeAll(this.itemEngValues, newItemEngValues)
            }

            this.itemEngValues = [...newItemEngValues, ...this.itemEngValues]
            this.itemIdValues = [...newItemIdValues, ...this.itemIdValues] //[...newItemIdValues, ...this.itemIdValues]

            this.sortSimilarities()
        }
    }
})

function removeAll(targetArray, removeArray) {
    for (let removeEle of removeArray) {
        const index = targetArray.indexOf(removeEle)
        if (index > -1)
            targetArray.splice(index, 1)
    }
}

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
