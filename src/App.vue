<template>
  <header>
  </header>

  <main>
    <QueryTool />
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
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 100%;
  padding: 2%;
}

</style>
