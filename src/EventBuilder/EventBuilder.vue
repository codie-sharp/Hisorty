<template>
    <div id="component-container">
        <div id="top-container">
            <div id="left-container">
                <div>
                    <label for="date">Date:</label>
                    <input id="date" v-model="eventTemplate.date" />
                </div>
                <div>
                    <label for="title">Title:</label>
                    <input id="title" v-model="eventTemplate.title" />
                </div>
                <div>
                    <label for="image">Image:</label>
                    <input id="image" v-model="eventTemplate.image" />
                </div>
                <div>
                    <label for="wikiUrl">Wiki:</label>
                    <button @click="getData()">Get Data</button>
                    <input id="wikiUrl" v-model="eventTemplate.wikiUrl" />
                </div>
            </div>
            <div id="middle-container" />
            <div id="right-container">
                <label for="summary">Summary:</label>
                <textarea id="summary" v-model="eventTemplate.summary"></textarea>
            </div>
        </div>
        <div id="bottom-container">
            <EventCard :event="eventTemplate" />
        </div>
        <div>
            <button @click="saveEvent()">Save Event</button>
            <button @click="downloadEvents()">Download Events</button>
        </div>
    </div>
</template>

<script lang="ts">
import type { HistoricalEvent } from '@/HistoricalEvent'
import EventCard from './components/EventCard.vue';

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
                wikiUrl: 'https://en.wikipedia.org/wiki/Ludwig_van_Beethoven'
            } as HistoricalEvent,
            allEvents: [] as HistoricalEvent[],
            wikipediaUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/",
        }
    },

    async mounted() {
        const response = await fetch('/events.json');
        this.allEvents = await response.json();
        console.log("Default Events: ", this.allEvents);
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
            console.log("Wikipedia: ", data);

            this.eventTemplate.title = data.title;
            this.eventTemplate.summary = data.extract;
            this.eventTemplate.image = data.thumbnail.source;

            const qId = data.wikibase_item;

            return qId;
        },

        async getWikidata(query: string) {
            const response = await fetch('https://query.wikidata.org/sparql?query=' + query  + '&format=json');
            const data = await response.json();
            const results = data.results.bindings;
            console.log("Wikidata: ", results);

            const middleContainer = document.getElementById('middle-container');
            middleContainer!.innerHTML = '';
            
            if (results.length > 0) {
                this.eventTemplate.date = results[0].date.value.substring(0, 10) || '';
                
                results.forEach((result: any) => {
                    const date = result.date.value.substring(0, 10);

                    const containerDiv = document.createElement('div');
                    const label = document.createElement('label');
                    label.textContent = result.propertyLabel.value;

                    const input = document.createElement('input');
                    input.value = date;

                    const button = document.createElement('button');
                    button.textContent = "Change Date";
                    button.addEventListener('click', () => {
                        this.eventTemplate.date = date;
                    });

                    containerDiv.appendChild(label);
                    containerDiv.appendChild(button);
                    containerDiv.appendChild(input);
                    middleContainer!.appendChild(containerDiv);
                });
            }
        },

        saveEvent() {
            this.allEvents.push({ ...this.eventTemplate }); // save new obj with same properties
            console.log(this.allEvents);
        },

        downloadEvents() {
            const data = JSON.stringify(this.allEvents, null, 2);
            const dataBlob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'events.json';
            a.click();

            URL.revokeObjectURL(url);
        },
    }
}
</script>

<style>
#component-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#top-container {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0.5%;
    padding: 0.5%;
    border-radius: 1em;
    background-color: var(--bg-med);
}

#left-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0.5%;
}

#left-container * {
    flex: 1;
    padding: 1%;
}

#middle-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0.5%;
}

#middle-container * {
    flex: 1;
    padding: 1%;
}

#right-container {
    flex: 2;
    display: flex;
    flex-direction: column;
    margin: 0.5%;
}

#right-container textarea {
    flex: 1;
    padding: 1%;
}

#bottom-container {
    flex: 1;
    margin: 0.5%;
    padding: 0.5%;
    background-color: var(--bg-med);
    border-radius: 1em;
}

input {
    width: 100%;
}

</style>