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
    <div
      style="
        display: flex;
        width: 50%;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      "
    >
      <!-- <Thermometer
        :range="[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]"
        :score="50"
        :min="-100"
        :max="100"
        animated
        tooltipHtml="Score: 3"
        :showRefreshButton="true"
        :dark="isDarkMode"
      /> -->
      <!-- <SimpleThermometer
        :dataset="archived"
        :color="'green'"
        :gradient="false"
      /> -->
      <Quadrant :datasets="randomDataset" xTitle="Qualité" yTitle="Prix"/>
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
import Thermometer from "../components/Thermometer.vue";
import SimpleThermometer from "../components/SimpleThermometer.vue";
import WordCloud2 from "../components/WordCloud2.vue";
import Quadrant from "../components/Quadrant.vue";

export default Vue.extend({
  name: "Settings",
  components: {
    CarouselBar,
    DraGrid,
    FlexGauge,
    SimpleThermometer,
    SkeletonLoader,
    Thermometer,
    VintageIcon,
    WordCloud2,
    Quadrant,
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
    archive() {
      const logs = store.state.storedCategories.find(
        (cat) => cat.name === "DONE"
      );
      const base = logs ? logs.items.length : 1;
      const done = logs ? logs.items.filter((log) => log.archived).length : 0;
      const ratio = (done / base) * 100;
      return {
        base,
        done,
        ratio,
      };
    },
     randomDataset() {
      const range = 10;
      const dataset = [[0, 0]];
      const dataset2 = [];
      const dataset3 = [];
      for (let i = 0; i < range; i += 1) {
        const isNeg1 = Math.random() > 0.5;
        const isNeg2 = Math.random() > 0.5;
        let x = Math.round(Math.random() * 100);
        let y = Math.round(Math.random() * 100);
        if (isNeg1) {
          x = -x;
        }
        if (isNeg2) {
          y = -y;
        }
        dataset.push([x, y]);
      }
      for (let i = 0; i < range; i += 1) {
        const isNeg1 = Math.random() > 0.5;
        const isNeg2 = Math.random() > 0.5;
        let x = Math.round(Math.random() * 100);
        let y = Math.round(Math.random() * 100);
        if (isNeg1) {
          x = -x;
        }
        if (isNeg2) {
          y = -y;
        }
        dataset2.push([x, y]);
      }
      for (let i = 0; i < range; i += 1) {
        const isNeg1 = Math.random() > 0.5;
        const isNeg2 = Math.random() > 0.5;
        let x = Math.round(Math.random() * 100);
        let y = Math.round(Math.random() * 100);
        if (isNeg1) {
          x = -x;
        }
        if (isNeg2) {
          y = -y;
        }
        dataset3.push([x, y]);
      }
      return [{
        name: "Gamme bleue",
        series: dataset,
        color: "blue",
        radius: 2
      },{
        name: "Gamme rouge",
        series: dataset2,
        color: "red",
        radius: 2
      },{
        name: "Gamme verte",
        series: dataset3,
        color: "green",
        radius: 2
      }];
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
