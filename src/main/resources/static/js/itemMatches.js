let app = new Vue({
    el: '#app',
    data: {
        // synergies:{},
        itemIds: [],
        itemEngNames: [],
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
        checkMove: function (evt) {
            return evt.draggedContext.element.isFixed == false;
        },
        putItemMatches: async function () {

            const itemMatches = this.itemEngNames.map((value, index) => {
                return {
                    itemEngName: value.itemEngName,
                    itemId: this.itemIds[index].itemId,
                    isFixed: this.itemIds[index].isFixed,
                }
            });

            const request = {
                season: "8",
                itemMatches: itemMatches
            }

            await callApi("PUT", "http://localhost:8080/item_matches?season=", request)
            this.reload()
        },

        async reload() {
            const response = await getItemMatches();
            this.itemIds = response.itemMatches
                .map(value => {
                    return {itemId: value.itemId, isFixed: false};
                });

            this.itemEngNames = response.itemMatches
                .map(value => {
                        return {itemEngName: value.itemEngName};
                    }
                );
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