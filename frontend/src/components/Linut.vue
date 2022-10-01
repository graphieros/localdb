<template>
    <div style="width: 100%">
        <!-- TOOLTIP type line -->
        <div 
            v-if="isTooltip && hasTooltip && isLine" 
            :style="`top:${clientY + 20}px; left:${!showDonutTooltip ? clientX : clientX - 112}px; font-family:${fontFamily}`" 
            :class="{'linut__tooltip': !showDonutTooltip, 'linut__donut': showDonutTooltip}"
        >
            <b v-if="xLabels && xLabels.length && !showDonutTooltip">
            {{ xLabels[selectedIndex] }}
            </b>
            <hr v-if="xLabels && xLabels.length && !showDonutTooltip"/>

            <template v-if="showDonutTooltip">
                <svg class="linut__tooltip__donut" width="90px" viewBox="0 0 100 100" style="overflow: visible;">
                    <foreignObject
                        :x="0"
                        :y="0"
                        height="100%"
                        width="100%"
                        :style="'overflow: visible;'"
                    >
                        <div
                            :style="
                                `
                                align-items: center;
                                border-radius: 50%; font-weight: bold;
                                color: black;
                                display: flex;
                                flex-direction: column;
                                font-size:16px;
                                height: 100%;
                                justify-content: center;
                                overflow: visible;
                                text-align: center;
                                width:100%;
                                margin-top: -60px;
                                margin-left: -20px;
                                `
                            "
                        >
                            <span style="font-size:1em; line-height: 1em;">
                                {{ xLabels[selectedIndex] }}
                            </span>

                        </div>
                    </foreignObject>

                    <path
                        v-for="(arc, j) in makeDonut(
                            createDonutSerie(selectedSeries),
                            30,
                            30,
                            60,
                            60
                        )"
                        :key="`arc_${j}`"
                        :d="arc.path"
                        :stroke="arc.color"
                        :stroke-width="50"
                        @click="segregate(j)"
                        style="cursor:pointer; fill:none;"
                    />
                    <!-- MARKERS -->

                    <foreignObject
                        id="markers"
                        v-for="(arc, k) in makeDonut(
                            createDonutSerie(selectedSeries),
                            35,
                            35,
                            60,
                            60
                        )"
                        :key="`arc_marker_${k}`"
                        :x="arc.center.endX"
                        :y="arc.center.endY"
                        :height="30"
                        :width="30"
                        style="overflow: visible"
                    >
                        <div
                            v-if="arc.proportion * 100 > 5"
                            :style="
                                `
                                align-items:center; 
                                background:white; 
                                border-radius: 50%; 
                                box-shadow: 0 3px 6px rgba(0,0,0,0.31);
                                color: black; 
                                display: block; 
                                display: flex; 
                                font-size:1em; 
                                font-weight: bold; 
                                height: 40px !important; 
                                justify-content:center; 
                                margin-left:-28px; 
                                margin-top:-28px; 
                                padding: 12px; 
                                width: 40px !important; 
                                z-index:100;
                                `
                            "
                        >
                            {{ (arc.proportion * 100).toFixed(0) }}%
                        </div>
                    </foreignObject>
                </svg>
            </template>

            <template v-else>
                <div v-for="(serie,i) in selectedSeries" class="linut__tooltip__item" :key="`serie_${i}`">
                    <span class="linut__legend__marker--tooltip" :style="`color:${serie.color}`">       	
                        &#9679;
                    </span>
                    <span>
                        {{ serie.name }} :<b>&nbsp;{{ serie.data }}</b>&nbsp;({{ serie.ratio.toFixed(1) }}%)
                    </span>
            </div>
            </template>
        </div>


        <svg class="linut" ref="svgLine" width="100%" :viewBox="`0 0 ${width} ${height}`" :style="`font-family:${fontFamily}`">
            <g class="linut__amenities">
                <g class="linut__title" v-if="title">
                    <text text-anchor="middle" :x="width / 2" :y="12" font-weight="bold" font-size="14">
                        {{ title }}
                    </text>
                </g>

                <foreignObject :x="0" :y="16" width="100%" height="30px">
                     <div class="linut__controls">
                        <label for="checkbox" class="linut__controls__label linut__controls__label--left">
                            Donuts
                        </label>
                        <label class="linut__switch">
                            <input type="checkbox" name="checkbox" v-model="isLine" :checked="isLine">
                            <span class="linut__slider"></span>
                        </label>
                        <label for="checkbox" class="linut__controls__label linut__controls__label--right">
                            Lines
                        </label>

                    </div>
                </foreignObject>

                <line
                    v-if="isLine || (!isLine && min >= 0)"
                    class="linut__mid-axis"
                    :x1="xMargin"
                    :x2="width"
                    :y1="midCoordinate"
                    :y2="midCoordinate"
                />

                <g class="linut__yAxis">
                    <line class="linut__axis" :x1="xMargin" :x2="xMargin" :y1="maxCoordinate" :y2="minCoordinate" />
                    <circle class="linut__tick" :cx="xMargin" :cy="maxCoordinate" r="1" />
                    <text v-if="isLine" :x="xMargin - 6" :y="maxCoordinate + 2" text-anchor="end" :font-size="8" font-weight="bold">
                        {{ max }}
                    </text>
                    <!-- <text :x="xMargin - 6" :y="midCoordinate + 2" text-anchor="end" :font-size="8" font-weight="bold">
                        0
                    </text> -->
                    <text v-if="isLine" :x="xMargin - 6" :y="minCoordinate + 2" text-anchor="end" :font-size="8" font-weight="bold">
                        {{ min }}
                    </text>
                    <circle class="linut__tick" :cx="xMargin" :cy="minCoordinate" r="1" />
                </g>

                <g class="linut__xTicks" v-if="showGrid">
                    <line v-for="(_xTick, i) in maxSeriesLength" class="linut__grid"
                        :key="`tick_${i}`"
                        :x1="((width - xMargin) * i) / maxSeriesLength + xMargin"
                        :x2="((width - xMargin) * i) / maxSeriesLength + xMargin" :y1="maxCoordinate" :y2="minCoordinate" />
                </g>

                <g class="linut__xLabels" v-if="showXLabels">
                    <text v-for="(_xLabel, i) in maxSeriesLength" text-anchor="middle"
                        :key="`xLabel_${i}`"
                        :x="((width - xMargin) * i) / maxSeriesLength + xMargin + ((width - xMargin) / maxSeriesLength / 2)"
                        :y="height - legendMargin + 16" font-size="8">
                        {{ xLabels[i] }}
                    </text>
                </g>
            </g>

            <g class="linut__plots" v-if="isLine">
                <g v-for="(serie, i) in plots" :key="`serie_plot_${i}`">
                    <g v-for="(plot,k) in serie.data" :key="`plot_circle_${i}_${k}`" @pointerenter="showTooltip(i)" @pointerleave="hideTooltip">
                        <circle
                        v-if="plot.value !== null && showPlots && !segregated.includes(i)"
                        class="linut__plot"
                        :cx="plot.x + (width - xMargin) / maxSeriesLength / 2"
                        :cy="plot.y"
                        :fill="serie.color"
                        :r="2"
                        />
                    </g>
                    <g v-for="(plot, k) in serie.data" :key="`plot_line_${i}_${k}`">
                        <line
                        class="linut__plot-line"
                        v-if="
                            k < serie.data.length - 1 &&
                            plot.value !== null &&
                            serie.data[k + 1].value !== null && !segregated.includes(i)
                        "
                        :x1="plot.x + (width - xMargin) / maxSeriesLength / 2"
                        :x2="serie.data[k + 1].x + (width - xMargin) / maxSeriesLength / 2"
                        :y1="plot.y"
                        :y2="serie.data[k + 1].y"
                        :stroke="serie.color"
                        />
                    </g>
                    <g v-if="showPlotLabels && !segregated.includes(i)">
                        <g v-for="(plot,k) in serie.data" :key="`plot_label_${i}_${k}`">
                        <g v-if="plot.value !== null" @pointerenter="showTooltip(k)" @pointerleave="hideTooltip">
                            <rect
                                class="linut__plot-label__wrapper" 
                                rx="5" 
                                :x="plot.x - (applyMinSize(plot.value.toString().length * 7, 10) / 2) + ((width - xMargin) / maxSeriesLength / 2)" 
                                :y="plot.y - 5"
                                :width="applyMinSize(plot.value.toString().length * 7, 10)" 
                                :height="10" 
                                :fill="serie.color"
                            />
                            <rect
                                class="linut__plot-label__wrapper--inside" 
                                rx="5" 
                                :x="(plot.x - (applyMinSize(plot.value.toString().length * 7, 10) / 2)) + 1 + ((width - xMargin) / maxSeriesLength / 2)" 
                                :y="plot.y - 4" 
                                :width="applyMinSize(plot.value.toString().length * 7, 10) - 2" 
                                :height="8" 
                                fill="white"
                            />
                            <text 
                                class="linut__plot-label" 
                                :x="plot.x + ((width - xMargin) / maxSeriesLength / 2)" 
                                :y="plot.y + 2.5" 
                                text-anchor="middle"
                                >
                                {{ plot.value }}
                            </text>
                            </g>
                        </g>
                    </g>

                </g>
            </g>

            <g v-if="!isLine">
                <g v-for="(donut, i) in donutDataset" :key="`donut_view_${i}`">
                    <g>
                        <line
                        class="linut__plot-line"
                        v-if="
                            i < donutDataset.length - 1 &&
                            donut.total &&
                            donutDataset[i + 1].total !== null
                        "
                        :x1="((width - xMargin) * i) / maxSeriesLength + xMargin + (((width - xMargin)) / maxSeriesLength / 2) "
                        :x2="((width - xMargin) * (i+1)) / maxSeriesLength + xMargin + (((width - xMargin)) / maxSeriesLength / 2) "
                        :y1="(minCoordinate - ((width - xMargin) / maxSeriesLength / 2 - 2)) - ((donut.total / maxDonutData) * (graphicHeight - ((width - xMargin) / maxSeriesLength / 2 + 4)))"
                        :y2="(minCoordinate - ((width - xMargin) / maxSeriesLength / 2 - 2)) - ((donutDataset[i+1].total / maxDonutData) * (graphicHeight - ((width - xMargin) / maxSeriesLength / 2 + 4)))"
                        stroke="#aaa"
                        />
                    </g>

                    <g v-if="donut.total">
                       <path
                        v-for="(arc, j) in makeDonut(
                            donut,
                            ((width - xMargin) * i) / maxSeriesLength + xMargin + (((width - xMargin)) / maxSeriesLength / 2) ,
                            (minCoordinate - ((width - xMargin) / maxSeriesLength / 2 - 2)) - ((donut.total / maxDonutData) * (graphicHeight - ((width - xMargin) / maxSeriesLength / 2 + 4))),
                            (width - xMargin) / maxSeriesLength / 2 - 4,
                            (width - xMargin) / maxSeriesLength / 2 - 4
                        )"
                        :key="`arc_${j}`"
                        :d="arc.path"
                        :stroke="arc.color"
                        :stroke-width="5"
                        style="cursor:pointer; fill:none;"
                        />
                        <circle
                          :cx="((width - xMargin) * i) / maxSeriesLength + xMargin + (((width - xMargin)) / maxSeriesLength / 2)"
                          :cy="(minCoordinate - ((width - xMargin) / maxSeriesLength / 2 - 2)) - ((donut.total / maxDonutData) * (graphicHeight - ((width - xMargin) / maxSeriesLength / 2 + 4)))"
                          :r="(width - xMargin) / maxSeriesLength / 2 - 6"
                          fill="white"
                        />
                    </g>
                    
                    <text
                        :x="((width - xMargin) * i) / maxSeriesLength + xMargin + (((width - xMargin)) / maxSeriesLength / 2)"
                        :y="(minCoordinate - ((width - xMargin) / maxSeriesLength / 2 - 2)) - ((donut.total / maxDonutData) * (graphicHeight - ((width - xMargin) / maxSeriesLength / 2 + 4))) - (((width - xMargin) / maxSeriesLength / 2))"
                        text-anchor="middle"
                        font-size="7"
                        font-weight="bold"
                    >
                        {{ donut.total.toFixed(0).toLocaleString() }}
                    </text>
                </g>
            </g>

            <g v-if="showLegend">
                <foreignObject :x="0" :y="height - legendMargin/2" width="100%" :height="`${legendMargin}px`">
                    <div class="linut__legend__wrapper">
                    <div v-for="(legend, i) in dataset" :key="`legend_${i}`" @click="segregate(i)" :class="{'linut__legend__item' : true, 'linut__legend__item--segregated': segregated.includes(i)}">
                        <span class="linut__legend__marker" :style="`color:${legend.color}`">       	
                        &#9679;
                        </span>
                        <span class="linut__legend__label">  
                        {{ legend.name }}
                        </span>
                    </div>
                    </div>
                </foreignObject>
            </g>
        </svg> 
    </div>
    
