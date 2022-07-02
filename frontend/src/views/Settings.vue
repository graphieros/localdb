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

    <div class="showcase white--text">
      <!-- <FlexGauge
        :range="[25, 25, 25, 25]"
        animated
        :score="3"
        :min="1"
        :max="5"
        :colors="colors"
        :showRefreshButton="true"
        :acceleration="0.05"
      /> -->
      <!-- <SkeletonLoader
        height="150px"
        width="150px"
        circle
        donut
        :hollowColor="isDarkMode ? '#0c0d20' : 'white'"
      />
      <SkeletonLoader quantity="5" height="20px" width="300px" col gap="0px" /> -->
    </div>
    <!-- <DraGrid /> -->
    <div
      style="
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        height: 200px;
        margin: 0 auto;
        width: calc(100% - 200px);
      "
    >
      <CarouselBar
        borderRadius="12px"
        :chevronColor="isDarkMode ? '#4CAF50' : '#4CAF50'"
        chevronSize="40px"
        height="150px"
      >
        <div v-for="(el, i) in 100" :key="i">Some content {{ i }}</div>
      </CarouselBar>
    </div>
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
  components: { CarouselBar, DraGrid, FlexGauge, SkeletonLoader, VintageIcon },
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
