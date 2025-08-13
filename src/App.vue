<template>
  <header>
  </header>

  <main>
    <QueryTool />
  </main>
</template>

<script lang="ts">
import QueryTool from "./components/QueryTool.vue"

export default {
  name: "App",
  components: {
    QueryTool,
  },
}

</script>

<style scoped>
main {
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 100%;
  padding: 5%;
}
</style>
