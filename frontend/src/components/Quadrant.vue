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
        <text
          x="50%"
          y="12"
          dominant-baseline="middle"
          text-anchor="middle"
          :font-size="fontSize > 24 ? 24 : fontSize"
          :font-family="fontFamily"
          :fill="fontColor"
        >
          {{ yTitle }}
        </text>
        <text
          :y="height / 2"
          :x="width - 12"
          :font-size="fontSize > 24 ? 24 : fontSize"
          dominant-baseline="middle"
          text-anchor="middle"
          :transform="`rotate(90, ${width - 12}, ${height / 2})`"
          :font-family="fontFamily"
          :fill="fontColor"
        >
          {{ xTitle }}
        </text>
      </g>
      <g class="quadrant__axis">
        <line :x1="width / 2" :y1="24" :x2="width / 2" :y2="height - 24" />
        <line :x1="24" :y1="height / 2" :x2="width - 24" :y2="height / 2" />
      </g>
      <g v-if="axisArrows">
        <path
          :d="`M${width / 2} 24, ${width / 2 - 4} 30, ${width / 2 + 4} 30Z`"
        />
        <path
          :d="`M${width - 24} ${height / 2}, ${width - 30} ${height / 2 - 4}, ${
            width - 30
          } ${height / 2 + 4}Z`"
        />
      </g>
      <g v-if="!axisArrows" class="quadrant__border">
        <path :d="`M24 24, ${width - 24} 24, ${width - 24} ${height -24}, 24 ${height - 24}Z`"/>
      </g>
      <g v-for="(dataset, k) in datasets" :key="`dataset_${k}`">
        <g v-for="(item, i) in dataset.series" :key="`plot_${i}`">
          <circle
            :cx="plot(item).x"
            :cy="plot(item).y"
            :r="dataset.radius ? dataset.radius : radius"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="
              showPlot(item, dataset.name, dataset.color);
              getMousePosition($event);
            "
            @pointerleave="isSelected = false"
            class="circle"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "Quadrant",
  props: {
    axisArrows: {
        type: Boolean,
        default: false,
    },
    datasets: {
      type: Array,
      default() {
        return [
          {
            name: "",
            series: [],
          },
        ];
      },
    },
    fontColor: {
      type: String,
      default: "#000000",
    },
    fontFamily: {
      type: String,
      default: "Helvetica",
    },
    fontSize: {
      type: Number,
      default: 16,
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
      default: "X axis",
    },
    yTitle: {
      type: String,
      default: "Y axis",
    },
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
      if (!this.datasets) {
        throw "You have not provided a dataset or its format is wrong";
      }
      const allX = [];
      const allY = [];
      this.datasets.forEach((serie) => {
        serie.series.forEach((item) => {
          allX.push(item[0]);
          allY.push(item[1]);
        });
      });
      const x = Math.max(...allX);
      const y = Math.max(...allY);
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
        ((tuple[0] / this.extremes.x) * this.width) / 2.35 + this.width / 2;
      let y =
        (-(tuple[1] / this.extremes.y) * this.height) / 2.6 + this.height / 2;
      return { x, y };
    },
    showPlot(plot, name, color) {
      setTimeout(() => {
        this.isSelected = true;
      }, 100);
      this.selectedPlot = plot;
      const labelX = `${this.xTitle} : <strong>${plot[0]}</strong>`;
      const labelY = `${this.yTitle} : <strong>${plot[1]}</strong>`;
      this.tooltipContent = `
        <div style="align-items:center; justify-content:center">
            <div style="display:flex;align-items:center;justify-content:center; margin-bottom:6px;"> <div class="quadrant__tooltip__dot" style="background:${color}; display: block; height:12px; width:12px; border-radius:50%; margin-right: 6px;"></div>${name}</div>
            <hr style="border: 1px solid #E1E5E8; border-top:none;">
            <div style="display: flex; flex-direction: column; align-items:start; margin-top:6px; text-align:left; width:100%">
                <span style="text-align:left;">${labelX}</span>
                <span>${labelY}</span>
            </div>
        </div>
      `;
    },
  },
};
</script>

<style lang="scss" scoped>
line,
path {
  stroke-width: 1px;
  stroke: rgba(0, 0, 0, 0.1);
}
path {
  fill: rgb(224, 224, 224);
}
.circle {
  z-index: 100;
  opacity: 0.75;
  transition: all 0.1s ease-in-out;
}
circle:hover {
  r: 6;
}
.quadrant_wrapper {
  width: 100%;
  height: fit-content;
}
.quadrant {
  width: 100%;
  background: white;
  max-width: 1000px;
  position: relative;
  &__axis{
    line {
        stroke: rgb(182, 182, 182);
    }
  }
  &__border{
    path {
        fill: none;
    }
  }
  &__tooltip {
    position: absolute;
    display: block;
    z-index: 1;
    padding: 12px 20px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
