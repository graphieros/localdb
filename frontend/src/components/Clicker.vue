<template>
  <div>
    <div
      @pointerenter="allowTooltip(true)"
      @pointerleave="allowTooltip(false)"
      @mousemove="(e) => showTooltip(e)"
      :class="{ 'alp-clicker__sub-wrapper': true }"
      :style="wrapperStyle"
    >
      <button
        :class="{ 'alp-clicker': true, 'alp-clicker--flat': flat }"
        @click.prevent="(e) => ripple(e)"
        ref="clicker"
        :style="clickerStyle"
        :disabled="disabled"
      >
        <slot></slot>
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
    background: {
      type: String,
      default: "#cacaca",
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
    flat: {
      type: Boolean,
      default: false,
    },
    large: {
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
      const textColor = this.outlined
        ? this.dark
          ? "white"
          : this.textColor
        : this.textColor;
      const borderRadius = this.rounded ? "50" : this.borderRadius;

      return `
            border:${border};
            border-radius:${borderRadius}px;
            background:${background};
            color:${textColor};
            opacity:${opacity};
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
            transform: scale(${this.computedZoom});
            border:none;
            border-radius:${size}px;
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
    rippleStyle() {
      const size = this.clicker.clientWidth;
      return `
            top:${this.rippleY}px;
            left:${this.rippleX}px;
            height:${size}px;
            width:${size}px;
            background: rgba(255,255,255,0.5);
        `;
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
.alp-clicker {
  padding: 8px 24px;
  box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.11);
  overflow: hidden;
  height: 100% !important;
  &--flat {
    box-shadow: none !important;
  }
  &__sub-wrapper {
    position: relative;
    overflow: hidden;
    height: fit-content;
    width: fit-content;
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
