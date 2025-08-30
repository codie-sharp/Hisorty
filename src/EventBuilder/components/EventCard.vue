<template>
    <div class="event-card">
        <h3>{{ event.title }}</h3>
        <img :src="event.image" :alt="event.title" />
        <p>{{ event.dates }}</p>
        <p>{{ event.summary }}</p>
        <br /><a :href="event.wikiUrl" target="_blank">Wikipedia</a>
    </div>
</template>

<script lang="ts">
import type { HistoricalEvent } from '@/HistoricalEvent';

export default {
    name: "EventCard",
    props: {
        event:{
            type: Object as () => HistoricalEvent,
            required: true
        }
    }
}
</script>

<style>

</style>