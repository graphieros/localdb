<template>
  <div class="component-showcase">
    <div
      :class="{
        'component-showcase__wrapper': true,
        'white--text': isDarkMode,
        'black--text': !isDarkMode,
      }"
      v-for="(compset, i) in componentSettings"
      :key="`comp_${i + step}`"
    >
      <div
        :class="{
          'component-showcase__title': true,
        }"
      >
        <h1>
          {{ compset.name }}
        </h1>
        <h4>
          {{ compset.description }}
        </h4>
      </div>
      <template>
        <div class="component-showcase__controls">
          <component
            v-for="(control, j) in compset.controls"
            :key="`control_${j}_${i}`"
            :dark="isDarkMode"
            :is="control.name"
            v-bind="control.props"
            v-model="componentProps[compset.name][control.model]"
            @change="updateComponentProps(compset)"
            @input="updateComponentProps"
          >
          </component>
        </div>
      </template>
      <div class="component-showcase__component">
        <component
          :is="compset.name"
          :dark="isDarkMode"
          v-bind="{
            ...componentProps[compset.name],
            ...componentSpex[compset.name],
          }"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store";

import { VSwitch, VSlider, VTextarea } from "vuetify/lib";
import componentsConfig from "../components/config/components.json";

import CarouselBar from "../components/CarouselBar.vue";
import ContributionGrid from "../components/ContributionGrid.vue";
import Clicker from "../components/Clicker.vue";
import FlexGauge from "../components/FlexGauge.vue";
import Quadrant from "../components/Quadrant.vue";
import Thermometer from "../components/Thermometer.vue";
import Treemap from "../components/Treemap.vue";
import WordCloud from "../components/WordCloud.vue";
import DonutEvolution from "../components/DonutEvolution.vue";
import DonutWordCloud from "../components/DonutWordCloud.vue";
import RelationCircle from "../components/RelationCircle.vue";
import RootBar from "../components/RootBar.vue";
import ScatterDonut from "../components/ScatterDonut.vue";
import SpiralDonutWordCloud from "../components/SpiralDonutWordCloud.vue";

export default Vue.extend({
  name: "ComponentShowcase",
  components: {
    CarouselBar,
    ContributionGrid,
    Clicker,
    DonutEvolution,
    DonutWordCloud,
    FlexGauge,
    Quadrant,
    RelationCircle,
    RootBar,
    ScatterDonut,
    SpiralDonutWordCloud,
    Thermometer,
    Treemap,
    WordCloud,
    VSwitch,
    VSlider,
    VTextarea,
  },
  data() {
    return {
      componentProps: {},
      componentSpex: {},
      step: 0,
    };
  },
  computed: {
    componentSettings() {
      return componentsConfig;
    },
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
  },
  methods: {
    updateComponentProps(control) {
      this.$forceUpdate();
      this.step +=1;
    },
  },
  created() {
    this.componentSettings.forEach((setting) => {
      setting.controls.forEach((control) => {
        if (!this.componentProps[setting.name]) {
          this.componentProps[setting.name] = {};
        }
        this.componentProps[setting.name][control.model] = control.default;
      });
      setting.props.forEach((prop) => {
        if (!this.componentSpex[setting.name]) {
          this.componentSpex[setting.name] = {};
        }
        this.componentSpex[setting.name] = prop;
      });
    });

    this.updateComponentProps();

    setTimeout(() => {
      this.isDark = this.isDarkMode === true;
      this.isLog = this.isLogActive === true;
    }, 300);
  },
});
</script>

<style lang="scss" scoped>
.component-showcase {
  margin-left: 100px;
  padding: 36px 0;
  width: calc(100% - 150px);
  display: block;
  &__component {
    margin: 0 auto;
    padding: 12px 0;
    div {
      margin: 0 auto;
    }
  }
  &__controls {
    align-items: center;
    column-gap: 36px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    div {
      min-width: 200px;
    }
  }
  &__title {
    h4 {
      text-align: left;
      margin: 24px 0 48px 0;
    }
  }
  &__wrapper {
    margin: 36px 0;
    width: 100%;
    border: 1px solid rgba(128, 128, 128, 0.493);
    padding: 36px;
    border-radius: 12px;
    box-shadow: 0 3px 12px 0px rgba(0, 0, 0, 0.1);
  }
}
</style>
