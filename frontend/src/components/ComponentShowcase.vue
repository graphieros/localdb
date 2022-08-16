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
          <svg style="width:32px;height:32px; margin-bottom:-4px" viewBox="0 0 24 24">
              <path fill="#4CAF50" d="M17,22V20H20V17H22V20.5C22,20.89 21.84,21.24 21.54,21.54C21.24,21.84 20.89,22 20.5,22H17M7,22H3.5C3.11,22 2.76,21.84 2.46,21.54C2.16,21.24 2,20.89 2,20.5V17H4V20H7V22M17,2H20.5C20.89,2 21.24,2.16 21.54,2.46C21.84,2.76 22,3.11 22,3.5V7H20V4H17V2M7,2V4H4V7H2V3.5C2,3.11 2.16,2.76 2.46,2.46C2.76,2.16 3.11,2 3.5,2H7M13,17.25L17,14.95V10.36L13,12.66V17.25M12,10.92L16,8.63L12,6.28L8,8.63L12,10.92M7,14.95L11,17.25V12.66L7,10.36V14.95M18.23,7.59C18.73,7.91 19,8.34 19,8.91V15.23C19,15.8 18.73,16.23 18.23,16.55L12.75,19.73C12.25,20.05 11.75,20.05 11.25,19.73L5.77,16.55C5.27,16.23 5,15.8 5,15.23V8.91C5,8.34 5.27,7.91 5.77,7.59L11.25,4.41C11.5,4.28 11.75,4.22 12,4.22C12.25,4.22 12.5,4.28 12.75,4.41L18.23,7.59Z" />
          </svg>
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
