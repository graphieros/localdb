<template>
  <!-- IMPORTANT: to be responsive, this component must be placed in a parent with a width:100% prop-->
  <div
    class="quadrant_wrapper"
    @mousemove="getClientPosition($event)"
    @pointerleave="isSelected = false"
  >
    <!-- TOOLTIP -->
    <!-- <transition name="fade">
            <div
                class="quadrant__tooltip"
                ref="tooltip"
                v-show="isSelected"
                :style="tooltipStyle"
                v-html="tooltipContent"
            ></div>
        </transition> -->

    <svg
      class="quadrant"
      :viewBox="`0 0 ${width} ${height}`"
      :style="quadrantStyle"
    >
      <!-- QUADRANT LABELS -->
      <g v-if="!hideLabels">
        <text
          x="24"
          y="16"
          :fill="labels[0].color"
          :font-size="fontSize - 3"
          :font-family="fontFamily"
          :font-weight="900"
        >
          {{ labels[0].name }}
        </text>
        <text
          :x="width - 24"
          y="16"
          :fill="labels[1].color"
          :font-size="fontSize - 3"
          :font-family="fontFamily"
          text-anchor="end"
          :font-weight="900"
        >
          {{ labels[1].name }}
        </text>
        <text
          :x="width - 24"
          :y="height - 10"
          :fill="labels[2].color"
          :font-size="fontSize - 3"
          :font-family="fontFamily"
          text-anchor="end"
          :font-weight="900"
        >
          {{ labels[2].name }}
        </text>
        <text
          x="24"
          :y="height - 10"
          :fill="labels[3].color"
          :font-size="fontSize - 3"
          :font-family="fontFamily"
          :font-weight="900"
        >
          {{ labels[3].name }}
        </text>
      </g>

      <!-- AXIS NAMES -->
      <g>
        <text
          x="50%"
          y="12"
          dominant-baseline="middle"
          text-anchor="middle"
          :font-size="fontSize > 24 ? 24 : fontSize"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
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
          :fill="dark ? 'grey' : fontColor"
        >
          {{ xTitle }}
        </text>
      </g>

      <!-- AXIS LINES -->
      <g class="quadrant__axis">
        <line :x1="width / 2" :y1="24" :x2="width / 2" :y2="height - 24" />
        <line :x1="24" :y1="height / 2" :x2="width - 24" :y2="height / 2" />
      </g>

      <!-- AXIS ARROWS -->
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

      <!-- CHART BORDER -->
      <g v-if="!axisArrows" class="quadrant__border">
        <path
          :d="`M24 24, ${width - 24} 24, ${width - 24} ${height - 24}, 24 ${
            height - 24
          }Z`"
        />
      </g>

      <!-- PLOTS -->
      <g v-for="(dataset, k) in datasets" :key="`dataset_text_${k}`">
        <g v-for="(item, i) in dataset.series" :key="`plot_text_${i}`">
          <text
            v-if="showNames || isPlotSelected(plot(item))"
            :x="plot(item).x + 8"
            :y="plot(item).y + 3"
            font-size="10"
            :font-family="fontFamily"
            :fill="dark ? 'grey' : 'black'"
            :style="`z-index:0; ${plotSelectionStyle(plot(item))}`"
          >
            {{ dataset.name }}
          </text>
          <!-- TOOLTIP FALLBACK -->
          <g v-if="isPlotSelected(plot(item))">
            <text
              :x="plot(item).x"
              :y="height / 2 + (item[1] > 0 ? 12 : -6)"
              font-size="9"
              font-weight="900"
              text-anchor="middle"
              :fill="dark ? 'grey' : 'black'"
            >
              {{ item[0] }}
            </text>
            <text
              :x="width / 2 + (item[0] > 0 ? -10 : 10)"
              :y="plot(item).y + 3"
              font-size="9"
              font-weight="900"
              text-anchor="middle"
              :fill="dark ? 'grey' : 'black'"
            >
              {{ item[1] }}
            </text>
            <line
              :x1="plot(item).x"
              :y1="plot(item).y"
              :x2="width / 2"
              :y2="plot(item).y"
              stroke-dasharray="4 1"
            />
            <line
              :x1="plot(item).x"
              :y1="plot(item).y"
              :x2="plot(item).x"
              :y2="height / 2"
              stroke-dasharray="4 1"
            />
            <text
              :x="width / 2"
              :y="height - 12"
              font-size="9"
              text-anchor="middle"
              :fill="dark ? 'grey' : 'black'"
            >
              {{ xTitle }} : {{ item[0] }}
            </text>
            <text
              :x="width / 2"
              :y="height - 2"
              font-size="9"
              text-anchor="middle"
              :fill="dark ? 'grey' : 'black'"
            >
              {{ yTitle }} : {{ item[1] }}
            </text>
          </g>
        </g>
      </g>
      <g v-for="(dataset, k) in datasets" :key="`dataset_circle_${k}`">
        <g v-for="(item, i) in dataset.series" :key="`plot_circle_${i}`">
          <circle
            :cx="plot(item).x"
            :cy="plot(item).y"
            :r="dataset.radius ? dataset.radius : radius"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="circle"
            :style="`z-index:1; ${plotSelectionStyle(plot(item))}`"
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
    dark: {
      type: Boolean,
      default: false,
    },
    datasets: {
      type: Array,
      default() {
        return [
          {
            name: "Series 1",
            series: [
              [0, 0],
              [1, 1],
            ],
            color: "blue",
            radius: 2,
          },
          {
            name: "Series 2",
            series: [
              [-0.5, 0.7],
              [0.3, -0.5],
            ],
            color: "red",
            radius: 2,
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
    hideLabels: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: Array,
      default() {
        return [
          {
            name: "Top left",
            color: "#F17171",
          },
          {
            name: "Top right",
            color: "#15B300",
          },
          {
            name: "Bottom right",
            color: "#6376DD",
          },
          {
            name: "Bottom left",
            color: "#616772",
          },
        ];
      },
    },
    radius: {
      type: Number,
      default: 3,
    },
    showNames: {
      type: Boolean,
      default: false,
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
      selectedPlot: [0, 0],
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
          allX.push(Math.abs(item[0]));
          allY.push(Math.abs(item[1]));
        });
      });
      const x = Math.max(...allX);
      const y = Math.max(...allY);
      return { x, y };
    },
    quadrantStyle() {
      return `
                background: ${this.dark ? "transparent" : "white"};
            `;
    },
    tooltipStyle() {
      return `
            font-family: ${this.fontFamily};
            top: ${this.clientY + 20}px;
            left: ${this.clientX - 100}px;
        `;
    },
  },
  methods: {
    delayTooltip() {
      this.isSelected = true;
    },
    getClientPosition(e) {
      this.clientX = e.offsetX;
      this.clientY = e.offsetY;
    },
    getMousePosition(e) {
      console.log(e); // this sucks a lot
      this.clientX = e.pageX;
      this.clientY = e.pageY + 12;
    },
    isPlotSelected(plot) {
      return this.selectedPlot.x === plot.x && this.selectedPlot.y === plot.y;
    },
    plot(tuple) {
      let x =
        ((tuple[0] / this.extremes.x) * this.width) / 2.8 + this.width / 2;
      let y =
        (-(tuple[1] / this.extremes.y) * this.height) / 2.6 + this.height / 2;
      return { x, y };
    },
    plotSelectionStyle(plot) {
      const { x, y } = plot;
      if (!this.isSelected) {
        return "";
      }
      if (x === this.selectedPlot.x && y === this.selectedPlot.y) {
        return "opacity: 1";
      } else {
        return "opacity: 0.1";
      }
    },
    showPlot(plot, name, color) {
      this.selectedPlot = this.plot(plot);
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout();
      const labelX = `${this.xTitle} : <strong>${plot[0]}</strong>`;
      const labelY = `${this.yTitle} : <strong>${plot[1]}</strong>`;
      this.tooltipContent = `
        <div style="align-items:center; justify-content:center">
            <div style="display:flex;align-items:center;justify-content:center; margin-bottom:6px"> <div class="quadrant__tooltip__dot" style="background:${color}; display: block; height:12px; width:12px; border-radius:50%; margin-right: 6px;"></div>${name}</div>
        
            <div style="display: flex; flex-direction: column; align-items:start;text-align:left; width:100%">
                <span style="text-align:left;">${labelX}</span>
                <span>${labelY}</span>
            </div>
        </div>
      `;
    },
    tooltipTimeout() {
      return setTimeout(this.delayTooltip, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
line,
path {
  stroke-width: 1px;
  stroke: rgba(100, 100, 100, 0.3);
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
  r: 6; /** this prop can be marked as unknown by the IDE but it works */
}
text {
  cursor: default;
}
.quadrant_wrapper {
  width: 100%;
  position: relative;
}
.quadrant {
  width: 100%;
  max-width: 1000px;
  position: relative;
  &__axis {
    line {
      stroke: rgb(182, 182, 182);
    }
  }
  &__border {
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
    color: black !important;
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
