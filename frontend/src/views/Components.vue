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
          'components__item__description--column--narrow': true,
        }"
      >
        <h2 class="components__item__description__title">
          <VintageIcon
            icon="sun"
            rem="1.6"
            :color="isDarkMode ? 'white' : 'black'"
            @getIcons="(e) => getIcons(e)"
            ><span class="ml-2">Vintage Icons</span></VintageIcon
          >
        </h2>
        The full power of HTML entitites. @getIcons method exposes the icons
        list to the parent in which the component is placed.
        <v-slider
          v-model="iconRotate"
          thumb-color="grey"
          :min="0"
          :max="360"
          thumb-label="always"
          label="rotation in deg"
          :dark="isDarkMode"
          class="mt-10"
        />
        <v-slider
          v-model="iconSize"
          thumb-color="grey"
          :min="0.1"
          :max="10"
          thumb-label="always"
          label="size in rem"
          :dark="isDarkMode"
          class="mt-5"
        />
        <v-switch
          class="mt-n4"
          :dark="isDarkMode"
          v-model="iconShadow"
          :label="iconShadow ? 'shadowed' : 'flat'"
        ></v-switch>
        <v-select
          :dark="isDarkMode"
          v-model="selectedIcon"
          :items="icons"
          item-text="name"
          return-object
        ></v-select>
        <v-card class="pa-5">
          <v-card-title>
            <VintageIcon
              :rotation="iconRotate"
              :icon="selectedIcon.name"
              :rem="iconSize"
              color="black"
              :shadow="iconShadow"
              ><span class="ml-2">{{ selectedIcon.name }}</span></VintageIcon
            >
          </v-card-title>
          <v-btn fab
            ><VintageIcon
              :rotation="iconRotate"
              :icon="selectedIcon.name"
              :rem="iconSize"
              :shadow="iconShadow"
              color="black"
          /></v-btn>
          <v-btn class="ml-4"
            ><VintageIcon
              :rotation="iconRotate"
              class="mt-n1"
              :icon="selectedIcon.name"
              :rem="iconSize"
              :shadow="iconShadow"
              color="white"
            />{{ selectedIcon.name }}</v-btn
          >
        </v-card>
      </div>
    </v-card>

    <v-card
      :class="{ components__item: true, 'components__item--dark': isDarkMode }"
    >
      <div
        :class="{
          components__item__description: true,
          'components__item__description--dark': isDarkMode,
          'components__item__description--column': true,
        }"
      >
        <h2 class="components__item__description__title">Contribution Grid</h2>
        Remember Github's contribution chart ?

        <h4 class="mt-7">Controls</h4>
        <div class="components__item__actions--horizontal mt-7">
          <v-switch
            class="mt-n4"
            :dark="isDarkMode"
            v-model="showContributionGridLegend"
            :label="
              showContributionGridLegend ? 'color legend' : 'no color legend'
            "
          ></v-switch>
          <v-switch
            class="mt-n4"
            :dark="isDarkMode"
            v-model="showContributionGridTooltip"
            :label="showContributionGridTooltip ? 'tooltip' : 'no tooltip'"
          ></v-switch>
          <v-switch
            class="mt-n4"
            :dark="isDarkMode"
            v-model="showContributionGridOutlined"
            :label="showContributionGridOutlined ? 'not outlined' : 'outlined'"
          ></v-switch>
          <v-switch
            class="mt-n4"
            :dark="isDarkMode"
            v-model="showContributionGridLegendX"
            :label="
              showContributionGridLegendX
                ? 'X legend visible'
                : 'X legend hidden'
            "
          ></v-switch>
          <v-switch
            class="mt-n4"
            :dark="isDarkMode"
            v-model="showContributionGridLegendY"
            :label="
              showContributionGridLegendY
                ? 'Y legend visible'
                : 'Y legend hidden'
            "
          ></v-switch>
          <v-switch
            class="mt-n4"
            :dark="isDarkMode"
            v-model="showContributionGridToday"
            :label="
              showContributionGridToday
                ? 'highlight current day'
                : 'hide current day'
            "
          ></v-switch>
          <v-switch
            class="mt-n4"
            :dark="isDarkMode"
            v-model="contributionGridRounded"
            :label="
              contributionGridRounded ? 'rounded squares' : 'perfect squares'
            "
          ></v-switch>
        </div>

        <div style="width: 100%; margin-top: 36px">
          <ContributionGrid
            :dark="isDarkMode"
            :dataset="contributionGridDataset"
            :hideLegend="!showContributionGridLegend"
            :hideTooltip="!showContributionGridTooltip"
            :hideXLegend="!showContributionGridLegendX"
            :hideYLegend="!showContributionGridLegendY"
            :outlined="showContributionGridOutlined"
            :showToday="showContributionGridToday"
            :rounded="contributionGridRounded"
            style="width: 100%"
            test
          />
        </div>
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
        <FlexGauge
          :acceleration="gaugeSpeed"
          :min="gaugeMin"
          :max="gaugeMax"
          :colors="gaugeColorsAll"
          :dark="isDarkMode"
          :hideMeasures="gaugeHideMeasures"
          :msBeforeMount="0"
          :range="[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]"
          :score="gaugeScore"
          :size="gaugeSize"
          :tooltipHtml="`<div class='custom-tooltip-wrapper'>Score: <strong>${gaugeScore}</strong></div>`"
          animated
          animationSpeed="2"
          darkColor="#18192C"
          :key="gaugeKey"
          :gradient="gaugeGradient"
          :colorStart="gaugeColorStart"
          :colorEnd="gaugeColorEnd"
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
          :min="-100"
          :max="100"
          thumb-label="always"
          label="score"
          :dark="isDarkMode"
        />
        <v-slider
          v-model="gaugeMin"
          thumb-color="grey"
          :min="-100"
          :max="1"
          thumb-label="always"
          label="min"
          :dark="isDarkMode"
        />
        <v-slider
          v-model="gaugeMax"
          thumb-color="grey"
          :min="5"
          :max="100"
          thumb-label="always"
          label="max"
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
          v-model="gaugeGradient"
          :label="gaugeGradient ? 'gradient colors' : 'color set'"
        ></v-switch>

        <v-color-picker
          v-if="gaugeGradient"
          :dark="isDarkMode"
          dot-size="25"
          swatches-max-height="200"
          v-model="gaugeColorStart"
        ></v-color-picker>
        <v-color-picker
          v-if="gaugeGradient"
          :dark="isDarkMode"
          dot-size="25"
          swatches-max-height="200"
          v-model="gaugeColorEnd"
        ></v-color-picker>

        <v-switch
          :dark="isDarkMode"
          v-model="gaugeHideMeasures"
          :label="gaugeHideMeasures ? 'measures hidden' : 'measures visible'"
        ></v-switch>
        <Clicker
          background="#4CAF50"
          textColor="white"
          reflection
          rounded
          @click="gaugeKey += 1"
        >
          play animation
        </Clicker>
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
        It fits in narrow spaces.
      </div>
      <div
        class="components__item__example"
        height="400"
        width="400"
        style="position: relative"
      >
        <Thermometer
          animated
          :base100="!thermoBase10"
          :base10="thermoBase10"
          :colors="gaugeColorsAll"
          :dark="isDarkMode"
          :hideMeasures="thermoHideMeasures"
          :range="[10, 10, 10, 10, 10, 10, 10, 10, 10, 10]"
          :score="thermoScore"
          :size="thermoSize"
          :tooltipHtml="`Score: ${thermoScore}`"
          darkColor="#18192C"
          :key="thermoKey"
          :speed="thermoSpeed"
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
          :min="thermoBase10 ? 0 : -100"
          :max="thermoBase10 ? 10 : 100"
          thumb-label="always"
          label="score"
          :dark="isDarkMode"
          @change="thermoKey += 1"
          @click="thermoKey += 1"
        />
        <v-slider
          v-model="thermoSpeed"
          thumb-color="grey"
          :min="1"
          :max="10"
          step="0.0001"
          thumb-label="always"
          label="speed"
          :dark="isDarkMode"
          @change="thermoKey += 1"
        />
        <v-slider
          v-model="thermoSize"
          thumb-color="grey"
          :min="200"
          :max="500"
          label="size"
          :dark="isDarkMode"
          @change="thermoKey += 1"
        />
        <v-switch
          :dark="isDarkMode"
          v-model="thermoBase10"
          :label="thermoBase10 ? 'range 0 to 10' : 'range 0 to 100'"
          class="mb-n5"
          @change="thermoStep += 1"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="thermoHideMeasures"
          :label="thermoHideMeasures ? 'measures hidden' : 'measures visible'"
        ></v-switch>
        <Clicker
          background="#4CAF50"
          textColor="white"
          reflection
          rounded
          @click="thermoKey += 1"
        >
          play animation
        </Clicker>
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
        <Clicker
          v-if="!isDialogOpen"
          @click="isDialogOpen = !isDialogOpen"
          fab
          x-large
          background="#4CAF50"
          reflection
          textColor="white"
          bold
          :reflectionIntensity="0.5"
          massive
        >
          ?
        </Clicker>

        <Modal
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
          @close="isDialogOpen = false"
        >
          <div>
            I'm highly customizable. I can also close if you press
            <b>escape</b>, or if you click <b>outside</b> my body. And since I'm
            built with a native HTML element, I respect
            <b>accessibility</b> requirements.
            <Clicker
              absolute
              bottom
              @click="isDialogOpen = false"
              background="#4CAF50"
              reflection
              textColor="white"
              style="bottom: 32px"
            >
              Close
            </Clicker>
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
          <Buzzer
            @click="showIconColorPicker = !showIconColorPicker"
            borderRadius="6"
            class="mt-5"
            color="#ccc"
            outlined
            textColor="#ccc"
            uppercase
            x-small
            >{{ showIconColorPicker ? "Hide" : "Show" }} color picker</Buzzer
          >
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

    <v-card
      :class="{ components__item: true, 'components__item--dark': isDarkMode }"
    >
      <div
        :class="{
          components__item__description: true,
          'components__item__description--dark': isDarkMode,
        }"
      >
        <h2 class="components__item__description__title">Native Button</h2>
        A Vue wrapper around the native html Button element.
      </div>
      <div
        class="components__item__example"
        width="400"
        style="position: relative; height: 200px; border: 1px dashed grey"
      >
        <Clicker
          @click="clickerLoading = !clickerLoading"
          :absolute="clickerAbsolute"
          :background="clickerBackground"
          :bold="clickerBold"
          :bottom="clickerBottom"
          :disabled="clickerDisabled"
          :extended="clickerExtended"
          :fab="clickerFab"
          :flat="clickerFlat"
          :key="`clicker_${clickerStep}`"
          :large="clickerLarge"
          :left="clickerLeft"
          :loading="clickerLoading"
          :outlined="clickerOutlined"
          :reflection="clickerReflection"
          :reflectionIntensity="clickerReflectionIntensity"
          :right="clickerRight"
          :rounded="clickerRounded"
          :small="clickerSmall"
          :textColor="clickerColor"
          :tooltipHtml="clickerTooltip ? 'This is a tooltip' : ''"
          :top="clickerTop"
          :uppercase="clickerUppercase"
          :xLarge="clickerXLarge"
          :xSmall="clickerXSmall"
        >
          {{ clickerFab ? "!" : "Click" }}
        </Clicker>
      </div>
      <div
        :class="{
          components__item__controls: true,
          'components__item__controls--dark': isDarkMode,
          'components__item__controls--scroll': true,
        }"
      >
        <h2 class="components__item__controls__title">Controls</h2>

        <div class="components__checkboxes mt-n6">
          <v-checkbox
            :dark="isDarkMode"
            v-model="clickerXSmall"
            label="x-small"
            class="mr-2"
            @change="
              clickerSmall = false;
              clickerNormal = false;
              clickerLarge = false;
              clickerXLarge = false;
              clickerStep += 1;
            "
          />
          <v-checkbox
            :dark="isDarkMode"
            v-model="clickerSmall"
            label="small"
            class="mr-2"
            @change="
              clickerXSmall = false;
              clickerNormal = false;
              clickerLarge = false;
              clickerXLarge = false;
              clickerStep += 1;
            "
          />
          <v-checkbox
            :dark="isDarkMode"
            label="normal"
            v-model="clickerNormal"
            @change="
              clickerXSmall = false;
              clickerSmall = false;
              clickerLarge = false;
              clickerXLarge = false;
              clickerStep += 1;
            "
          />
          <v-checkbox
            :dark="isDarkMode"
            v-model="clickerLarge"
            label="large"
            class="mr-2"
            @change="
              clickerSmall = false;
              clickerXSmall = false;
              clickerNormal = false;
              clickerXLarge = false;
              clickerStep += 1;
            "
          />
          <v-checkbox
            :dark="isDarkMode"
            v-model="clickerXLarge"
            label="x-large"
            class="mr-2"
            @change="
              clickerSmall = false;
              clickerXSmall = false;
              clickerNormal = false;
              clickerLarge = false;
              clickerStep += 1;
            "
          />
        </div>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerAbsolute"
          :label="clickerAbsolute ? 'absolute' : 'relative'"
          class="mt-8"
        ></v-switch>

        <div class="components__checkboxes mt-n6 mb-10">
          <v-checkbox
            :dark="isDarkMode"
            v-model="clickerTop"
            label="top"
            class="mr-2"
            @change="
              clickerBottom = false;
              clickerStep += 1;
            "
          />
          <v-checkbox
            :dark="isDarkMode"
            v-model="clickerRight"
            label="right"
            class="mr-2"
            @change="
              clickerLeft = false;
              clickerStep += 1;
            "
          />
          <v-checkbox
            :dark="isDarkMode"
            v-model="clickerBottom"
            label="bottom"
            class="mr-2"
            @change="
              clickerTop = false;
              clickerStep += 1;
            "
          />
          <v-checkbox
            :dark="isDarkMode"
            v-model="clickerLeft"
            label="left"
            class="mr-2"
            @change="
              clickerRight = false;
              clickerStep += 1;
            "
          />
        </div>

        <v-switch
          :dark="isDarkMode"
          v-model="clickerRounded"
          :label="clickerRounded ? 'rounded' : 'not rounded'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerTooltip"
          :label="clickerTooltip ? 'tooltip visible' : 'no tooltip'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerExtended"
          :label="clickerExtended ? 'extended' : 'not extended'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerFlat"
          :label="clickerFlat ? 'flat' : 'box-shadow'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerDisabled"
          :label="clickerDisabled ? 'disabled' : 'active'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerUppercase"
          :label="clickerUppercase ? 'uppercase' : 'case-sensitive'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerBold"
          :label="clickerBold ? 'bold' : 'normal font-weight'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerFab"
          :label="clickerFab ? 'fab' : 'regular button'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerOutlined"
          :label="clickerOutlined ? 'outlined' : 'filled'"
          class="mt-n3"
        ></v-switch>
        <v-switch
          :dark="isDarkMode"
          v-model="clickerReflection"
          :label="clickerReflection ? 'reflection' : 'no reflection'"
          class="mt-n3"
        ></v-switch>
        <v-slider
          v-model="clickerReflectionIntensity"
          thumb-color="grey"
          :min="0"
          :max="1"
          label="reflection intensity"
          :dark="isDarkMode"
          step="0.1"
          @change="clickerStep += 1"
        />
        <v-color-picker
          :dark="isDarkMode"
          dot-size="25"
          swatches-max-height="200"
          v-model="clickerBackground"
        ></v-color-picker>
        <v-color-picker
          :dark="isDarkMode"
          dot-size="25"
          swatches-max-height="200"
          v-model="clickerColor"
        ></v-color-picker>
        <div class="components__checkboxes mt-n6"></div>
      </div>
    </v-card>
  </div>
