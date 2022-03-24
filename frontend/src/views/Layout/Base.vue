<template>
  <v-app>
    <v-main :class="isDarkMode ? '' : 'app-bg'">
      <SideBar />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import store from "@/store";

export default {
  name: "Base",
  components: {
    SideBar,
  },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
  },
};
</script>
