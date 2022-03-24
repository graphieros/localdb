<template>
  <router-view />
</template>

<script>
import store from "@/store";

export default {
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
