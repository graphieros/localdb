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
      <Quadrant
        axisArrows
        :showAverages="true"
        :showNames="true"
        :positive="false"
        fontFamily="Jost"
        xTitle="Some random long name"
        yTitle="Prix"
        :showLegend="true"
      />
    </div>
    <div class="mt-2">
      <Treemap :dataset="randomTreemap" :showLabels="true" :width="700"/>
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
import Treemap from "../components/Treemap.vue";

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
    Treemap
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
    randomTreemap(){
      const range = 20;
      const dataset = [];
      for(let i = 0; i < range; i += 1){
        dataset.push({
          name: `Item${i}`,
          area: Math.round(Math.random() * 100),
          color: `rgb(${Math.round(Math.random() * 200)},${Math.round(Math.random() * 200)},${Math.round(Math.random() * 200)})`
        })
      }
      return dataset;
    },
    randomDataset() {
      const range = 20;
      const dataset = [[0, 0]];
      const dataset2 = [];
      const dataset3 = [];
      for (let i = 0; i < range; i += 1) {
        const isNeg1 = Math.random() > 0.5;
        const isNeg2 = Math.random() > 0.8;
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
        const isNeg1 = Math.random() > 0.2;
        const isNeg2 = Math.random() > 0.2;
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
        const isNeg1 = Math.random() > 0.8;
        const isNeg2 = Math.random() > 0.1;
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
      return [
        {
          name: "Gamme bleue",
          series: dataset,
          color: "orange",
          radius: 3,
          shape: "star",
        },
        {
          name: "Gamme rouge",
          series: dataset2,
          color: "red",
          radius: 3,
          shape: "triangle",
        },
        {
          name: "Gamme verte",
          series: dataset3,
          color: "green",
          radius: 3,
        },
      ];
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
