let app = new Vue({
    el: '#app',
    data: {
        // synergies:{},
        championIds: [],
        championEngNames: [],
        jobs: [],
        affiliations: [],
        championsMap: {},
        targets: [],
        championsMapById: {},
        winners: []
    },
    async mounted() {
        const response = await getChampionMatches();
        this.championIds = response.championMatches
            .map(value => {
                return {championId: value.championId, isFixed: false};
            });

        this.championEngNames = response.championMatches
            .map(value => {
                    return {championEngName: value.championEngName};
                }
            );
    },
    methods: {
        checkMove: function (evt) {
            return evt.draggedContext.element.isFixed == false;
        }
    }
})

async function getChampionMatches() {
    let response = await fetch("http://localhost:8080/champion_matches?season=" + 8);
    let json = response.json();

    return json;
}