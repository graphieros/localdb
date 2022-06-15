<template>
  <div :style="containerStyle">
    <div
      @pointerenter="allowTooltip(true)"
      @pointerleave="allowTooltip(false)"
      @mousemove="(e) => showTooltip(e)"
      :class="{
        'alp-clicker__sub-wrapper': true,
        'alp-clicker--flat': flat,
      }"
      :style="wrapperStyle"
    >
      <button
        :class="{
          'alp-clicker': true,
          'alp-clicker--extended': extended,
          'alp-clicker--disabled': disabled,
          'alp-clicker--bold': bold,
        }"
        @click.prevent="(e) => ripple(e)"
        ref="clicker"
        :style="clickerStyle"
        :disabled="disabled"
      >
        <div
          v-if="reflection"
          class="alp-clicker__reflection"
          :style="reflectionStyle"
        ></div>
        <div style="z-index: 1; border-radius: inherit">
          <slot></slot>
        </div>

        <svg class="alp-clicker__loader" viewBox="0 0 64 64" v-if="loading">
          <path :style="`stroke:${stroke}`" d=" M 62 43 A 32 32 0 1 1 46 3" />
        </svg>

        <div
          v-if="showRipple"
          :class="{ 'alp-clicker__ripple': true }"
          :style="rippleStyle"
        ></div>
      </button>
    </div>
    <div
      class="alp-clicker__tooltip"
      ref="clickerTooltip"
      :style="`left: ${mouseX}px; top:${mouseY}px; ${tooltipStyle}`"
      v-html="tooltipHtml"
      v-show="isTooltip && tooltipHtml && !disabled"
    ></div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Clicker",
  props: {
    absolute: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: "#cacaca",
    },
    bold: {
      type: Boolean,
      default: false,
    },
    borderRadius: {
      type: Number | String,
      default: 12,
    },
    color: {
      type: String,
      default: "white",
    },
    dark: {
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
    flat: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    reflection: {
      type: Boolean,
      default: false,
    },
    reflectionIntensity: {
      type: Number | String,
      default: 0.2,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: "black",
    },
    tooltipHtml: {
      type: String,
      default: "",
    },
    uppercase: {
      type: Boolean,
      default: true,
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
  components: {},
  data() {
    return {
      isTooltip: false,
      mouseX: 0,
      mouseY: 0,
      showRipple: false,
      zoom: 1,
      rippleX: 0,
      rippleY: 0,
    };
  },
  computed: {
    clicker() {
      return this.$refs.clicker;
    },
    clickerTooltip() {
      return this.$refs.clickerTooltip;
    },
    clickerStyle() {
      const background = this.outlined ? "transparent" : this.background;
      const borderColor = this.dark ? "white" : this.textColor;
      const border = this.outlined
        ? `1px solid ${borderColor}`
        : `1px solid ${background}`;
      const opacity = this.disabled ? 0.5 : 1;
      const borderRadius = this.fab
        ? "50%"
        : this.rounded
        ? "50px"
        : `${this.borderRadius}px`;
      const textTransform = this.uppercase ? "uppercase" : "initial";
      const size = this.fab ? 40 : "";

      return `
            border:${border};
            border-radius:${borderRadius};
            background:${background};
            color:${this.loading ? "transparent" : this.fontColor};
            opacity:${opacity};
            text-transform:${textTransform};
            height:${this.fab ? size + 8 : ""}px !important;
            width:${this.fab ? size + "px" : "100%"} !important;
            z-index:1000;
        `;
    },
    wrapperStyle() {
      let size =
        this.xSmall || this.small ? this.borderRadius - 3 : this.borderRadius;
      if (this.rounded) {
        size = 50;
      }
      return `
            display: block;
            transform: scale(${this.computedZoom});
            border:none;
            border-radius:${this.fab ? "50% !important" : size + "px"};
            width:100%"
        `;
    },
    computedZoom() {
      if (this.xSmall) {
        this.zoom = 0.65;
      }
      if (this.small) {
        this.zoom = 0.8;
      }
      if (this.large) {
        this.zoom = 1.2;
      }
      if (this.xLarge) {
        this.zoom = 1.35;
      }
      return `${this.zoom}`;
    },
    containerStyle() {
      const extended = this.extended ? "100%" : "";
      const position = this.absolute ? "absolute" : "";
      return `display:block;position:${position};top:0;width:${extended};`;
    },
    rippleStyle() {
      const size = this.clicker.clientWidth;
      return `
            top:${this.rippleY}px;
            left:${this.rippleX}px;
            height:${size}px;
            width:${size}px;
            background: rgba(0,0,0,0.3);
        `;
    },
    stroke() {
      return this.fontColor;
    },
    fontColor() {
      const textColor = this.outlined
        ? this.dark
          ? "white"
          : this.textColor
        : this.textColor;
      return textColor;
    },
    reflectionStyle() {
      return `background:radial-gradient(at top left,white,transparent,rgba(0, 0, 0, ${Number(
        this.reflectionIntensity
      )}),transparent,white);`;
    },
    tooltipDimensions() {
      return this.clickerTooltip.getBoundingClientRect();
    },
    tooltipStyle() {
      let fontSize = 1;
      if (this.xSmall || this.small) {
        fontSize = 1 * this.zoom;
      }
      return `
            font-size:${fontSize}rem;
        `;
    },
  },
  methods: {
    allowTooltip(isVisible) {
      const bounds = this.clicker.getBoundingClientRect();
      if (
        this.mouseX > bounds.y &&
        this.mouseX < bounds.y + bounds.width &&
        this.mouseY > bounds.x &&
        this.mouseY < bounds.x + bounds.height
      ) {
        this.isTooltip = isVisible;
      } else {
        this.isTooltip = isVisible;
      }
    },
    ripple(e) {
      this.rippleX = e.offsetX;
      this.rippleY = e.offsetY;
      this.showRipple = true;
      this.$emit("click");
      setTimeout(() => {
        this.showRipple = false;
      }, 500);
    },
    showTooltip(e) {
      this.mouseX = e.clientX - this.clickerTooltip.clientWidth / 2;
      this.mouseY = e.clientY + this.clicker.clientHeight / 2;
    },
  },
});
</script>

