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
      <!-- QUADRANT BACKGROUND COLORS (inactive if the positive prop is enabled) -->
      <g v-if="useQuadrantBackground && !positive">
        <polygon
          :points="`${width - width * 0.97},${height - height * 0.90} ${width / 2},${height - height * 0.9} ${width / 2},${height / 2} ${width - width * 0.97},${
            height / 2
          }`"
          :fill="hexToRgb(labels[0].color)"
        />
        <polygon
          :points="`${width / 2},${height - height * 0.90} ${width - width * 0.037},${height - height * 0.90} ${width - width *0.037},${height / 2} ${
            width / 2
          }, ${height / 2}`"
          :fill="hexToRgb(labels[1].color)"
        />
        <polygon
          :points="`${width / 2},${height / 2} ${width - width * 0.037},${
            height / 2
          } ${width - width * 0.037},${height - height * 0.08} ${width / 2},${height - height * 0.08}`"
          :fill="hexToRgb(labels[2].color)"
        />
        <polygon
          :points="`${width / 2},${height / 2} ${
            width / 2
          },${height - height * 0.08} ${width - width * 0.97},${height - height * 0.08} ${width - width * 0.97},${height / 2}`"
          :fill="hexToRgb(labels[3].color)"
        />
      </g>
      <!-- QUADRANT LABELS -->
      <g v-if="!hideLabels && !positive" class="quadrant__labels">
        <!-- Top Left -->
        <text
          :x="width - width * 0.97"
          :y="height - height * 0.94"
          :fill="labels[0].color"
          :font-size="fontSizes.quadrantLabels"
          :font-family="fontFamily"
          :font-weight="900"
        >
          {{ labels[0].name }}
        </text>
        <!-- Top Right -->
        <text
          :x="width - width * 0.037"
          :y="height - height * 0.94"
          :fill="labels[1].color"
          :font-size="fontSizes.quadrantLabels"
          :font-family="fontFamily"
          text-anchor="end"
          :font-weight="900"
        >
          {{ labels[1].name }}
        </text>
        <!-- Bottom Right -->
        <text
          :x="width - width * 0.037"
          :y="height - height * 0.02"
          :fill="labels[2].color"
          :font-size="fontSizes.quadrantLabels"
          :font-family="fontFamily"
          text-anchor="end"
          :font-weight="900"
        >
          {{ labels[2].name }}
        </text>
        <!-- Bottom Left -->
        <text
          :x="width - width * 0.97"
          :y="height - height * 0.02"
          :fill="labels[3].color"
          :font-size="fontSizes.quadrantLabels"
          :font-family="fontFamily"
          :font-weight="900"
        >
          {{ labels[3].name }}
        </text>
      </g>

      <!-- AXIS NAMES -->
      <g class="quadrant__axis__names" v-if="!positive">
        <text
          x="50%"
          :y="height - height * 0.95"
          dominant-baseline="middle"
          text-anchor="middle"
          :font-size="fontSizes.axisLabels > 24 ? 24 : fontSizes.axisLabels"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          {{ yTitle }}
        </text>
        <text
          :y="height / 2"
          :x="width - width * 0.02"
          :font-size="fontSizes.axisLabels > 24 ? 24 : fontSizes.axisLabels"
          dominant-baseline="middle"
          text-anchor="middle"
          :transform="`rotate(90, ${width - width * 0.02}, ${height / 2})`"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          {{ xTitle }}
        </text>
      </g>
      <g class="quadrant__axis__names" v-else>
        <text
          :x="width * 0.1"
          :y="height - height * 0.97"
          dominant-baseline="middle"
          text-anchor="middle"
          :font-size="fontSizes.axisLabels > 24 ? 24 : fontSizes.axisLabels"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          {{ yTitle }}
        </text>
        <text
          :y="height - height * 0.06"
          :x="width - width * 0.05"
          :font-size="fontSizes.axisLabels > 24 ? 24 : fontSizes.axisLabels"
          dominant-baseline="middle"
          text-anchor="end"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          {{ xTitle }}
        </text>
      </g>

      <!-- AXIS LINES -->
      <g class="quadrant__axis" v-if="positive">
        <line
          :x1="width - width * 0.9"
          :y1="height - height * 0.935"
          :x2="width - width * 0.9"
          :y2="height - height * 0.13"
        />
        <line
          :x1="width - width * 0.9"
          :y1="height - height * 0.13"
          :x2="width - width * 0.05"
          :y2="height - height * 0.13"
        />
      </g>
      <g class="quadrant__axis" v-else>
        <line :x1="width / 2" :y1="height - height * 0.92" :x2="width / 2" :y2="height - height * 0.08" />
        <line :x1="width - width * 0.97" :y1="height / 2" :x2="width - width * 0.03" :y2="height / 2" />
      </g>

      <!-- AXIS ARROWS -->
      <g v-if="positive" class="quadrant__axis__arrows">
        <path
          :d="`M${width - width * 0.9} ${height - height * 0.935}, ${width - width * 0.9 - 4} ${height - height * 0.915}, ${
            width -width * 0.9 + 4
          } ${height - height * 0.915}Z`"
          class="axis-arrow"
        />
        <path
          :d="`M${width - width * 0.05} ${height - height * 0.13}, ${
            width - width * 0.05 - 7
          } ${height - height * 0.13 - 4}, ${width - width * 0.05 - 7} ${
            height - height * 0.13 + 4
          }Z`"
          class="axis-arrow"
        />
      </g>
      <g v-if="axisArrows && !positive" class="quadrant__axis__arrows">
        <path
          :d="`M${width / 2} ${height - height * 0.92}, ${width / 2 - 4} ${height - height * 0.9}, ${width / 2 + 4} ${height - height * 0.9}Z`"
          class="axis-arrow"
        />
        <path
          :d="`M${width - width * 0.03} ${height / 2}, ${width - width * 0.038} ${height / 2 - 4}, ${
            width - width * 0.038
          } ${height / 2 + 4}Z`"
          class="axis-arrow"
        />
      </g>

      <!-- CHART BORDER -->
      <g v-if="!axisArrows && !positive" class="quadrant__border">
        <path
          :d="`M24 24, ${width - 24} 24, ${width - 24} ${height - 24}, 24 ${
            height - 24
          }Z`"
        />
      </g>

      <!-- PLOTS -->
      <!-- Plots texts painted first to allow circle pointerover events -->
      <g
        v-for="(dataset, k) in datasets"
        :key="`dataset_text_${k}`"
        class="quadrant__dataset__texts"
      >
        <g
          v-for="(item, i) in dataset.series"
          :key="`plot_text_${i}`"
          class="quadrant__plots__texts"
        >
          <text
            v-if="!positive && (showNames || isPlotSelected(plot(item)))"
            :x="plot(item).x + 5 + getRadius(dataset, plot(item))"
            :y="
              plot(item).y +
              3 +
              (isPlotSelected(plot(item))
                ? getRadius(dataset, plot(item)) * 2
                : 0)
            "
            :font-size="fontSizes.plotLabels"
            :font-weight="isPlotSelected(plot(item)) ? '900' : '400'"
            :font-family="fontFamily"
            :fill="
              dark ? (isPlotSelected(plot(item)) ? 'white' : 'grey') : 'black'
            "
            :style="`z-index:0; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}`"
          >
            {{ item[2] ? item[2] : dataset.name }}
          </text>
          <text
            v-if="positive && (showNames || isPlotSelected(plot(item)))"
            :x="plot(item).x"
            :y="plot(item).y - getRadius(dataset, plot(item)) - 4"
            :font-size="fontSizes.plotLabels"
            text-anchor="middle"
            :font-weight="isPlotSelected(plot(item)) ? '900' : '400'"
            :font-family="fontFamily"
            :fill="
              dark ? (isPlotSelected(plot(item)) ? 'white' : 'grey') : 'black'
            "
            :style="`z-index:0; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}`"
          >
            {{ dataset.name }}
          </text>
          <!-- PLOT INFO SHOWN ON PLOT HOVER -->
          <transition name="fade" v-if="!showTooltip">
            <g
              v-if="isPlotSelected(plot(item)) && !positive"
              class="quadrant__plot__information"
            >
              <!-- X value displayed on X axis -->
              <text
                :x="plot(item).x"
                :y="height / 2 + (item[1] > 0 ? fontSizes.plotCoordinates : -fontSizes.plotCoordinates / 2)"
                :font-size="fontSizes.plotCoordinates"
                font-weight="900"
                text-anchor="middle"
                :fill="dark ? 'white' : 'black'"
                :font-family="fontFamily"
              >
                {{ item[0] }}
              </text>
              <!-- Y value displayed on X axis -->
              <text
                :x="width / 2 + (item[0] > 0 ? -fontSizes.plotCoordinates : fontSizes.plotCoordinates)"
                :y="plot(item).y + 3"
                :font-size="fontSizes.plotCoordinates"
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
                stroke-dasharray="4 2"
                class="dashed-line"
              />
              <!-- Dotted line connecting plot to Y axis -->
              <line
                :x1="plot(item).x"
                :y1="plot(item).y"
                :x2="plot(item).x"
                :y2="height / 2"
                stroke-dasharray="4 2"
                class="dashed-line"
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

            <g
              v-if="isPlotSelected(plot(item)) && positive"
              class="quadrant__plot__information"
            >
              <!-- X value displayed on X axis -->
              <text
                :x="plot(item).x"
                :y="height - height * 0.095"
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
                :x="width - width * 0.92"
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
                :x2="width - width * 0.9"
                :y2="plot(item).y"
                stroke-dasharray="4 1"
              />
              <!-- Dotted line connecting plot to Y axis -->
              <line
                :x1="plot(item).x"
                :y1="plot(item).y"
                :x2="plot(item).x"
                :y2="height - height * 0.13"
                stroke-dasharray="4 1"
              />
              <!-- Axis markers -->
              <circle
                :cx="width - width * 0.9"
                :cy="plot(item).y"
                r="1"
                :fill="dark ? 'white' : 'black'"
                class="plot-info"
              />
              <circle
                :cx="plot(item).x"
                :cy="height - height * 0.13"
                r="1"
                :fill="dark ? 'white' : 'black'"
                class="plot-info"
              />
              <!-- Plot X information displayed on bottom middle -->
              <text
                :x="width - width * 0.95"
                :y="height - height * 0.05"
                font-size="9"
                text-anchor="start"
                :fill="dataset.color"
                :font-family="fontFamily"
              >
                {{ xTitle }} : {{ item[0] }}
              </text>
              <!-- Plot Y information displayed on bottom middle -->
              <text
                :x="width - width * 0.95"
                :y="height - height * 0.02"
                font-size="9"
                text-anchor="start"
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
      <g
        v-for="(dataset, k) in datasets"
        :key="`dataset_shape_${k}`"
        class="quadrant__dataset__shapes"
      >
        <g
          v-for="(item, i) in dataset.series"
          :key="`plot_shape_${i}`"
          class="quadrant__plots__shapes"
        >
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
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )} `"
          />
          <!-- REFACTOR as a loop pass dataset to the createPolygon func --->
          <polygon
            v-if="dataset.shape === 'triangle'"
            :points="
              createPolygon(plot(item), getRadius(dataset, plot(item)), 3, 2.6)
            "
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="triangle"
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}`"
          />

          <polygon
            v-if="dataset.shape === 'square'"
            :points="
              createPolygon(plot(item), getRadius(dataset, plot(item)), 4, 2.35)
            "
            class="square"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :style="`z-index:1;  ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}`"
          />

          <polygon
            v-if="dataset.shape === 'pentagon'"
            :points="
              createPolygon(plot(item), getRadius(dataset, plot(item)), 5, 60)
            "
            class="pentagon"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )} `"
          />

          <polygon
            v-if="dataset.shape === 'hexagon'"
            :points="
              createPolygon(plot(item), getRadius(dataset, plot(item)), 6)
            "
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="hexagon"
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name, false, plot(item))}; ${plotSelectionStyle(
              plot(item)
            )} ; fill-rule: nonzero`"
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
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}; fill-rule: nonzero`"
          />
        </g>
      </g>
      <!-- Averages -->
      <template v-if="showAverages">
        <g v-for="(dataset, i) in datasets" :key="`dataset_cluster_${i}`">
          <circle
            v-if="dataset.series.length > minToShowAverage"
            :cx="averages[i].x"
            :cy="averages[i].y"
            :r="dataset.radius ? dataset.radius * 15 : radius * 15"
            :stroke="dataset.color"
            fill="none"
            stroke-dasharray="4 1"
            class="circle"
            :style="`opacity: ${
              isSelected ? '0.05' : '1'
            }; ${datasetSelectionStyle(dataset.name)}`"
          />
        </g>
      </template>
    </svg>
    <!-- LEGEND -->
    <div
      class="quadrant__legend"
      v-if="showLegend"
      :style="`background:${dark ? 'transparent' : 'white'}`"
    >
      <div
        class="quadrant__legend__item"
        v-for="(dataset, i) in datasets"
        :key="`dataset_legend_${i}`"
        @click="showDataset(dataset.name)"
        :style="`${datasetSelectionStyle(dataset.name, true)}`"
      >
        <svg
          :style="`width:20px; height:20px`"
          :viewBox="`0 0 ${dataset.radius ? dataset.radius * 4 : radius * 4} ${
            dataset.radius ? dataset.radius * 4 : radius * 4
          }`"
        >
          <g>
            <circle
              v-if="!dataset.shape || dataset.shape === 'circle'"
              :cx="dataset.radius ? dataset.radius * 2 : radius * 2"
              :cy="dataset.radius ? dataset.radius * 2 : radius * 2"
              :r="dataset.radius ? dataset.radius : radius"
              :fill="dataset.color"
              pointer-events="visiblePainted"
              class="circle"
            />

            <polygon
              v-if="dataset.shape === 'triangle'"
              :points="
                createPolygon(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius,
                  3,
                  2.6
                )
              "
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />

            <polygon
              v-if="dataset.shape === 'square'"
              :points="
                createPolygon(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius,
                  4,
                  2.35
                )
              "
              class="square"
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />

            <polygon
              v-if="dataset.shape === 'pentagon'"
              :points="
                createPolygon(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius,
                  5,
                  60
                )
              "
              class="pentagon"
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />

            <polygon
              v-if="dataset.shape === 'hexagon'"
              :points="
                createPolygon(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius,
                  6
                )
              "
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />

            <polygon
              v-if="dataset.shape === 'star'"
              :points="
                createStar(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius
                )
              "
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />
          </g>
        </svg>
        <div :style="`color:${dark ? 'white' : 'black'}`">
          {{ dataset.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Quadrant",
  props: {
    axisArrows: {
      type: Boolean,
      default: true,
    },
    // Dark mode support
    dark: {
      type: Boolean,
      default: false,
    },
    // This example datasets shows all available shape options
    datasets: {
      type: Array,
      default() {
        return [
          {
            name: "Series 1",
            series: [[2, 4, "item1"],[3,6, "item2"]], // individual plots can display unique names
            color: "blue",
            radius: 4,
            shape: "circle",
          },
          {
            name: "Series 2",
            series: [[-5, 7]],
            color: "red",
            radius: 4,
            shape: "triangle",
          },
          {
            name: "Series 3",
            series: [[-10, -5]],
            color: "green",
            radius: 4,
            shape: "square",
          },
          {
            name: "Series 4",
            series: [[5, 2]],
            color: "purple",
            radius: 4,
            shape: "pentagon",
          },
          {
            name: "Series 5",
            series: [[10, -10]],
            color: "turquoise",
            radius: 4,
            shape: "hexagon",
          },
          {
            name: "Series 6",
            series: [[11, 5]],
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
    fontSizes: {
      type: Object,
      default() {
        return {
          axisLabels: 12,
          plotLabels: 10,
          quadrantLabels: 12,
          plotCoordinates: 12
        }
      },
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
    // Important: use HEX colors
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
    // Dataset length threshold to display average circles. Needs the prop showAverages to be set to true
    minToShowAverage: {
      type: Number,
      default: 5,
    },
    positive: {
      type: Boolean,
      default: false,
    },
    radius: {
      type: Number,
      default: 3,
    },
    // Display a dotted circle which coordinates are the mean of each dataset
    showAverages: {
      type: Boolean,
      default: false,
    },
    showLegend: {
      type: Boolean,
      default: false,
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
    useQuadrantBackground: {
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
      selectedDatasets: this.datasets.map((item) => item.name),
      selectedPlot: [0, 0],
      tooltipContent: "",
    };
  },
  computed: {
    averages() {
      return this.datasets.map((dataset) => {
        const meanX = [];
        const meanY = [];
        dataset.series.forEach((serie) => {
          meanX.push(serie[0]);
          meanY.push(serie[1]);
        });
        const x = meanX.reduce((a, b) => a + b, 0) / meanX.length;
        const y = meanY.reduce((a, b) => a + b, 0) / meanY.length;
        return this.plot([x, y]);
      });
    },
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
    createPolygon(plot, radius, sides, rotation = 0) {
      // refactor: remove lets
      let centerX = plot.x;
      let centerY = plot.y;
      let outerPoints = sides / 2;
      return this.calcPolygonPoints(
        centerX,
        centerY,
        outerPoints,
        radius + 1,
        rotation
      );
    },
    calcPolygonPoints(centerX, centerY, outerPoints, radius, rotation) {
      const angle = Math.PI / outerPoints;
      const angleOffsetToCenter = rotation;
      let points = "";
      for (let i = 0; i < outerPoints * 2; i += 1) {
        let currX =
          centerX + Math.cos(i * angle + angleOffsetToCenter) * radius;
        let currY =
          centerY + Math.sin(i * angle + angleOffsetToCenter) * radius;
        points += `${currX},${currY} `;
      }
      return points;
    },
    createStar(plot, radius) {
      // refactor: remove lets
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
    datasetSelectionStyle(datasetName, isLegend = false) {
      if (this.selectedDatasets.length === 0) {
        return "";
      }
      if (this.selectedDatasets.includes(datasetName)) {
        return "opacity: 1";
      } else {
        if(isLegend){
          return "opacity: 0.3";
        }
        return "opacity: 0.05";
      }
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
    hexToRgb(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `rgba(${parseInt(result[1], 16)},${parseInt(
            result[2],
            16
          )},${parseInt(result[3], 16)},0.1)`
        : hex;
    },
    isPlotSelected(plot) {
      return this.selectedPlot.x === plot.x && this.selectedPlot.y === plot.y;
    },
    plot(tuple) {
      let x, y;
      if (!this.positive) {
        x = ((tuple[0] / this.extremes.x) * this.width) / 2.8 + this.width / 2;
        y =
          (-(tuple[1] / this.extremes.y) * this.height) / 2.6 + this.height / 2;
      } else {
        x =
          ((tuple[0] / this.extremes.x) * this.width) / 1.25 + this.width / 10;
        y =
          (this.height - (tuple[1] / this.extremes.y) * this.height) / 1.3 +
          this.height / 10;
      }
      return { x, y };
    },
    plotSelectionStyle(plot) {
      if (!this.isSelected) {
        return "";
      }
      if (this.isPlotSelected(plot)) {
        // Highlight selected plot & text
        if (this.showTooltip) {
          return "opacity: 0.05 !important";
        }
        return "opacity: 1";
      } else {
        // Dim down all other plots & texts
        return "opacity: 0.05 !important";
      }
    },
    showAverage(plot, name, color) {
      this.selectedPlot = plot;
      this.isSelected = true;
    },
    showDataset(datasetName) {
      if(this.selectedDatasets.includes(datasetName)){
        this.selectedDatasets = this.selectedDatasets.filter((el) => el !== datasetName);
        if(this.selectedDatasets.length === 0){
          this.selectedDatasets = this.datasets.map((item) => item.name)
        }
      }else{
        this.selectedDatasets.push(datasetName);
      }
    },
    showPlot(plot, name, color) {
      if(!this.selectedDatasets.includes(name) && this.selectedDatasets.length){
        return;
      }
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
  mounted() {
    if (this.datasets.length === 1 && this.datasets[0].series.length <= 1) {
      throw `Your datasets must contain at least 2 tuples. You only provided series: [[${this.datasets[0].series}]]`;
    }
    if (!this.datasets) {
      throw "You have not provided a dataset or its format is wrong";
    }
  },
};
</script>

<style lang="scss" scoped>
line,
path {
  stroke-width: 1px;
  stroke: rgba(100, 100, 100, 0.3);
}
.dashed-line{
  animation: dashed 30s linear infinite;
}
@keyframes dashed {
  to {
    stroke-dashoffset: 1000;
  }
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
  transition:  all 0.2s ease-in-out;
}
.quadrant_wrapper {
  width: 100%;
  position: relative;
}
.quadrant,
.quadrant__legend {
  width: 100%;
  max-width: 1000px;
}
.quadrant {
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
  &__legend {
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    column-gap: 12px;
    user-select: none;
    margin-top: -7px;
    padding: 12px;
    &__item {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
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