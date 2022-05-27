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
        <br />
        <v-btn
          :dark="isDarkMode"
          outlined
          class="my-2"
          @click="showGaugeCode = !showGaugeCode"
          ><v-icon class="mr-1">{{
            showGaugeCode ? "mdi-eye-off" : "mdi-eye"
          }}</v-icon
          >{{ showGaugeCode ? "Hide" : "Show" }} code</v-btn
        >
        <br />
        <code v-if="showGaugeCode">
          {{ gaugeText }}
        </code>
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
          customRange
          :range="[-100, 100]"
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
          :min="thermoBase10 ? -10 : -100"
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

    <v-card
      :class="{ components__item: true, 'components__item--dark': isDarkMode }"
    >
      <div
        :class="{
          components__item__description: true,
          'components__item__description--dark': isDarkMode,
        }"
      >
        <h2 class="components__item__description__title">Native Dialog</h2>
        A Vue wrapper around the native Dialog Html element, that is now
        supported by all browsers.
      </div>
      <div
        class="components__item__example"
        height="400"
        width="400"
        style="position: relative"
      >
        <v-btn v-if="!isDialogOpen" @click="isDialogOpen = !isDialogOpen"
          >Open dialog</v-btn
        >
        <Modal
          @close="isDialogOpen = false"
          :backgroundColor="dialogBackgroundColor"
          :borderColor="dialogBorderColor"
          :borderRadius="`${dialogBorderRadius}px`"
          :borderWidth="`${dialogBorderWidth}px`"
          :buttonColor="closeButtonColor"
          :fullScreen="dialogFullScreen"
          :height="`${dialogHeight}px`"
          :hideCloseButton="dialogHideClose"
          :iconColor="dialogIconColor"
          :open="isDialogOpen"
          :title="dialogTitle"
          :width="`${dialogWidth}px`"
        >
          <div>
            I'm highly customizable. I can also close if you press
            <b>escape</b>, or if you click <b>outside</b> my body. And since I'm
            built with a native HTML element, I respect
            <b>accessibility</b> requirements.
            <v-btn class="mt-12" @click="isDialogOpen = false">CLOSE ME</v-btn>
          </div>
        </Modal>
      </div>
      <div
        :class="{
          components__item__controls: true,
          'components__item__controls--dark': isDarkMode,
        }"
      >
        <h2 class="components__item__controls__title">Controls</h2>
        <v-text-field
          clearable
          :dark="isDarkMode"
          v-model="dialogTitle"
          label="Change title"
          class="mb-5"
        ></v-text-field>
        <v-slider
          v-if="!dialogFullScreen"
          v-model="dialogHeight"
          thumb-color="grey"
          :min="100"
          :max="1000"
          thumb-label="always"
          label="height"
          :dark="isDarkMode"
        />
        <v-slider
          v-if="!dialogFullScreen"
          v-model="dialogWidth"
          thumb-color="grey"
          :min="100"
          :max="1000"
          thumb-label="always"
          label="width"
          :dark="isDarkMode"
        />
        <v-slider
          v-model="dialogBorderRadius"
          thumb-color="grey"
          :min="0"
          :max="24"
          thumb-label="always"
          label="border radius"
          :dark="isDarkMode"
        />
        <v-slider
          v-model="dialogBorderWidth"
          thumb-color="grey"
          :min="0"
          :max="12"
          thumb-label="always"
          label="border width"
          :dark="isDarkMode"
        />
        <v-switch
          :dark="isDarkMode"
          v-model="dialogFullScreen"
          :label="dialogFullScreen ? 'fullscreen' : 'not fullscreen'"
        ></v-switch>
        <v-switch
          class="mt-n4"
          :dark="isDarkMode"
          v-model="dialogHideClose"
          :label="dialogHideClose ? 'hide close button' : 'show close button'"
        ></v-switch>
        <div style="text-align: left; width: 100%" class="mb-3">
          Close button color:
          <v-btn
            outlined
            :dark="isDarkMode"
            x-small
            @click="showCloseButtonColorPicker = !showCloseButtonColorPicker"
          >
            {{ showCloseButtonColorPicker ? "Hide" : "Show" }} color picker
          </v-btn>
        </div>
        <v-color-picker
          v-if="showCloseButtonColorPicker"
          :dark="isDarkMode"
          dot-size="25"
          swatches-max-height="200"
          v-model="closeButtonColor"
        ></v-color-picker>

        <div style="text-align: left; width: 100%" class="mb-3">
          Close button icon color:
          <v-btn
            outlined
            :dark="isDarkMode"
            x-small
            @click="showIconColorPicker = !showIconColorPicker"
          >
            {{ showIconColorPicker ? "Hide" : "Show" }} color picker
          </v-btn>
        </div>
        <v-color-picker
          v-if="showIconColorPicker"
          :dark="isDarkMode"
          dot-size="25"
          swatches-max-height="200"
          v-model="dialogIconColor"
        ></v-color-picker>

        <div style="text-align: left; width: 100%" class="mb-3">
          Dialog background color:
          <v-btn
            outlined
            :dark="isDarkMode"
            x-small
            @click="showDialogColorPicker = !showDialogColorPicker"
          >
            {{ showDialogColorPicker ? "Hide" : "Show" }} color picker
          </v-btn>
        </div>
        <v-color-picker
          v-if="showDialogColorPicker"
          :dark="isDarkMode"
          dot-size="25"
          swatches-max-height="200"
          v-model="dialogBackgroundColor"
        ></v-color-picker>

        <div
          v-if="dialogBorderWidth > 0"
          style="text-align: left; width: 100%"
          class="mb-3"
        >
          Dialog border color:
          <v-btn
            outlined
            :dark="isDarkMode"
            x-small
            @click="showDialogBorderColorPicker = !showDialogBorderColorPicker"
          >
            {{ showDialogBorderColorPicker ? "Hide" : "Show" }} color picker
          </v-btn>
        </div>
        <v-color-picker
          v-if="showDialogBorderColorPicker"
          :dark="isDarkMode"
          dot-size="25"
          swatches-max-height="200"
          v-model="dialogBorderColor"
        ></v-color-picker>
      </div>
    </v-card>
  </div>