</template>

<script>
import Buzzer from "../components/Buzzer.vue";
import Clicker from "../components/Clicker.vue";
import ContributionGrid from "../components/ContributionGrid.vue";
import FlexGauge from "../components/FlexGauge.vue";
import GaugeBar from "../components/GaugeBar.vue";
import GaugeCanvas from "../components/GaugeCanvas.vue";
import Modal from "../components/Modal.vue";
import VintageIcon from "../components/VintageIcon.vue";
import store from "../store";

import Vue from "vue";
export default Vue.extend({
  name: "Components",
  components: {
    Buzzer,
    Clicker,
    ContributionGrid,
    FlexGauge,
    GaugeBar,
    GaugeCanvas,
    Modal,
    VintageIcon,
  },
  computed: {
    contributionGridDataset() {
      let arr = [];
      for (let i = 0; i < 2000; i += 1) {
        arr.push({
          logDate: this.randomDate(new Date(2022, 0, 1), new Date(2022, 12, 0)),
        });
      }
      return arr;
    },
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
      gaugeMin: 0,
      gaugeMax: 10,
      gaugeGradient: false,
      showGaugeCode: false,
      gaugeColorStart: "#fc0303",
      gaugeColorEnd: "#5cd65c",

      thermoScore: 10,
      thermoSize: 400,
      thermoShowRefresh: true,
      thermoBase10: true,
      thermoStep: 0,
      isDialogOpen: false,
      dialogTitle: "I am native",
      dialogHeight: 260,
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
      buzzerText: "Click",
      buzzerAbsolute: false,
      buzzerTop: false,
      buzzerRight: false,
      buzzerBottom: false,
      buzzerLeft: false,
      buzzerXsmall: false,
      buzzerSmall: false,
      buzzerLarge: false,
      buzzerXlarge: true,
      buzzerNormal: false,
      buttonStep: 0,
      buzzerDisabled: false,
      buzzerIsLoading: false,
      buzzerRounded: false,
      buzzerOutlined: false,
      buzzerAnimation: true,
      buzzerExtended: false,
      buzzerFab: false,
      buzzerUppercase: false,
      buzzerFlat: false,
      buzzerColor: "#f0f2f5",
      buzzerTextColor: "#626466",
      buzzerFat: false,
      buzzerTooltip: false,
      tooltipText: "",
      buzzerTooltipPermanent: false,
      buzzerAwesome: false,
      buzzerConfig: {
        color: "#34eb74",
      },
      showContributionGridLegend: true,
      showContributionGridTooltip: true,
      showContributionGridOutlined: true,
      showContributionGridLegendX: true,
      showContributionGridLegendY: true,
      showContributionGridToday: true,
      contributionGridRounded: false,
      icons: [],
      selectedIcon: { name: "arrow", entity: "&#129082;" },
      iconRotate: 0,
      iconSize: 3,
      iconShadow: false,
      thermoHideMeasures: false,
      thermoKey: 99,
      gaugeKey: 999,
      thermoSpeed: 1,

      clickerAbsolute: false,
      clickerBackground: "#5C9A54",
      clickerBold: false,
      clickerBottom: false,
      clickerColor: "#FFFFFF",
      clickerDisabled: false,
      clickerExtended: false,
      clickerFab: false,
      clickerFlat: true,
      clickerLarge: false,
      clickerLeft: false,
      clickerLoading: false,
      clickerNormal: true,
      clickerOutlined: false,
      clickerReflection: true,
      clickerReflectionIntensity: 0.3,
      clickerRight: false,
      clickerRounded: true,
      clickerSmall: false,
      clickerStep: 0,
      clickerTooltip: false,
      clickerTop: false,
      clickerUppercase: true,
      clickerXLarge: false,
      clickerXSmall: false,
    };
  },
  methods: {
    changeButtonContent() {
      if (this.buzzerFab) {
        this.buzzerText = "!";
      } else {
        this.buzzerText = "Click";
      }
      this.buttonStep += 1;
    },
    randomDate(start, end) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    },
    selectSize(e) {
      console.log(e.target);
    },
    setTooltip(show) {
      if (show) {
        this.tooltipText = "Tooltip";
      } else {
        this.tooltipText = "";
        this.buzzerTooltipPermanent = false;
      }
    },
    getIcons(icons) {
      const keys = Object.keys(icons);
      const values = Object.values(icons);
      this.icons = keys.map((key, i) => {
        return { name: key, entity: values[i] };
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.components {
  ::-webkit-scrollbar {
    width: 26px;
  }
  ::-webkit-scrollbar-track {
    margin-top: 12px;
    margin-bottom: 12px;
    background: #eeeeee;
    border-radius: 100vw;
    border: 1px solid #cacaca;
    /** border & background-clip create a margin right on the scrollbar */
    border: 0.5em solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
  }
  ::-webkit-scrollbar-thumb {
    background: #c4c4c4;
    border-radius: 100vw;
    border: 0.5em solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
  }
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
      &--scroll {
        height: 500px;
        overflow-x: scroll;
        padding: 12px;
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
      &--column {
        flex-direction: column;
        width: 100%;
      }
    }
  }
  &__title {
    left: 80px;
    position: absolute;
    text-align: left;
    top: 15px;
  }
  &__checkboxes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 36px);
    justify-content: center;
  }
}
</style>
