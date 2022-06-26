<template>
  <div
    :class="{
      'skeleton-loader__wrapper': true,
      'skeleton-loader__wrapper--row': row,
      'skeleton-loader__wrapper--col': col,
    }"
    :style="`gap:${gap}; width:100%`"
  >
    <template v-for="(skeleton, i) in Number(quantity)">
      <div
        :class="{
          'skeleton-loader': true,
          'skeleton-loader--animated': animated,
        }"
        :key="`skeleton-root-item_${i}`"
        :style="computedStyle"
      >
        <div
          class="skeleton-loader__hollow"
          v-if="donut"
          :style="hollowStyle"
        ></div>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "SkeletonLoader",
  props: {
    animated: {
      type: Boolean,
      default: true,
    },
    background: {
      type: String,
      default: null,
    },
    borderRadius: {
      type: String,
      default: "8px",
    },
    circle: {
      type: Boolean,
      default: false,
    },
    col: {
      type: Boolean,
      default: false,
    },
    donut: {
      type: Boolean,
      default: false,
    },
    gap: {
      type: String,
      default: "12px",
    },
    height: {
      type: String,
      default: "100px",
    },
    hollowColor: {
      type: String,
      default: "white",
    },
    quantity: {
      type: Number | String,
      default: 1,
    },
    margin: {
      type: String,
      default: "6px",
    },
    row: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {};
  },
  computed: {
    computedStyle() {
      const backgroundColor = !this.background
        ? this.dark
          ? "rgba(255,255,255,0.2)"
          : "#cccccc"
        : this.background;
      return `
            background:${backgroundColor};
            border-radius:${this.circle ? "50%" : this.borderRadius}
            height:${this.height};
            min-height:${this.height};
            margin:${this.margin};
            width:${this.circle ? this.height : this.width};
        `;
    },
    hollowStyle() {
      return `
            background:${this.hollowColor};
        `;
    },
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.skeleton-loader {
  display: block;
  position: relative;
  margin: 12px 0;
  &--animated {
    z-index: 0;
    display: block;
    overflow: hidden;
    &::after {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background: linear-gradient(
        90deg,
        rgba(#fff, 0) 0,
        rgba(#fff, 0.2) 20%,
        rgba(#fff, 0.5) 60%,
        rgba(#fff, 0)
      );
      animation: animate 2s infinite;
      content: "";
    }
  }
  @keyframes animate {
    100% {
      transform: translateX(100%);
    }
  }
  &__hollow {
    position: absolute;
    display: block;
    border-radius: 50%;
    height: 66%;
    width: 66%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 3px 6px grey;
    z-index: 10;
  }
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    &--col {
      flex-direction: column;
    }
    &--row {
      flex-direction: row;
    }
  }
}
</style>