</template>

<script >
export default {
  name: "Linut",
  props: {
    dataset: {
      type: Array,
      default() {
        return [
          {
            id: "01",
            name: "Positive",
            color: "#15B300",
            data: [0.1, 23, 12, 10, 23, 2, 18, 20, 21, 14, 12, 20],
          },
          {
            id: "02",
            name: "Negative",
            color: "#F17171",
            data: [0, 13, 3, 2, 1, 1.3, 2, 3, 5, 1, 2, 3],
          },
          {
            id: "03",
            name: "Neutral",
            color: "#ccc",
            data: [0, 0.2, 1, 4, 5, 3, 4, 5, 8, 3, 2, 3],
          },
          {
            id: "04",
            name: "Mixed",
            color: "#ebc034",
            data: [0, 1, 3.5, 1.3, 4, 7, 5, 8, 3, 9, 11, 2],
          },
        ];
      },
    },
    fontFamily: {
      type: String,
      default: "Product Sans",
    },
    showDonutTooltip: {
      type: Boolean,
      default: true,
    },
    showGrid: {
      type: Boolean,
      default: true,
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
    showPlotLabels: {
      type: Boolean,
      default: true,
    },
    showPlots: {
      type: Boolean,
      default: true,
    },
    hasTooltip: {
      type: Boolean,
      default: true,
    },
    showXLabels: {
      type: Boolean,
      default: true,
    },
    showYLabels: {
      type: Boolean,
      default: true,
    },
    sizeRatio: {
      type: Number,
      default: 0.618,
    },
    title: {
      type: String,
      default: "Title",
    },
    xLabels: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isLine: true,
      isTooltip: false,
      width: 300,
      height: 300 * this.sizeRatio,
      legendMargin: this.showLegend ? 40 : 0,
      titleMargin: this.title ? 50 : 0,
      xMargin: this.showXLabels ? 30 : 0,
      clientX: 0,
      clientY: 0,
      segregated: [],
      selectedIndex: undefined,
      selectedSeries: [],
    };
  },
  created() {
    window.addEventListener("pointermove", (e) => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    });
  },
  destroyed() {
    window.removeEventListener("pointermove", (e) => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    });
  },
  computed: {
    donutDataset() {
      const arr = [];
      for (let i = 0; i < this.maxSeriesLength; i += 1) {
        let sumAtIndex = this.dataset
          .flatMap((serie) => {
            return serie.data[i];
          })
          .reduce((a, b) => Math.abs(a) + Math.abs(b), 0);

        if (sumAtIndex === 0) {
          sumAtIndex = 1;
        }
        arr.push(
          this.createDonutSerie(
            this.dataset
              .map((serie) => {
                return {
                  ...serie,
                  data: serie.data[i],
                  ratio: (Math.abs(serie.data[i]) / sumAtIndex) * 100,
                };
              })
              .filter((_serie, i) => {
                return !this.segregated.includes(i);
              })
          )
        );
      }
      return arr;
    },
    maxDonutData() {
      return Math.max(...this.donutDataset.map(({ total }) => total));
    },
    max() {
      return this.getMax(this.dataset);
    },
    min() {
      return this.getMin(this.dataset);
    },
    maxCoordinate() {
      return this.titleMargin;
    },
    minCoordinate() {
      return this.height - this.legendMargin;
    },
    graphicHeight() {
      return this.minCoordinate - this.maxCoordinate;
    },
    minProportion() {
      return Math.abs(this.min) / this.graphicHeight;
    },
    maxProportion() {
      return Math.abs(this.max) / this.graphicHeight;
    },
    minMaxTotalProportion() {
      return this.minProportion + this.maxProportion;
    },
    maxNormalProportion() {
      return this.maxProportion / this.minMaxTotalProportion;
    },
    midCoordinate() {
      return this.maxCoordinate + this.graphicHeight * this.maxNormalProportion;
    },
    maxSeriesLength() {
      return this.calcMax(this.dataset);
    },
    plots() {
      return this.dataset.map((serie) => {
        return {
          ...serie,
          data: serie.data.map((value, i) => {
            return {
              value,
              x:
                ((this.width - this.xMargin) * i) / serie.data.length +
                this.xMargin,
              y: this.normalize({
                value,
                midCoordinate: this.midCoordinate,
                max: this.max,
                maxCoordinate: this.maxCoordinate,
              }),
            };
          }),
        };
      });
    },
  },
  methods: {
    // CALCULATORS
    applyMinSize(size, minSize) {
      if (size < minSize) {
        return minSize;
      }
      return size;
    },
    calcMax(serie) {
      return Math.max(
        ...serie.map((s) => {
          return s.data.length;
        })
      );
    },
    getMax(serie) {
      return Math.max(
        ...serie.flatMap((s) => {
          return s.data;
        })
      );
    },
    getMin(serie) {
      return Math.min(
        ...serie.flatMap((s) => {
          return s.data;
        })
      );
    },
    normalize({ value, midCoordinate, max, maxCoordinate }) {
      return midCoordinate - (value / max) * (midCoordinate - maxCoordinate);
    },
    // TOGGLES
    hideTooltip() {
      this.isTooltip = false;
      this.selectedIndex = undefined;
    },
    segregate(index) {
      if (this.segregated.includes(index)) {
        this.segregated = this.segregated.filter((val) => val !== index);
      } else {
        this.segregated.push(index);
      }
      if (this.segregated.length === this.dataset.length) {
        this.segregated = [];
      }
    },
    showTooltip(index) {
      this.isTooltip = true;
      this.selectedIndex = index;
      let sumAtIndex = this.dataset
        .flatMap((serie) => {
          return serie.data[this.selectedIndex];
        })
        .reduce((a, b) => Math.abs(a) + Math.abs(b), 0);

      if (sumAtIndex === 0) {
        sumAtIndex = 1;
      }

      this.selectedSeries = this.dataset
        .map((serie) => {
          return {
            ...serie,
            data: serie.data[this.selectedIndex],
            ratio:
              (Math.abs(serie.data[this.selectedIndex]) / sumAtIndex) * 100,
          };
        })
        .filter((_serie, i) => {
          return !this.segregated.includes(i);
        });
    },
    // UTILS
    sumDonut(donut) {
      return donut.series
        .map((serie) => serie.value)
        .reduce((a, b) => a + b, 0);
    },
    // DONUT GENERATION
    createDonutSerie(source) {
      return {
        id: `donut_${Math.random()}`,
        name: `donut_${Math.random()}`,
        series: source.map(({ name, color, data }) => {
          return {
            name,
            color,
            value: Math.abs(data),
            valueLabel: data,
          };
        }),
        total: source
          .map(({ data }) => data)
          .reduce((a, b) => Math.abs(a) + Math.abs(b), 0),
      };
    },
    addVector([a1, a2], [b1, b2]) {
      return [a1 + b1, a2 + b2];
    },
    matrixTimes([[a, b], [c, d]], [x, y]) {
      return [a * x + b * y, c * x + d * y];
    },
    rotateMatrix(x) {
      return [
        [Math.cos(x), -Math.sin(x)],
        [Math.sin(x), Math.cos(x)],
      ];
    },
    createArc([cx, cy], [rx, ry], [position, ratio], phi) {
      ratio = ratio % (2 * Math.PI);
      const rotMatrix = this.rotateMatrix(phi);
      const [sX, sY] = this.addVector(
        this.matrixTimes(rotMatrix, [
          rx * Math.cos(position),
          ry * Math.sin(position),
        ]),
        [cx, cy]
      );
      const [eX, eY] = this.addVector(
        this.matrixTimes(rotMatrix, [
          rx * Math.cos(position + ratio),
          ry * Math.sin(position + ratio),
        ]),
        [cx, cy]
      );
      const fA = ratio > Math.PI ? 1 : 0;
      const fS = ratio > 0 ? 1 : 0;
      return {
        startX: sX,
        startY: sY,
        endX: eX,
        endY: eY,
        path: `M${sX} ${sY} A ${[
          rx,
          ry,
          (phi / (2 * Math.PI)) * 360,
          fA,
          fS,
          eX,
          eY,
        ].join(" ")}`,
      };
    },
    makeDonut(item, cx, cy, rx, ry) {
      let { series } = item;
      if (!series)
        return {
          ...series,
          proportion: 0,
          ratio: 0,
          path: "",
          startX: 0,
          startY: 0,
          endX: 0,
          center: {},
        };
      const sum = [...series]
        .map((serie) => serie.value)
        .reduce((a, b) => a + b, 0);
      const ratios = [];
      let acc = 0;
      for (let i = 0; i < series.length; i += 1) {
        let proportion = series[i].value / sum;
        const ratio = proportion * (Math.PI * 1.9999); // (Math.PI * 2) fails to display a donut with only one value > 0 as it goes full circle again
        // midProportion & midRatio are used to find the midpoint of the arc to display markers
        const midProportion = series[i].value / 2 / sum;
        const midRatio = midProportion * (Math.PI * 2);
        const { startX, startY, endX, endY, path } = this.createArc(
          [cx, cy],
          [rx, ry],
          [acc, ratio],
          110
        );
        ratios.push({
          ...series[i],
          proportion,
          ratio: ratio,
          path,
          startX,
          startY,
          endX,
          endY,
          center: this.createArc(
            [cx, cy],
            [rx * 1.45, ry * 1.45],
            [acc, midRatio],
            110
          ), // center of the arc, to display the marker. rx & ry are larger to be displayed with a slight offset
        });
        acc += ratio;
      }
      return ratios;
    },
  },
};
</script>

