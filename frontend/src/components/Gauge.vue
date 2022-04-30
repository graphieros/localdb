<template>
  <div :class="`gauge ${isDarkModeText} ${mini ? 'gauge__mini' : ''}`">
    <div v-if="!mini" class="gauge__title">
      {{ options.translation }}
    </div>
    <div class="gauge__shapes">
      <div v-if="!mini" class="gauge__measures">
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(0deg); width:${
            base10 ? '1px' : '2px'
          }`"
        >
          <span class="gauge__tick__text" style="margin-top: -19px">
            {{ base10 ? 5 : 0 }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(14.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(27deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`
              transform-origin: 0 0;
              transform: rotate(-27deg);
              margin-top: ${base10 ? '-17px' : '-17px'};
              margin-left: ${base10 ? '-8px' : '0px'}`"
          >
            {{ base10 ? 6 : "+20" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(41.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(54deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`
              transform-origin: 0 0;
              transform: rotate(-54deg);
              margin-top: ${base10 ? '-14px' : '-18px'};
              margin-left: ${base10 ? '-17px' : '-10px'}`"
          >
            {{ base10 ? 7 : "+40" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(68.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(81deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`
              transform-origin: 0 0;
              transform: rotate(-81deg);
              margin-top: ${base10 ? '-8px' : '-14px'};
              margin-left: ${base10 ? '-19px' : '-20px'}`"
          >
            {{ base10 ? 8 : "+60" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(95.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(108deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`
              transform-origin: 0 0;
              transform: rotate(-108deg);
              margin-top: ${base10 ? '-4px' : '-9px'};
              margin-left: ${base10 ? '-20px' : '-22px'}`"
          >
            {{ base10 ? 9 : "+80" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(122.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(135deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`
              transform-origin: 0 0;
              transform: rotate(-135deg);
              margin-top: ${base10 ? '-2px' : '-7px'};
              margin-left: ${base10 ? '-13px' : '-31px'}`"
          >
            {{ base10 ? 10 : "+100" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(-14.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(-27deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`
              transform-origin: 0 0;
              transform: rotate(27deg);
              margin-top: ${base10 ? '-18px' : '-19px'};
              margin-right: ${base10 ? '-7px' : '4px'}`"
          >
            {{ base10 ? 4 : "-20" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(-41.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(-54deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`
              transform-origin: 0 0;
              transform: rotate(54deg);
              margin-top: ${base10 ? '-16px' : '-19px'};
              margin-right: ${base10 ? '-16px' : '-16px'};`"
          >
            {{ base10 ? 3 : "-40" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(-68.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(-81deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`transform-origin: 0 0;
              transform: rotate(81deg);
              margin-top: ${base10 ? '-10px' : '-15px'};
              margin-right: ${base10 ? '-20px' : '-25px'};`"
          >
            {{ base10 ? 2 : "-60" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(-95.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(-108deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`transform-origin: 0 0;
              transform: rotate(108deg);
              margin-top: ${base10 ? '-5px' : '-11px'};
              margin-right: ${base10 ? '-26px' : '-28px'};`"
          >
            {{ base10 ? 1 : "-80" }}
          </span>
        </div>
        <div
          class="gauge__half-tick"
          :style="`transform: translate(-50%,-50%) rotate(-122.5deg)`"
        ></div>
        <div
          class="gauge__tick"
          :style="`transform: translate(-50%,-50%) rotate(-135deg)`"
        >
          <span
            class="gauge__tick__text"
            :style="`transform-origin: 0 0;
              transform: rotate(135deg);
              margin-top: ${base10 ? '-2px' : '-10px'};
              margin-right: ${base10 ? '-18px' : '-39px'}`"
          >
            {{ base10 ? 0 : "-100" }}
          </span>
        </div>
      </div>

      <div v-if="base10" class="gauge__sides--base10"></div>
      <div v-else class="gauge__sides"></div>

      <div
        :class="`gauge__triangle`"
        :style="dark ? `background:${darkColor}` : 'background: white'"
      ></div>
      <div
        class="gauge__value"
        :style="`color:${color}; margin-left:${getLegendMargin()}`"
      >
        {{ displayValue }}
      </div>
      <div
        :class="`gauge__hollow`"
        :style="dark ? `background:${darkColor}` : 'background: white'"
      >
        <div
          class="gauge__mech"
          @mouseover="isTooltip = true"
          @mouseleave="closeTooltip()"
        ></div>
        <div
          class="gauge__hollow__pointer"
          @mouseover="isTooltip = true"
          @mouseleave="closeTooltip()"
        >
          <div
            id="gauge-pointer"
            class="gauge__pointer"
            :style="{
              transform: `translate(-50%,-50%) rotate(${getGaugeRotation(
                rating
              )}deg)`,
              animation: 'rotate-gauge-pointer 1s ease-in-out forwards',
              background: '#c2c2c2',
            }"
          ></div>
          <div
            id="gauge-pointer"
            class="gauge__pointer--shade"
            :style="{
              transform: `translate(-50%,-50%) rotate(${getGaugeRotation(
                rating
              )}deg)`,
              animation: 'rotate-gauge-pointer 1s ease-in-out forwards',
            }"
          ></div>
        </div>
      </div>
    </div>
    <div
      v-if="isTooltip && !mini"
      class="gauge__tooltip custom-tooltip-wrapper"
    >
      <span>
        {{ options.translation }}: <strong>{{ displayValue }}</strong>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    base10: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: {
        rating: 0,
        colors: ["#eb4034", "#ebb134", "#20a82e"],
        translation: "",
      },
    },
    dark: {
      type: Boolean,
      default: false,
    },
    darkColor: {
      type: String,
      default: "#000000",
    },
    mini: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      color: "#c2c2c2",
      isTooltip: false,
    };
  },
  computed: {
    displayValue() {
      const sign = this.rating > 0 ? "+" : "";
      if (this.base10) {
        return this.rating;
      } else {
        return `${this.rating !== 0 ? sign : ""}${this.rating}`;
      }
    },
    isDarkMode() {
      if (this.dark) {
        return "gauge__dark";
      }
      return "";
    },
    isDarkModeText() {
      if (this.dark) {
        return "gauge__dark-mode-text";
      }
      return "";
    },
    rating() {
      return Number(this.options.rating);
    },
    tickParams() {
      return [
        {
          transformStyme,
        },
      ];
    },
  },
  methods: {
    closeTooltip() {
      setTimeout(() => {
        this.isTooltip = false;
      }, 400);
    },
    getGaugeRotation(value = 0) {
      if (this.base10) {
        return -135 + value * 27;
      } else {
        return Number(value) * 1.35;
      }
    },
    getLegendMargin() {
      if (this.base10) {
        return;
      }
      if (this.rating > 0) {
        return "-5px";
      } else if (this.rating < 0) {
        return "-4px";
      }
      return "0";
    },
    updateColors() {
      if (this.base10) {
        if (this.rating < 6) {
          this.color = this.options.colors[0];
        } else if (this.rating >= 6 && this.rating < 8) {
          this.color = this.options.colors[1];
        } else {
          this.color = this.options.colors[2];
        }
      } else {
        if (this.rating > 0) {
          this.color = this.options.colors[1];
        } else if (this.rating < 0) {
          this.color = this.options.colors[0];
        } else {
          this.color = "#a6a6a6";
        }
      }
    },
  },
  created() {
    this.updateColors();
  },
  updated() {
    this.updateColors();
  },
  mounted() {
    const style = document.createElement("style");
    style.lang = "css";
    const keyframes = `@keyframes rotate-gauge-pointer_${new Date().getTime()} {
      0%{
          transform: translate(-50%,-50%) rotate(-135deg);
        }
      100% {
          transform: translate(-50%, -50%) rotate(${this.getGaugeRotation(
            this.rating
          )}deg);
        }
      }`;
    style.innerHTML = keyframes;
    document.getElementsByTagName("head")[0].appendChild(style);
  },
};
</script>

<style lang="scss" scoped>
.gauge {
  align-items: center;
  display: flex;
  height: fit-content;
  justify-content: center;
  position: relative;
  height: 200px;
  user-select: none;
  &__half-tick,
  &__hollow,
  &__mech,
  &__pointer,
  &__pointer--shade,
  &__shapes,
  &__tick,
  &__tooltip,
  &__value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__hollow {
    background: transparent;
    border-radius: 50%;
    box-shadow: 0px -6px 3px rgba(0, 0, 0, 0.226);
    height: 120px;
    width: 120px;
    z-index: 1;
  }
  &__measures {
    display: block;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    font-size: 0.85rem;
  }
  &__mech {
    background: radial-gradient(white, grey);
    border-radius: 50%;
    border: 1px solid grey;
    height: 24px;
    width: 24px;
  }
  &__triangle {
    background: white;
    clip-path: polygon(51% 49%, 0% 100%, 100% 100%);
    display: block;
    height: 100%;
    position: absolute;
    top: 1px;
    width: 100%;
  }
  &__hollow__pointer {
    display: block;
    height: 100%;
    position: relative;
    width: 100%;
  }
  &__shapes {
    align-items: center;
    display: flex;
    height: 160px;
    justify-content: center;
    width: 160px;
  }
  &__pointer {
    clip-path: polygon(49% 0%, 36% 42%, 50% 51%, 64% 42%);
    height: 100%;
    width: 40px;
  }
  &__pointer--shade {
    background: rgba(0, 0, 0, 0.247);
    clip-path: polygon(49% 0%, 49% 33%, 50% 51%, 64% 42%);
    height: 100%;
    width: 40px;
  }
  &__sides--base10 {
    background-clip: border-box;
    background: orange;
    border-radius: 50%;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    &::before {
      background: #20a82e;
      clip: rect(0 160px 80px 0);
      content: "";
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      transform: rotate(171deg);
      width: 100%;
    }
    &::after {
      background: #eb4034;
      clip: rect(0 80px 160px 0);
      content: "";
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      transform: rotate(27deg);
      width: 100%;
    }
  }

  &__sides {
    background-clip: border-box;
    background: #20a82e;
    border-radius: 50%;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    &::before {
      background: #eb4034;
      clip: rect(0 160px 0px 0);
      content: "";
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      transform: rotate(180deg);
      width: 100%;
    }
    &::after {
      background: #eb4034;
      clip: rect(0 80px 160px 0);
      content: "";
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      transform: rotate(360deg);
      width: 100%;
    }
  }
  &__half-tick,
  &__tick {
    display: flex;
    justify-content: center;
    width: 0.5px;
    background: linear-gradient(to top, transparent 50%, white);
  }
  &__half-tick {
    height: 85%;
  }
  &__tick {
    height: 100%;
  }
  &__tick__text {
    width: 0.5px;
    white-space: nowrap;
    display: flex;
    justify-content: center;
  }
  &__title {
    font-size: 0.9rem;
    font-weight: bold;
    left: 50%;
    position: absolute;
    top: 10px;
    transform: translate(-50%, -150%);
    white-space: nowrap;
    z-index: 2;
  }
  &__tooltip {
    box-shadow: 0px 0px 16px -8px grey;
    font-size: 0.9rem;
    text-align: center;
    transform: translate(-50%, 40%);
    border: 1px solid white;
  }
  &__value {
    font-size: 1.618rem;
    font-weight: bold;
    transform: translate(-50%, 100%);
    z-index: 2;
  }
  &__dark-mode-text {
    color: grey;
  }
  &__mini {
    zoom: 40%;
  }
}
</style>
