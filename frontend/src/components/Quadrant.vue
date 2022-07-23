<template>
  <!-- IMPORTANT: to be responsive, this component must be placed in a parent with a width:100% prop-->
  <div
    class="quadrant_wrapper"
    @mousemove="getClientPosition($event)"
    @pointerleave="isSelected = false"
  >
    <!-- TOOLTIP -->
    <transition name="fade">
      <div
        class="quadrant__tooltip"
        ref="tooltip"
        v-if="showTooltip && isSelected"
        :style="tooltipStyle"
        v-html="tooltipContent"
      ></div>
    </transition>

    <svg
      class="quadrant"
      :viewBox="`0 0 ${width} ${height}`"
      :style="quadrantStyle"
    >
      <!-- QUADRANT LABELS -->
      <g v-if="!hideLabels" class="quadrant__labels">
        <!-- Top Left -->
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
        <!-- Top Right -->
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
        <!-- Bottom Right -->
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
        <!-- Bottom Left -->
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
      <g class="quadrant__axis__names">
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
      <g v-if="axisArrows" class="quadrant__axis__arrows">
        <path
          :d="`M${width / 2} 24, ${width / 2 - 4} 30, ${width / 2 + 4} 30Z`"
          class="axis-arrow"
        />
        <path
          :d="`M${width - 24} ${height / 2}, ${width - 30} ${height / 2 - 4}, ${
            width - 30
          } ${height / 2 + 4}Z`"
          class="axis-arrow"
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
      <!-- Plots texts painted first to allow circle pointerover events -->
      <g v-for="(dataset, k) in datasets" :key="`dataset_text_${k}`" class="quadrant__dataset__texts">
        <g v-for="(item, i) in dataset.series" :key="`plot_text_${i}`" class="quadrant__plots__texts">
          <text
            v-if="showNames || isPlotSelected(plot(item))"
            :x="plot(item).x + 5 + getRadius(dataset, plot(item))"
            :y="plot(item).y + 3 + (isPlotSelected(plot(item)) ? getRadius(dataset, plot(item))*2 : 0)"
            font-size="10"
            :font-weight="isPlotSelected(plot(item)) ? '900' : '400'"
            :font-family="fontFamily"
            :fill="
              dark ? (isPlotSelected(plot(item)) ? 'white' : 'grey') : 'black'
            "
            :style="`z-index:0; ${plotSelectionStyle(plot(item))}`"
          >
            {{ dataset.name }}
          </text>
          <!-- PLOT INFO SHOWN ON PLOT HOVER -->
          <transition name="fade" v-if="!showTooltip">
            <g v-if="isPlotSelected(plot(item))" class="quadrant__plot__information">
              <!-- X value displayed on X axis -->
              <text
                :x="plot(item).x"
                :y="height / 2 + (item[1] > 0 ? 12 : -6)"
                font-size="9"
                font-weight="900"
                text-anchor="middle"
                :fill="dark ? 'white' : 'black'"
                :font-family="fontFamily"
              >
                {{ item[0] }}
              </text>
              <!-- Y value displayed on X axis -->
              <text
                :x="width / 2 + (item[0] > 0 ? -10 : 10)"
                :y="plot(item).y + 3"
                font-size="9"
                font-weight="900"
                text-anchor="middle"
                :fill="dark ? 'white' : 'black'"
                :font-family="fontFamily"
              >
                {{ item[1] }}
              </text>
              <!-- Dotted line connecting plot to X axis -->
              <line
                :x1="plot(item).x"
                :y1="plot(item).y"
                :x2="width / 2"
                :y2="plot(item).y"
                stroke-dasharray="4 1"
              />
              <!-- Dotted line connecting plot to Y axis -->
              <line
                :x1="plot(item).x"
                :y1="plot(item).y"
                :x2="plot(item).x"
                :y2="height / 2"
                stroke-dasharray="4 1"
              />
              <!-- Axis markers -->
              <circle
                :cx="width / 2"
                :cy="plot(item).y"
                r="1"
                :fill="dark ? 'white' : 'black'"
                class="plot-info"
              />
              <circle
                :cx="plot(item).x"
                :cy="height / 2"
                r="1"
                :fill="dark ? 'white' : 'black'"
                class="plot-info"
              />
              <!-- Plot X information displayed on bottom middle -->
              <text
                :x="width / 2"
                :y="height - 12"
                font-size="9"
                text-anchor="middle"
                :fill="dataset.color"
                :font-family="fontFamily"
              >
                {{ xTitle }} : {{ item[0] }}
              </text>
              <!-- Plot Y information displayed on bottom middle -->
              <text
                :x="width / 2"
                :y="height - 2"
                font-size="9"
                text-anchor="middle"
                :fill="dataset.color"
                :font-family="fontFamily"
              >
                {{ yTitle }} : {{ item[1] }}
              </text>
            </g>
          </transition>
        </g>
      </g>
      <!-- Plots shapes painted last to allow pointerover events in case of text overlapping -->
      <g v-for="(dataset, k) in datasets" :key="`dataset_shape_${k}`" class="quadrant__dataset__shapes">
        <g v-for="(item, i) in dataset.series" :key="`plot_shape_${i}`" class="quadrant__plots__shapes">
          <circle
            v-if="!dataset.shape || dataset.shape === 'circle'"
            :cx="plot(item).x"
            :cy="plot(item).y"
            :r="getRadius(dataset, plot(item))"
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

          <polygon
            v-if="dataset.shape === 'triangle'"
            :points="createPolygon(plot(item), getRadius(dataset, plot(item)), 3, 2.6)"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="triangle"
            :style="`z-index:1; ${plotSelectionStyle(plot(item))}`"
          />

          <polygon
            v-if="dataset.shape === 'square'"
            :points="createPolygon(plot(item), getRadius(dataset, plot(item)), 4, 2.35)"
            class="square"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :style="`z-index:1; ${plotSelectionStyle(plot(item))}`"
          />

          <polygon
            v-if="dataset.shape === 'pentagon'"
            :points="createPolygon(plot(item), getRadius(dataset, plot(item)), 5, 60)"
            class="pentagon"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :style="`z-index:1; ${plotSelectionStyle(plot(item))}`"
          />

          <polygon
            v-if="dataset.shape === 'hexagon'"
            :points="createPolygon(plot(item), getRadius(dataset, plot(item)), 6)"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="hexagon"
            :style="`z-index:1; ${plotSelectionStyle(
              plot(item)
            )}; fill-rule: nonzero`"
          />

          <polygon
            v-if="dataset.shape === 'star'"
            :points="createStar(plot(item), getRadius(dataset, plot(item)))"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="star"
            :style="`z-index:1; ${plotSelectionStyle(
              plot(item)
            )}; fill-rule: nonzero`"
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
    // Dark mode support
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
              [2,4],
            ],
            color: "blue",
            radius: 4,
            shape: "circle",
          },
          {
            name: "Series 2",
            series: [
              [-5, 7],
            ],
            color: "red",
            radius: 4,
            shape: "triangle",
          },
          {
            name: "Series 3",
            series: [
              [-10, -5],
            ],
            color: "green",
            radius: 4,
            shape: "square",
          },
          {
            name: "Series 4",
            series: [
              [5, 2],
            ],
            color: "purple",
            radius: 4,
            shape: "pentagon",
          },
          {
            name: "Series 5",
            series: [
              [10, -10],
            ],
            color: "turquoise",
            radius: 4,
            shape: "hexagon",
          },
          {
            name: "Series 6",
            series: [
              [11, 5],
            ],
            color: "orange",
            radius: 4,
            shape: "star",
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
      default: "Product Sans",
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
    // Labels for all 4 quadrant sides
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
    // Show text next to plots
    showNames: {
      type: Boolean,
      default: false,
    },
    // Tooltip can have unexpected behaviour if a parent container has padding or margin
    // It is recommended to use the default plot information system
    showTooltip: {
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
  mounted() {
    if (this.datasets.length === 1 && this.datasets[0].series.length <= 1) {
      throw `Your datasets must contain at least 2 tuples. You only provided series: [[${this.datasets[0].series}]]`;
    }
    if (!this.datasets) {
      throw "You have not provided a dataset or its format is wrong";
    }
  },
  computed: {
    extremes() {
      // Retrieve max value on which will be based all plots x and y relative coordinates
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
    createPolygon(plot, radius, sides, rotation = 0){
        let centerX = plot.x;
        let centerY = plot.y;
        let outerPoints = sides / 2;
        return this.calcPolygonPoints(centerX, centerY, outerPoints, radius, rotation)
    },
    calcPolygonPoints(centerX, centerY, outerPoints, radius, rotation){
        const angle = Math.PI / outerPoints;
        const angleOffsetToCenter = rotation;
        let points = "";
        for(let i = 0; i < outerPoints * 2; i += 1){
            let currX = centerX + Math.cos(i * angle + angleOffsetToCenter) * radius;
            let currY = centerY + Math.sin(i * angle + angleOffsetToCenter) * radius;
            points += `${currX},${currY} `;
        } 
        return points;
    },
    createStar(plot, radius) {
      let centerX = plot.x;
      let centerY = plot.y;
      let innerCirclePoints = 5;
      let innerRadius = (radius * 3.5) / innerCirclePoints;
      let innerOuterRadiusRatio = 2;
      let outerRadius = innerRadius * innerOuterRadiusRatio;
      return this.calcStarPoints(
        centerX,
        centerY,
        innerCirclePoints,
        innerRadius,
        outerRadius
      );
    },
    calcStarPoints(
      centerX,
      centerY,
      innerCirclePoints,
      innerRadius,
      outerRadius
    ) {
      const angle = Math.PI / innerCirclePoints;
      const angleOffsetToCenterStar = 60;
      const totalPoints = innerCirclePoints * 2;
      let points = "";
      for (let i = 0; i < totalPoints; i += 1) {
        let isEvenIndex = i % 2 == 0;
        let r = isEvenIndex ? outerRadius : innerRadius;
        let currX = centerX + Math.cos(i * angle + angleOffsetToCenterStar) * r;
        let currY = centerY + Math.sin(i * angle + angleOffsetToCenterStar) * r;
        points += `${currX},${currY} `;
      }
      return points;
    },
    getClientPosition(e) {
      this.clientX = e.offsetX;
      this.clientY = e.offsetY;
    },
    getRadius(dataset, plot) {
      let increase = 1;
      if (this.isPlotSelected(plot)) {
        increase *= 1.5;
      }
      if (dataset.radius) {
        return dataset.radius * increase;
      }
      return this.radius * increase;
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
      if (!this.isSelected) {
        return "";
      }
      if (this.isPlotSelected(plot)) {
        // Highlight selected plot & text
        return "opacity: 1";
      } else {
        // Dim down all other plots & texts
        return "opacity: 0.1";
      }
    },
    showPlot(plot, name, color) {
      this.selectedPlot = this.plot(plot);
      this.isSelected = true;
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
  },
};
</script>

<style lang="scss" scoped>
line,
path {
  stroke-width: 1px;
  stroke: rgba(100, 100, 100, 0.3);
}
path.axis-arrow {
  fill: rgb(224, 224, 224);
}
path.triangle,
path.square {
  stroke: none;
}
.circle,
polygon {
  z-index: 100;
  opacity: 0.75;
  transition: all 0.1s ease-in-out;
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