<style lang="scss" scoped>
hr {
  border-top: 1px solid #ccc;
}

.linut {
  background: white;
  border-radius: inherit;
  overflow: visible;
  padding: 5%;
  user-select: none;

  &__axis {
    stroke-width: 0.5;
    stroke: grey;
  }

  &__controls {
    align-items: center;
    display: flex;
    height: 16px;
    justify-content: center;
    &__label {
      font-size: 8px;
      &--left {
        margin-right: -10px;
      }
      &--right {
        margin-left: -10px;
      }
    }
  }

  &__mid-axis,
  &__grid {
    stroke-dasharray: 1;
    stroke-width: 0.3;
    stroke: grey;
  }

  &__legend {
    &__item {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      gap: 3px;
      justify-content: center;

      &--segregated {
        opacity: 0.4;
      }
    }

    &__label {
      font-size: 10px;
    }

    &__marker {
      font-size: 14px;

      &--tooltip {
        font-size: 18px;
      }
    }

    &__wrapper {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
  }

  &__plot-label {
    font-size: 7px;
    font-weight: bold;
  }

  &__switch {
    position: relative;
    display: inline-block;
    width: 54px;
    height: 28px;
    transform: scale(0.4, 0.4);
    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    input + .linut__slider {
      background-color: #6376dd;
    }
    input:focus + .linut__slider {
      box-shadow: 0 0 1px #6376dd;
    }
    input:checked + .linut__slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
  }

  &__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 15px;
    &::before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 50%;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    }
  }

  &__tick {
    fill: grey;
  }

  &__tooltip {
    background: white;
    border-radius: 8px;
    border: 1px solid #eee;
    box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.3);
    display: block;
    padding: 12px;
    position: fixed;
    width: fit-content;
    z-index: 10000;
    &__donut {
      margin-left: 32px;
      margin-top: 32px;
      padding: 6px;
    }
  }
  &__donut {
    align-items: center;
    background: white;
    border-radius: 50%;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    display: flex;
    height: 200px;
    justify-content: center;
    padding: 12px;
    position: fixed;
    width: 200px;
  }
}
</style>
