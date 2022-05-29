<template>
  <button
    :disabled="disabled"
    @click.prevent="
      $emit('click');
      animateClick();
    "
    :class="{
      'alp-buzzer': true,
      'alp-buzzer--animate': isAnimated && clickAnimation,
      'alp-buzzer--disabled': disabled,
      'alp-buzzer--absolute': absolute,
      'alp-buzzer--top': top,
      'alp-buzzer--right': right,
      'alp-buzzer--bottom': bottom,
      'alp-buzzer--left': left,
    }"
    :style="buzzerStyle"
    @pointerenter="hover(true)"
    @pointerleave="hover(false)"
  >
    <div v-if="isLoading" class="alp-buzzer__loading"></div>
    <div :style="slotStyle">
      <slot></slot>
    </div>
    <div
      v-if="awesome && isAwesome"
      class="alp-buzzer__awesome alp-buzzer__awesome--left"
    ></div>
    <div
      v-if="awesome && isAwesome"
      class="alp-buzzer__awesome alp-buzzer__awesome--right"
    ></div>
    <div
      v-if="tooltip && (showTooltip || tooltipPermanent)"
      class="alp-buzzer__tooltip-trap"
    >
      <div
        :class="{
          'alp-buzzer__tooltip': true,
          'alp-buzzer__tooltip--bottom': tooltipBottom,
        }"
      >
        {{ tooltip }}
      </div>
    </div>
  </button>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Buzzer",
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    /**
     * Sets the button to absolute position
     */
    absolute: {
      type: Boolean,
      default: false,
    },
    awesome: {
      type: Boolean,
      default: false,
    },
    borderRadius: {
      type: Number | String,
      default: null,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#f0f2f5",
    },
    clickAnimation: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    extended: {
      type: Boolean,
      default: false,
    },
    fab: {
      type: Boolean,
      default: false,
    },
    fat: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: "",
    },
    thick: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: String,
      default: "",
    },
    tooltipBottom: {
      type: Boolean,
      default: true,
    },
    tooltipPermanent: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: false,
    },
    uppercase: {
      type: Boolean,
      default: false,
    },
    xLarge: {
      type: Boolean,
      default: false,
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isAnimated: false,
      backgroundColor: this.color || this.getConfig("color", "#626466"),
      border: null,
      boxShadow: null,
      brightness: "100%",
      fontWeight: 400,
      height: "auto",
      isAwesome: false,
      isHover: false,
      radius: `${this.borderRadius || this.getConfig("borderRadius", 3)}px`,
      showTooltip: false,
      thickness: 1,
      textTransform: "none",
      zoom: 100,
      width: "fit-content",
    };
  },
  computed: {
    buzzerStyle() {
      if (this.thick) {
        this.thickness = 3;
      }
      if (this.flat) {
        this.boxShadow = "none";
      } else {
        this.boxShadow = "0px 3px 6px -3px rgba(0,0,0,0.2)";
      }
      if (this.outlined) {
        this.border = `${this.thickness}px solid ${this.textColor}`;
        if (this.isHover) {
          this.backgroundColor = "rgba(0,0,0,0.1)";
        } else {
          this.backgroundColor = "transparent";
        }
        this.boxShadow = "none";
      }

      if (this.fat) {
        this.border = `${this.thickness + 2}px solid ${this.textColor}`;
        this.fontWeight = 700;
      }

      if (this.rounded) {
        this.radius = "40px";
      }

      if (this.fab) {
        this.height = "40px";
        this.width = "40px";
        this.radius = "100%";
      }

      if (this.uppercase) {
        this.textTransform = "uppercase";
      }
      if (this.large) {
        this.zoom = 125;
      }
      if (this.xLarge) {
        this.zoom = 200;
      }
      if (this.xSmall) {
        this.zoom = 65;
      }
      if (this.small) {
        this.zoom = 85;
      }
      if (this.extended) {
        this.width = "100%";
      }

      return `background-color:${this.backgroundColor};
              border:${this.border};
              border-radius:${this.radius};
              box-shadow:${this.boxShadow};
              filter: brightness(${this.brightness});
              height:${this.height};
              padding:3px 13px;
              text-transform:${this.textTransform};
              width:${this.width};
              zoom:${this.zoom}%;`;
    },

    slotStyle() {
      if (this.thick) {
        this.fontWeight = 700;
      }
      return `color:${this.textColor};font-weight:${this.fontWeight}`;
    },
  },
  methods: {
    animateClick() {
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.isAnimated = false;
        this.isAwesome = false;
      }
      this.isAnimated = true;
      this.isAwesome = true;
      this.clickTimeout = setTimeout(() => {
        this.isAnimated = false;
        this.isAwesome = false;
      }, 250);
    },
    getConfig(prop, fallback) {
      if (prop in this.config) {
        return this.config[prop];
      }
      return fallback || undefined;
    },
    hover(isHover) {
      if (isHover) {
        this.isHover = true;
        this.brightness = "92%";
        if (this.tooltip) {
          this.showTooltip = true;
        }
      } else {
        this.isHover = false;
        this.brightness = "100%";
        if (this.tooltip) {
          this.showTooltip = false;
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.alp-buzzer {
  position: relative;
  cursor: pointer;
  transition: background-color 0.12s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    animation: load 2s infinite linear;
    background: radial-gradient(transparent, rgba(0, 0, 0, 0.5));
  }
  &--animate {
    animation: clicked 0.15s ease-in-out;
  }
  &--disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  &--absolute {
    position: absolute;
  }
  &--top {
    top: 0;
  }
  &--right {
    right: 0;
  }
  &--bottom {
    bottom: 0;
  }
  &--left {
    left: 0;
  }
  &__tooltip-trap {
    display: block;
    position: relative;
    width: 100%;
    overflow: visible;
  }
  &__tooltip {
    display: block;
    position: absolute;
    width: fit-content;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 3px 12px;
    font-size: 0.6em;
    border-radius: 3px;
    &--bottom {
      left: 50%;
      transform: translateX(-50%);
      top: 12px;
      animation: showBottom 0.1s ease-in-out forwards;
      &::after {
        content: "";
        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        display: inline-block;
        height: 0;
        width: 0;
        border-right: 4px solid transparent;
        border-bottom: 4px solid rgba(0, 0, 0, 0.5);
        border-left: 4px solid transparent;
      }
    }
  }
  &__awesome {
    &--left {
      display: block;
      position: absolute;
      height: 30px;
      width: 30px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: radial-gradient(transparent, rgba(0, 0, 0, 0.5));
      animation: awesomeLeft 0.25s ease-in-out forwards;
    }
    &--right {
      display: block;
      position: absolute;
      height: 30px;
      width: 30px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: radial-gradient(transparent, rgba(0, 0, 0, 0.5));
      animation: awesomeRight 0.25s ease-in-out forwards;
    }
  }
  @keyframes awesomeLeft {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-200%, -50%) scale(0.3, 1);
    }
  }
  @keyframes awesomeRight {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1, 0);
    }
    100% {
      opacity: 0;
      transform: translate(100%, -50%) scale(0.3, 1);
    }
  }

  @keyframes showBottom {
    0% {
      opacity: 0;
      transform: translateY(-15%) translateX(-50%);
    }
    100% {
      opacity: 1;
      transform: translateY(-5%) translateX(-50%);
    }
  }

  @keyframes clicked {
    0% {
      transform: translateY(0px);
      transform: scale(1, 1);
    }
    50% {
      transform: translateY(2px);
      transform: scale(0.95, 0.95);
    }
    100% {
      transform: translateY(0px);
      transform: scale(1, 1);
    }
  }

  @keyframes load {
    0% {
      transform: scale(1, 1);
      opacity: 0;
    }
    50% {
      transform: scale(0.9, 0.8) rotateY(3.142rad);
      opacity: 0.5;
    }
    100% {
      transform: scale(1, 1);
      opacity: 0;
    }
  }
}
</style>