<style lang="scss" scoped>
.clicker-absolute {
  position: absolute !important;
  top: 0;
  left: 0;
}
.alp-clicker {
  padding: 8px 24px;
  overflow: hidden;
  height: 100% !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  &--bold {
    font-weight: 900;
  }
  &--disabled {
    cursor: not-allowed;
  }
  &--extended {
    width: 100% !important;
  }
  &--flat {
    box-shadow: none !important;
  }
  &__fab {
    width: 30px !important;
    height: 40px !important;
    border-radius: 50% !important;
  }
  &__loader {
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    height: 30px;
    width: 30px;
    transform: translate(-50%, -50%);
    stroke-width: 12px;
    fill: transparent;
    stroke-linecap: round;
    animation: load 1s infinite alternate;
    shape-rendering: geometricPrecision;
    path: {
      stroke-linejoin: round;
      stroke-linecap: round;
      shape-rendering: geometricPrecision;
    }
  }
  @keyframes load {
    0% {
      transform: translate(-50%, -50%) rotate(-360deg) scale(1);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg) scale(0.8);
    }
  }
  &__reflection {
    display: block;
    position: absolute;
    height: calc(100% - 6px);
    width: calc(100% - 6px);
    border-radius: inherit;
  }
  &__sub-wrapper {
    // position: relative;
    overflow: hidden;
    height: fit-content;
    min-height: 40px;
    box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.11);
  }
  &__ripple {
    border-radius: 50%;
    display: block;
    position: absolute;
    animation: ripple 500ms ease-in-out;
    transform: translate(-50%, -50%) scale(0);
  }

  @keyframes ripple {
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(3);
    }
  }
  &__tooltip {
    color: white;
    background: rgba(0, 0, 0, 0.5);
    padding: 4px 12px;
    position: fixed;
    width: fit-content;
    border-radius: 6px;
    max-width: 200px;

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
</style>
