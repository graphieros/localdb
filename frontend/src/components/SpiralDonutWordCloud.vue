<template>
  <div class="spiral">
    <svg width="100%" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">
      <g
        v-for="(plot, i) in plots"
        :key="`plot_${i}`"
        :id="`plot_${i}`"
        class="spiral__plot"
        :style="`animation-delay:${50 * i}ms`"
      >
        <g
          v-if="i < sortedDataset.length"
          @click="selectDonut(i, plot)"
          :style="`${
            typeof selectedDonutIndex === 'number' && selectedDonutIndex === i
              ? 'opacity: 1'
              : 'opacity: 0.3'
          }; ${selectedDonutIndex === undefined ? 'opacity: 1' : ''}`"
        >
          <path
            v-for="(arc, j) in selectedDonutIndex === i
              ? makeDonut(
                  sortedDataset[i],
                  plot.x,
                  plot.y,
                  width / 20,
                  width / 20
                )
              : makeDonut(
                  sortedDataset[i],
                  plot.x,
                  plot.y,
                  (getSum(sortedDataset[i]) / max) * 30,
                  (getSum(sortedDataset[i]) / max) * 30
                )"
            :key="`arc_${i}_${j}_${arc.id}`"
            :d="arc.path"
            :stroke="arc.color"
            :stroke-width="selectedDonutIndex === i ? 20 : 5"
          />
          <foreignObject
            :x="plot.x - (getSum(sortedDataset[i]) / max) * 30"
            :y="plot.y - (getSum(sortedDataset[i]) / max) * 30"
            :height="(getSum(sortedDataset[i]) / max) * 60"
            :width="(getSum(sortedDataset[i]) / max) * 60"
            :style="'overflow: visible;'"
          >
            <div
              :style="`
                align-items: center;
                color: black;
                display: flex;
                font-size:${calcFontSize(
                  (getSum(sortedDataset[i]) / max) * 30,
                  sortedDataset[i].verbatim
                )}px;
                font-height:${calcFontSize(
                  (getSum(sortedDataset[i]) / max) * 30,
                  sortedDataset[i].verbatim
                )}px;
                font-weight: bold;
                height: 100%;
                justify-content: center;
                overflow: hidden;
                padding: 0 6px;
                text-align: center;
                text-overflow: ellipsis;
                white-space:nowrap;
                width:${(getSum(sortedDataset[i]) / max) * 60};
                `"
            >
              {{ sortedDataset[i].verbatim }}
            </div>
          </foreignObject>
        </g>
      </g>

      <!-- MARKERS SELECTED DONUT -->
      <template v-if="selectedDonutIndex !== undefined">
        <g @click="unselectDonut" class="spiral__plot--selected">
          <!-- OPAQUE HOLLOW -->
          <circle
            :cx="selectedPlot.x"
            :cy="selectedPlot.y"
            :r="width / 20"
            fill="white"
          />
          <!-- DONUT SEGMENTS SELECTED STATE -->
          <template>
            <path
              v-for="(arc, j) in makeDonut(
                sortedDataset[selectedDonutIndex],
                selectedPlot.x,
                selectedPlot.y,
                width / 20,
                width / 20
              )"
              :key="`arc_${selectedDonutIndex}_${j}`"
              :d="arc.path"
              :stroke="arc.color"
              :stroke-width="20"
            />
          </template>

          <!-- VERBATIM SELECTED STATE -->
          <foreignObject
            :x="selectedPlot.x - 60"
            :y="selectedPlot.y - 60"
            height="120"
            width="120"
            :style="'overflow: visible;'"
            id="selected"
          >
            <div
              :class="{ 'donut-gradient': gradient, 'donut-overlay': overlay }"
              :style="`
                align-items: center;
                border-radius: 50%; 
                font-weight: bold;
                color: black;
                display: flex;
                font-size:1rem;
                height: 100%;
                justify-content: center;
                overflow: visible;
                text-align: center;
                width:100%;
                `"
            >
              <span class="zoomed-verbatim">{{
                sortedDataset[selectedDonutIndex].verbatim
              }}<br>
                <span style="color: #aaa; font-size: 0.8em;">
                  {{ getSum(sortedDataset[selectedDonutIndex]) }}
                </span>
              </span>
            </div>
          </foreignObject>

          <!-- MARKERS DONUT SELECTED STATE -->
          <foreignObject
            id="markers"
            v-for="(arc, k) in makeDonut(
              sortedDataset[selectedDonutIndex],
              selectedPlot.x + 35,
              selectedPlot.y + 35,
              width / 20,
              width / 20
            )"
            :key="`arc_select_${k}`"
            :x="arc.center.endX"
            :y="arc.center.endY"
            :height="width / 20"
            :width="width / 20"
            style="overflow: visible"
          >
            <div
              :style="`
                align-items:center; 
                background:white; 
                border-radius: 50%; 
                box-shadow: 0 3px 6px rgba(0,0,0,0.1);
                color: black; 
                display: block; 
                display: flex; 
                font-size:0.7em; 
                font-weight: bold; 
                height: 35px !important; 
                justify-content:center; 
                margin-left:-55px; 
                margin-top:-52px; 
                padding: 12px; 
                width: 35px !important; 
                z-index:100;
            `"
            >
              <span style="line-height: 10px;">
                {{ (arc.proportion * 100).toFixed(0) }}%
                <br>
                <span style="font-size:0.7em; color:#aaa">
                  {{ Math.round(arc.value) }}
                </span>
              </span>
              
            </div>
          </foreignObject>
        </g>

        <foreignObject width="100%" :height="svgHeight/10" x="0" y="0">
          <div class="spiral__legend">
            <div class="spiral__legend__item" v-for="(legend,i) in sortedDataset[selectedDonutIndex].series" :key="`legend_${i}`">
              <div class="spiral__legend__marker" :style="`color:${legend.color}`">
                &#9679;
              </div>
              {{ legend.name }}: 
              <b style="margin-left:2px;">
                {{ (legend.value / getSum(sortedDataset[selectedDonutIndex]) * 100).toFixed(0) }}%
              </b>
              <span class="spiral__legend__value">
                ( {{ legend.value }} )
              </span>
            </div>
          </div>
        </foreignObject>
      </template>
    </svg>
  </div>
</template>

<script>
export default {
  name: "SpiralDonutWordCloud",
  props: {
    dataset: {
      type: Array,
      default() {
        // The series of each datapoint can be of any size
        // Colors can be specific to each datapoint
        return [
          {
            id: "id1",
            verbatim: "Lorem",
            series: [
              {
                name: "insat",
                value: 3,
                color: "#F17171",
              },
              {
                name: "neutral",
                value: 3,
                color: "#C4C4C4",
              },
              {
                name: "sat",
                value: 3,
                color: "#15B300",
              },
            ],
          },
          {
            id: "id2",
            verbatim: "Ipsum",
            series: [
              {
                name: "insat",
                value: 10,
                color: "#F17171",
              },
              {
                name: "neutral",
                value: 3,
                color: "#C4C4C4",
              },
              {
                name: "sat",
                value: 4,
                color: "#15B300",
              },
            ],
          },
          {
            id: "id3",
            verbatim: "Consectetur",
            series: [
              {
                name: "insat",
                value: 1,
                color: "#F17171",
              },
              {
                name: "neutral",
                value: 2,
                color: "#C4C4C4",
              },
              {
                name: "sat",
                value: 4,
                color: "#15B300",
              },
            ],
          },
        ];
      },
    },
    gradient: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 1000,
    },
    overlay: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 1000,
    },
    wordSizeRatio: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      chord: 13,
      coils: 1,
      plots: [],
      rotation: 1.618 * Math.PI,
      selectedDonutIndex: undefined,
      selectedPlot: undefined,
      svgHeight: this.height,
      svgWidth: this.width,
    };
  },
  created() {
    this.generatePlots();
  },
  mounted() {
    const datasetLength = this.dataset.length;
    let size = 2000;
    // adapt svg dimensions to dataset length to ideally fit spiral size
    switch (true) {
      case datasetLength <= 17:
        size = 400;
        break;
      case datasetLength > 17 && datasetLength <= 30:
        size = 500;
        break;
      case datasetLength > 30 && datasetLength <= 44:
        size = 600;
        break;
      case datasetLength > 44 && datasetLength <= 70:
        size = 750;
        break;
      case datasetLength > 70 && datasetLength <= 100:
        size = 900;
        break;
      case datasetLength > 100 && datasetLength <= 150:
        size = 1100;
        break;
      case datasetLength > 150 && datasetLength <= 200:
        size = 1250;
        break;
      default:
        size = 2000;
        break;
    }

    this.svgWidth = this.svgHeight = size;
    this.plots.forEach((plot) => {
      plot.x -= (1000 - size) / 2;
      plot.y -= (1000 - size) / 2;
    });
  },
  computed: {
    awayStep() {
      return this.svgWidth / 3 / this.thetaMax;
    },
    center() {
      return {
        x: this.svgWidth / 2,
        y: this.svgHeight / 2,
      };
    },
    max() {
      return Math.max(
        ...this.dataset.map((item) =>
          item.series.map((el) => el.value).reduce((a, b) => a + b, 0)
        )
      );
    },
    sortedDataset() {
      return this.dataset
        .map((dset) => {
          return {
            ...dset,
            total: dset.series
              .map((serie) => serie.value)
              .reduce((a, b) => a + b, 0),
          };
        })
        .sort((a, b) => b.total - a.total);
    },
    thetaMax() {
      return this.coils * this.rotation;
    },
  },
  methods: {
    addVector([a1, a2], [b1, b2]) {
      return [a1 + b1, a2 + b2];
    },
    calcFontSize(radius, verbatim) {
      const size = (radius / verbatim.split("").length) * 3;
      return size < this.wordSizeRatio ? size : this.wordSizeRatio;
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
    getSum(item) {
      return item.series.map((el) => el.value).reduce((a, b) => a + b, 0);
    },
    generatePlots() {
      for (let theta = this.chord / this.awayStep; theta <= 30; ) {
        let away = this.awayStep * theta;
        let around = theta * this.rotation;
        let x = this.center.x + Math.cos(around) * away;
        let y = this.center.y + Math.sin(around) * away;
        theta += this.chord / away;
        this.plots.push({ x, y });
      }
      this.plots = [...this.plots].slice(0, this.dataset.length);
    },
    makeDonut(item, cx, cy, rx, ry) {
      let { series } = item;
      series = series.map((el) => {
        return {
          ...el,
          value: el.value === 0 ? 0.00001 : el.value
        }
      })
      const sum = [...series]
        .map((serie) => serie.value)
        .reduce((a, b) => a + b, 0);
      const ratios = [];
      let acc = 0;
      for (let i = 0; i < series.length; i += 1) {
        const proportion = series[i].value / sum;
        const ratio = proportion * (Math.PI * 2);
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
          ratio,
          path,
          startX,
          startY,
          endX,
          endY,
          center: this.createArc(
            [cx, cy],
            [rx * 1.35, ry * 1.35],
            [acc, midRatio],
            110
          ), // center of the arc, to display the marker. rx & ry are larger to be displayed with a slight offset
        });
        acc += ratio;
      }
      return ratios;
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
    selectDonut(index, plot) {
      if (index === this.selectedDonutIndex) {
        this.$nextTick(this.unselectDonut);
      }
      this.$nextTick(() => {
        this.selectedDonutIndex = index;
        this.selectedPlot = plot;
      });
      // expose selected data to parent
      this.$emit("selectVerbatim", {
        selected: this.sortedDataset[index],
      });
    },
    unselectDonut() {
      this.$nextTick(() => {
        this.selectedDonutIndex = undefined;
        this.selectedPlot = undefined;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  transition: all 0.3s ease-in-out;
}
.spiral {
  user-select: none;
  &__legend{
    display: grid;
    flex-wrap: wrap;
    height: 100%;
    justify-content: start;
    column-gap: 24px;
    width: 100%;
    color: black;
    font-size: 12px;
    &__item{
      display: flex;
      flex-direction: row;
      align-items:center;
      justify-content:start;
      height: 18px;
    }
    &__marker{
      margin-right: 6px;
      font-size: 1.5em;
      display: flex;
      align-items:center;
      justify-content: center;
    }
    &__value{
      margin-left: 6px;
      color: #a1a1a1;
      font-size: 0.8em;
    }
  }
  &__plot,
  &__plot--selected {
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  &__plot {
    animation: fade 0.2s ease-in forwards;
    opacity: 0;
  }
}
foreignObject{
  overflow: visible;
}
svg {
  background: white;
  overflow: visible;
  padding: 12px;
}
path {
  fill: none;
}
.zoomed-verbatim {
  text-shadow: 0 5px 20px white;
}
.donut-gradient {
  background: radial-gradient(
    rgba(255, 255, 255, 0.4),
    transparent,
    transparent,
    transparent,
    transparent,
    transparent,
    transparent,
    transparent,
    transparent,
    rgba(255, 255, 255, 0.6),
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.8),
    transparent
  );
}
.donut-overlay {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