</template>

<script>
import GaugeBar from "../components/GaugeBar.vue";
import GaugeCanvas from "../components/GaugeCanvas.vue";
import Modal from "../components/Modal.vue";
import store from "../store";

import Vue from "vue";
export default Vue.extend({
  name: "Components",
  components: { GaugeBar, GaugeCanvas, Modal },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    gaugeText() {
      return `<GaugeCanvas
          :acceleration="${this.gaugeSpeed}"
          :size="${this.gaugeSize}"
          animated
          animationSpeed="2"
          :base10="${this.gaugeBase10}"
          :base100="${!this.gaugeBase10}"
          :showRefreshButton="${this.gaugeShowRefresh}"
          :hideMeasures="${this.gaugeHideMeasures}"
          :dark="${this.isDarkMode}"
          darkColor="#18192C"
          :colors="${this.gaugeColorsAll}"
          :msBeforeMount="0"
          :range="[10, 10, 10, 10, 10, 10, 10, 10, 10, 10]"
          :score="${this.gaugeScore}"
        />`;
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
      showGaugeCode: false,
      thermoScore: 10,
      thermoSize: "400",
      thermoShowRefresh: true,
      thermoSpeed: 0.12,
      thermoBase10: true,
      thermoStep: 0,
      isDialogOpen: false,
      dialogTitle: "I am native",
      dialogHeight: 300,
      dialogWidth: 400,
      dialogFullScreen: false,
      closeButtonColor: "#FF5252",
      dialogBackgroundColor: "#FFFFFF",
      showCloseButtonColorPicker: false,
      showDialogColorPicker: false,
      dialogHideClose: false,
      dialogIconColor: "#000",
      showIconColorPicker: false,
      dialogBorderRadius: 8,
      dialogBorderWidth: 0,
      dialogBorderColor: "#FFFFFF",
      showDialogBorderColorPicker: false,
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
