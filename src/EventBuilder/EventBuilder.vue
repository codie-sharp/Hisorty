<template>

</template>

<script lang="ts">

interface Event {
    date: string;
    event: string;
    summary: string;
    image: string;
}

import EventCard from './components/EventCard.vue';

export default {
    name: "EventBuilder",
    components: {
        EventCard,
    },
    data() {
        return {
        }
    },
    methods: {
    }
}
</script>

<style>
button.active {
    background-color: var(--bg-highlight);
}

</style>