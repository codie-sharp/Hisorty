<template>
    <div class="input" v-for="[key, value] in Object.entries(eventTemplate)" :key="key">
        <label>{{ key }}:</label>
        <input v-model="eventTemplate[key as keyof HistoricalEvent]" />
    </div>
    <button @click="getData()">Get Data</button>
    <EventCard :event="eventTemplate" />
</template>

<script lang="ts">
import type { HistoricalEvent } from '@/HistoricalEvent'
import EventCard from './components/EventCard.vue';

const eventTemplate: HistoricalEvent = { 
    date: '',
    title: '',
    summary: '',
    image: '',
    wikiUrl: ''
}

export default {
    name: "EventBuilder",
    components: {
        EventCard,
    },
    data() {
        return {
            eventTemplate: { 
                date: '',
                title: '',
                summary: '',
                image: '',
                wikiUrl: ''
            } as HistoricalEvent,

            wikipediaUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/",
        }
    },
    methods: {
        async getData() {
            const qId = await this.getWikipedia();

            const query = encodeURIComponent (
`SELECT ?item ?itemLabel ?property ?propertyLabel ?date WHERE {
  VALUES ?item { wd:${qId} }
  
  ?item ?prop ?date .
  ?property wikibase:directClaim ?prop .
  
  FILTER(?prop IN (
    wdt:P569, wdt:P570, wdt:P580, wdt:P582, wdt:P585,
    wdt:P571, wdt:P576, wdt:P1619, wdt:P746, wdt:P2031,
    wdt:P2032, wdt:P577
  ))
  
  FILTER(DATATYPE(?date) = xsd:dateTime || DATATYPE(?date) = xsd:date)
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
ORDER BY ?date`
            );
            
            await this.getWikidata(query);

        }, 

        async getWikipedia() {
            const page = this.eventTemplate.wikiUrl.split('/').pop();
            const wikipediaQuery = `${this.wikipediaUrl}${page}`;
            const response = await fetch(wikipediaQuery);
            const data = await response.json();
            console.log(data);

            this.eventTemplate.title = data.title;
            this.eventTemplate.summary = data.extract;
            this.eventTemplate.image = data.thumbnail.source;

            const qId = data.wikibase_item;

            return qId;
        },

        async getWikidata(query: string) {
            const response = await fetch('https://query.wikidata.org/sparql?query=' + query  + '&format=json');
            const data = await response.json();
            const results = data.results.bindings[0];
            console.log(results);

            this.eventTemplate.date = results.date.value.substring(0, 10) || ''; // 8 digit date + 2 dashes
        }
    }
}
</script>

<style>
div {
    border-radius: 1em;
    background-color: var(--bg-med);
}

.input {
    padding: 1%;
}
</style>