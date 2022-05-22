<template>
  <div class="components">
    <h1 class="components__title green--text text--lighten-4">Components</h1>
    <v-card
      :class="{ components__item: true, 'components__item--dark': isDarkMode }"
    >
      <div
        :class="{
          components__item__description: true,
          'components__item__description--dark': isDarkMode,
        }"
      >
        <h2 class="components__item__description__title">Speedometer gauge</h2>
        This classic component is often used by managers to evaluate weird key
        performance indicators. For some obscure reason, managers like to have
        this component added to their dahsboards. Not all chart libraries
        provide a nice Speedometer component, so I decided to make one in Vue.
      </div>
      <div class="components__item__example">
        <GaugeCanvas
          :acceleration="gaugeSpeed"
          :size="gaugeSize"
          animated
          animationSpeed="2"
          :base10="gaugeBase10"
          :base100="!gaugeBase10"
          :showRefreshButton="gaugeShowRefresh"
          :hideMeasures="gaugeHideMeasures"
          :dark="isDarkMode"
          darkColor="#18192C"
          :colors="gaugeColorsAll"
          :msBeforeMount="0"
          :range="[10, 10, 10, 10, 10, 10, 10, 10, 10, 10]"
          :score="gaugeScore"
          :tooltipHtml="`<div class='custom-tooltip-wrapper'>Score: <strong>${gaugeScore}</strong></div>`"
        />
      </div>
      <div
        :class="{
          components__item__controls: true,
          'components__item__controls--dark': isDarkMode,
        }"
      >
        <h2 class="components__item__controls__title">Controls</h2>
        <v-slider
          v-model="gaugeScore"
          thumb-color="grey"
          :min="gaugeBase10 ? 0 : -100"
          :max="gaugeBase10 ? 10 : 100"
          thumb-label="always"
          label="score"
          :dark="isDarkMode"
        />
        <v-slider
          v-model="gaugeSpeed"
          thumb-color="grey"
          :min="0.0001"
          :max="0.5"
          step="0.0001"
          thumb-label="always"
          label="speed"
          :dark="isDarkMode"
        />
        <v-slider
          v-model="gaugeSize"
          thumb-color="grey"
          :min="50"
          :max="400"
          label="size"
          :dark="isDarkMode"
        />
        <v-switch
          :dark="isDarkMode"
          v-model="gaugeShowRefresh"
          :label="
            gaugeShowRefresh
              ? 'refresh button visible'
              : 'refresh button hidden'
          "
          class="mb-n5"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="gaugeBase10"
          :label="gaugeBase10 ? 'range 0 to 10' : 'range -100 to 100'"
          class="mb-n5"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="gaugeHideMeasures"
          :label="gaugeHideMeasures ? 'measures hidden' : 'measures visible'"
        ></v-switch>
      </div>
    </v-card>

    <v-card
      :class="{ components__item: true, 'components__item--dark': isDarkMode }"
    >
      <div
        :class="{
          components__item__description: true,
          'components__item__description--dark': isDarkMode,
        }"
      >
        <h2 class="components__item__description__title">Thermometer gauge</h2>
        This component works basically in the same way as the Speedometer gauge.
        It just fits better on a dashboard which requires less space.
      </div>
      <div
        class="components__item__example"
        height="400"
        width="400"
        style="position: relative"
      >
        <GaugeBar
          animated
          colorMeasures
          :showRefreshButton="thermoShowRefresh"
          :acceleration="thermoSpeed"
          :score="thermoBase10 ? thermoScore * 10 : thermoScore"
          :dark="isDarkMode"
          :base10="thermoBase10"
          :height="thermoSize"
          :key="thermoStep"
        />
      </div>
      <div
        :class="{
          components__item__controls: true,
          'components__item__controls--dark': isDarkMode,
        }"
      >
        <h2 class="components__item__controls__title">Controls</h2>
        <v-slider
          v-model="thermoScore"
          thumb-color="grey"
          :min="0"
          :max="thermoBase10 ? 10 : 100"
          thumb-label="always"
          label="score"
          :dark="isDarkMode"
          @change="thermoStep += 1"
        />
        <v-slider
          v-model="thermoSpeed"
          thumb-color="grey"
          :min="0.0001"
          :max="0.5"
          step="0.0001"
          thumb-label="always"
          label="speed"
          :dark="isDarkMode"
          @change="thermoStep += 1"
        />
        <v-slider
          v-model="thermoSize"
          thumb-color="grey"
          :min="50"
          :max="400"
          label="size"
          :dark="isDarkMode"
          @change="thermoStep += 1"
        />
        <v-switch
          :dark="isDarkMode"
          v-model="thermoShowRefresh"
          :label="
            thermoShowRefresh
              ? 'refresh button visible'
              : 'refresh button hidden'
          "
          class="mb-n5"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="thermoBase10"
          :label="thermoBase10 ? 'range 0 to 10' : 'range 0 to 100'"
          class="mb-n5"
          @change="thermoStep += 1"
        ></v-switch>
      </div>
    </v-card>
  </div>
</template>

<script>
import GaugeBar from "../components/GaugeBar.vue";
import GaugeCanvas from "../components/GaugeCanvas.vue";
import store from "../store";

import Vue from "vue";
export default Vue.extend({
  name: "Components",
  components: { GaugeBar, GaugeCanvas },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
  },
  data() {
    return {
      gaugeColorsAll: [
        "red",
        "#ff3300",
        "#ff6600",
        "#ff9933",
        "#ffae00",
        "#ffcc00",
        "#ffff00",
        "#ccff33",
        "greenyellow",
        "#5cd65c",
        "#33cc69",
        "#33cc9e",
        "#33ccc9",
        "#33b3cc",
        "#33a6cc",
        "#3399cc",
        "#338acc",
        "#337dcc",
        "#3375cc",
        "#3366cc",
      ],
      gaugeScore: 10,
      gaugeSize: "300",
      gaugeShowRefresh: true,
      gaugeBase10: true,
      gaugeSpeed: 0.01,
      gaugeHideMeasures: false,
      thermoScore: 10,
      thermoSize: "400",
      thermoShowRefresh: true,
      thermoSpeed: 0.12,
      thermoBase10: true,
      thermoStep: 0,
    };
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.components {
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 36px;
    margin: 76px 36px 0 90px;
    padding: 36px;
    &--dark {
      background: transparent;
    }
    &__description {
      width: 30%;
    }
    &__example {
      width: 40%;
    }
    &__controls {
      width: 30%;
      &__title {
        margin-bottom: 36px;
        width: 100%;
        text-align: left;
      }
      &--dark {
        color: white;
      }
    }

    &__description {
      &__title {
        margin-bottom: 12px;
      }
    }
    &__example {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__description {
      text-align: left;
      &--dark {
        color: lightgrey;
      }
    }
  }
  &__title {
    left: 80px;
    position: absolute;
    text-align: left;
    top: 15px;
  }
}
</style>
