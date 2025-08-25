<template>
  <header>
  </header>

  <main>
    <EventBuilder />
  </main>
</template>

<script lang="ts">
import EventBuilder from "./EventBuilder/EventBuilder.vue"

export default {
  name: "App",
  components: {
    EventBuilder,
  },
}
</script>

<style>
main {
  height: 100vh;
}
</style>
