<template>
  <div class="carousel-bar" :style="computedStyle">
    <div
      v-if="chevrons && isOverflow"
      tabindex="0"
      class="carousel-bar__chevrons carousel-bar__chevrons--left"
      :style="chevronStyle"
      @click="scrollTo('left')"
      @keypress.enter="scrollTo('left')"
    >
      <svg :style="svgStyle" :viewBox="iconViewBox">
        <g v-html="htmlIconLeft" />
      </svg>
    </div>
    <div class="carousel-bar__content" ref="carouselContent">
      <slot></slot>
    </div>
    <div
      v-if="chevrons && isOverflow"
      tabindex="0"
      class="carousel-bar__chevrons carousel-bar__chevrons--right"
      :style="chevronStyle"
      @click="scrollTo('right')"
      @keypress.enter="scrollTo('right')"
    >
      <svg :style="svgStyle" :viewBox="iconViewBox">
        <g v-html="htmlIconRight" />
      </svg>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "CarouselBar",
  props: {
    background: {
      type: String,
      default: "transparent",
    },
    border: {
      type: String,
      default: undefined,
    },
    borderRadius: {
      type: String | undefined,
      default: undefined,
    },
    chevrons: {
      type: Boolean,
      default: true,
    },
    chevronColor: {
      type: String,
      default: "grey",
    },
    chevronSize: {
      type: String,
      default: "32px",
    },
    contentBackground: {
      type: String,
      default: "transparent",
    },
    height: {
      type: String,
      default: "80px",
    },
    htmlIconLeft: {
      type: String,
      default:
        "<path fill='currentColor' d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'/>",
    },
    htmlIconRight: {
      type: String,
      default:
        "<path fill='currentColor' d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'/>",
    },
    iconViewBox: {
      type: String,
      default: "0 0 24 24",
    },
    useWidthScroll: {
      type: Boolean,
      default: false,
    },
    scrollStep: {
      type: String | Number,
      default: 200,
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      currentScrollPosition: 0,
      isOverflow: false,
    };
  },
  computed: {
    chevronStyle() {
      return `
            color:${this.chevronColor};
            font-size:${this.chevronSize};
            height:${this.chevronSize};
            width:${this.chevronSize};
        `;
    },
    computedStyle() {
      return `
            background:${this.background};
            border-radius:${this.borderRadius || "none"};
            border:${this.border || "none"};
            height:${this.height};
            width:${this.width};
        `;
    },
    contentStyle() {
      return `
            background:${this.contentBackground};
        `;
    },

    svgStyle() {
      return `
            height:${this.chevronSize};
            width:${this.chevronSize};
        `;
    },
  },
  methods: {
    scrollTo(direction) {
      const carousel = this.$refs.carouselContent;
      const clientRect = carousel.getBoundingClientRect();
      const width = carousel.scrollWidth - clientRect.width;
      const scrollStep = this.useWidthScroll
        ? clientRect.width
        : this.scrollStep;

      if (direction === "right") {
        if (this.currentScrollPosition >= width) {
          this.currentScrollPosition = width;
        } else {
          this.currentScrollPosition += scrollStep;
        }
        carousel.scrollTo({
          left: this.currentScrollPosition,
          behavior: "smooth",
        });
      } else {
        if (this.currentScrollPosition <= 0) {
          this.currentScrollPosition = 0;
        } else {
          this.currentScrollPosition -= scrollStep;
        }
        carousel.scrollTo({
          left: this.currentScrollPosition,
          behavior: "smooth",
        });
      }
    },
    toggleOverflow() {
      const carousel = this.$refs.carouselContent;
      if (carousel) {
        const clientRect = carousel.getBoundingClientRect();
        this.isOverflow = carousel.scrollWidth > clientRect.width;
      }
    },
  },
  created() {
    window.addEventListener("resize", this.toggleOverflow);
  },
  destroyed() {
    window.addEventListener("resize", this.toggleOverflow);
  },
  mounted() {
    this.toggleOverflow();
  },
});
</script>

<style lang="scss" scoped>
.carousel-bar {
  padding: 12px;
  position: relative;
  &__chevrons {
    align-items: center;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.15s ease-in-out;
    &:hover {
      transform: translateY(-50%) scale(1.2, 1.2);
    }
    &--left {
      left: 12px;
    }
    &--right {
      right: 12px;
    }
  }
  &__content {
    align-items: center;
    display: flex;
    gap: 24px;
    height: calc(100% - 24px);
    justify-content: start;
    left: 50%;
    overflow-x: hidden;
    position: absolute;
    transform: translateX(-50%);
    width: calc(100% - 124px);
    div {
      align-items: center;
      border-radius: 8px;
      color: white;
      display: flex;
      height: 100%;
      padding: 3 24px;
    }
  }
}
</style>
