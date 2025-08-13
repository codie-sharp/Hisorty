<template>
    <textarea v-model="queryTextarea" placeholder="Query goes here" autofocus="true"/>
    <button id="query-button" @click="executeQuery()">Execute Query</button>
    <textarea v-model="resultsTextarea" placeholder="Results go here" readonly="true"/>
    <!-- TODO: add a card component -->
    <div v-if="processedResults && processedResults.length > 0">
        <h3>Test Results:</h3>
        <div v-for="result in processedResults" :key="result.event" class="test-result">
            <h4>{{ result.event }}</h4>
            <img
                v-if="result.thumbnail"
                :src="result.thumbnail"
                :alt="result.event"
            />
            <h4>{{ result.date }}</h4>
            <p>{{ result.extract }}</p>

        </div>
    </div>
</template>

<script lang="ts">
interface Event {
    date: string;
    event: string;
    extract: string;
    thumbnail: string;
}

const defaultQuery = 
`SELECT ?eventLabel ?date ?wikipedia_url WHERE {
    ?event wdt:P361+ wd:Q362 .
    ?event wikibase:sitelinks ?sitelinks .
    ?event wdt:P585 ?date .
    OPTIONAL { ?wikipedia_url schema:about ?event ; schema:isPartOf <https://en.wikipedia.org/> }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
}
ORDER BY DESC(?sitelinks)
LIMIT 5`;

export default {
    name: "QueryTool",
    data() {
        return {
            queryTextarea: defaultQuery,
            wikidataUrl: "https://query.wikidata.org/sparql?query=",
            wikidataFormat: "&format=json",
            wikipediaUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/",
            resultsTextarea: "",
            processedResults: [] as Event[],
        }
    },
    methods: {
        async executeQuery() {
            const wikidataResults = await this.getWikidata();
            // TODO: create a type once we figure out exactly what we need
            const wikipediaResults = await this.getWikipedia(wikidataResults);
            const processedResults = wikipediaResults?.map(result => {
                const processedResult = {
                    date: result.date.value,
                    event: result.event,
                    extract: result.extract,
                    thumbnail: result.thumbnail
                }
                return processedResult;
            }) || [];
            this.resultsTextarea = JSON.stringify(processedResults, null, 2);
            this.processedResults = processedResults;
        },
        async getWikidata() {
            const wikidataQuery = `${this.wikidataUrl}${encodeURIComponent(this.queryTextarea)}${this.wikidataFormat}`;
            try {
                const response = await fetch(wikidataQuery);
                const data = await response.json();
                const results = data.results.bindings;
                return results;
            } catch (e) {
                this.resultsTextarea = `${e}`;
            }
        },
        // TODO: create a type once we figure out exactly what we need
        async getWikipedia(results: any) {
            const promises = results.map(async (obj: any) => {
                const page = obj.wikipedia_url.value.split('/').pop();
                const wikipediaQuery = `${this.wikipediaUrl}${page}`;
                try {
                    const response = await fetch(wikipediaQuery);
                    const data = await response.json();
                    obj.thumbnail = data.thumbnail.source;
                    obj.extract = data.extract;
                    obj.event = data.title;
                    return obj;
                } catch(e) {
                    console.error(e);
                    return null;
                }
            });

            try {
                const allData = await Promise.all(promises);
                return allData.filter(data => data !== null);
            } catch(e) {
                this.resultsTextarea = `${e}`;
            }
        }
    }
}
</script>

<style scoped>
textarea {
    height: 15em;
    font-size: 1em;
    padding: .5em;
}
button {
    font-size: 1em;
    padding: .5em;
    margin: 1em 0;
}
.test-result {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1em;
    margin-bottom: 1em;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>