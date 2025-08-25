<template>
    <div class="event-card">
        <h3>{{ event.title }}</h3>
        <img v-if="event.image.length > 0" :src="event.image" :alt="event.title" />
        <p>{{ event.date }}</p>
        <p>{{ event.summary }}</p>
        <br /><a v-if="event.wikiUrl" :href="event.wikiUrl" target="_blank">Wikipedia</a>
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