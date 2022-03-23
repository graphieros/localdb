<template>
  <v-app>
    <v-main>
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
    isLogActive() {
      return store.state.settings.isLogActive;
    },
  },
};
</script>
