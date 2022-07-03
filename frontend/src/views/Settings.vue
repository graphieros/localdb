<template>
  <div>
    <h1 class="green--text text--lighten-4">Settings</h1>

    <v-container
      :class="{
        'transparent-bg settings-list px-10': isDarkMode,
        'white settings-list px-10': !isDarkMode,
      }"
    >
      <div class="setting">
        <v-switch
          :dark="isDarkMode"
          color="green"
          v-model="isLog"
          :label="
            isLogActive
              ? 'Log is active : all changes made to the record list are logged.'
              : 'Log is inactive : there will be no trace of changes made to the record list'
          "
          @click.prevent="toggleSetting('isLogActive', isLog)"
        ></v-switch>
      </div>
      <div class="setting">
        <v-switch
          :dark="isDarkMode"
          color="green"
          v-model="isDark"
          :label="
            isDarkMode
              ? 'Dark mode is on. We care for your eyes.'
              : 'Dark mode is off. At your own risks.'
          "
          @click.prevent="toggleSetting('isDarkMode', isDark)"
        ></v-switch>
      </div>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store";
import VintageIcon from "../components/VintageIcon.vue";
import FlexGauge from "../components/FlexGauge.vue";
import DraGrid from "../components/DraGrid.vue";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import CarouselBar from "../components/CarouselBar.vue";

export default Vue.extend({
  name: "Settings",
  components: {
    CarouselBar,
    DraGrid,
    FlexGauge,
    SkeletonLoader,
    VintageIcon,
  },
  data() {
    return {
      isLog: true,
      isDark: true,
      icons: {},
      isLoading: false,
      colors: ["#ff3300", "#ffae00", "#ffff00", "greenyellow", "green"],
    };
  },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    isAppLoading() {
      return store.state.isLoading;
    },
    isLogActive() {
      return store.state.settings.isLogActive;
    },
  },
  created() {
    setTimeout(() => {
      this.isDark = this.isDarkMode === true;
      this.isLog = this.isLogActive === true;
    }, 300);
  },
  methods: {
    buttonClick() {
      console.log("TEST");
    },
    toggleModal() {
      this.isOpen = !this.isOpen;
    },
    toggleSetting(setting, value) {
      store.commit("CHANGE_SETTING", {
        setting,
        value,
      });
      store.dispatch("UPDATE_SETTINGS", store.state.settings);
    },
    getIcons(icons) {
      this.icons = icons;
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  position: absolute;
  top: 15px;
  left: 80px;
  text-align: left;
}
.settings-list {
  margin: auto;
  margin-top: 80px;
  border-radius: 3px;
}
.button-showcase {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: 130px;
}
.showcase {
  margin-top: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 36px;
  margin-left: 200px;
}
</style>
