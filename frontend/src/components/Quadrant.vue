<template>
  <div class="quadrant_wrapper">
    <transition name="fade">
      <div
        class="quadrant__tooltip"
        ref="tooltip"
        v-show="isSelected"
        :style="tooltipStyle"
        v-html="tooltipContent"
      ></div>
    </transition>

    <svg class="quadrant" :viewBox="`0 0 ${width} ${height}`">
      <g>
        <line :x1="width / 2" :y1="24" :x2="width / 2" :y2="height - 24" />
        <line :x1="24" :y1="height / 2" :x2="width - 24" :y2="height / 2" />
      </g>
      <circle
        v-for="(item, i) in dataset"
        :key="`plot_${i}`"
        :cx="plot(item).x"
        :cy="plot(item).y"
        :r="radius"
        fill="rgba(0,0,0,0.3)"
        pointer-events="visiblePainted"
        @pointerover="
          showPlot(item);
          getMousePosition($event);
        "
        @pointerleave="isSelected = false"
        class="circle"
      />
    </svg>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Quadrant",
  props: {
    dataset: {
      type: Array,
      default() {
        return undefined;
      },
    },
    height: {
      type: Number,
      default: 300,
    },
    radius: {
      type: Number,
      default: 3,
    },
    width: {
      type: Number,
      default: 500,
    },
    xTitle: {
        type: String,
        default: ""
    },
    yTitle: {
        type: String,
        default: ""
    }
  },
  data() {
    return {
      clientX: 0,
      clientY: 0,
      isSelected: false,
      tooltipContent: "",
    };
  },
  computed: {
    extremes() {
      if (!this.dataset) {
        throw "You have not provided a dataset";
      }
      const x = Math.max(...this.dataset.map((item) => item[0]));
      const y = Math.max(...this.dataset.map((item) => item[1]));
      return { x, y };
    },
    tooltipStyle() {
      return `
            top: ${this.clientY + 20}px;
            left: ${this.clientX - 100}px;
        `;
    },
  },
  methods: {
    getMousePosition(e) {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    },
    plot(tuple) {
      let x =
        ((tuple[0] / this.extremes.x) * this.width) / 2.5 + this.width / 2;
      let y =
        (-(tuple[1] / this.extremes.y) * this.height) / 2.5 + this.height / 2;
      return { x, y };
    },
    showPlot(plot) {
      this.isSelected = true;
      this.selectedPlot = plot;
      this.tooltipContent = this.selectedPlot; // to abstract for formatting
    },
  },
});
</script>

<style lang="scss" scoped>
.quadrant_wrapper {
  width: 100%;
  height: fit-content;
}
.quadrant {
  width: 100%;
  background: white;
  max-width: 800px;
  position: relative;
  &__tooltip {
    position: absolute;
    display: block;
    z-index: 1;
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.11);
    width: 200px;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 0.75rem solid transparent;
      border-top: none;
      border-bottom-color: #fff;
      filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
    }
  }
}
line {
  stroke-width: 1px;
  stroke: rgba(0, 0, 0, 0.1);
}
.circle {
  z-index: 100;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
