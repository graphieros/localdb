<template>
  <svg 
    width="100%" 
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`" 
    :style="`font-family:${fontFamily}; max-width:${maxWidth}px`">
    
    <!-- TITLE, GRID, XAXIS LABEL, TONALITY LEGEND -->
    <g>
      <g v-if="title">
        <text 
          text-anchor="middle" 
          fill="black" 
          :x="svgWidth / 2" 
          :y="padding / 2" 
          font-weight="bold" 
          font-size="1.3em"
          :style="selectedDonut.hasOwnProperty('x') ? 'opacity:0.3' : 'opacity: 1'"
        >
          {{ title }}
        </text>
      </g>

      <g 
        v-for="(gridline,i) in maxDonuts" 
        :key="`gridline_${i}`"
      >
        <line 
          :x1="(i+2) * (svgWidth / (maxDonuts + 2))" 
          :x2="(i+2) * (svgWidth / (maxDonuts + 2))" 
          :y1="padding + 5" 
          :y2="svgHeight - padding" class="gridline"
        />
        <rect 
          :class="{'x-segment--grey': i % 2 === 0, 'x-segment--white' : i % 2 !== 0}" 
          :x="(i+2) * (svgWidth / (maxDonuts +2))" 
          :y="padding + 5" 
          :height="svgHeight - padding * 2 - 5" 
          :width="(maxDonutSize*2 + 5)"
        />
        <foreignObject 
          :x="(i+2) * (svgWidth / (maxDonuts + 2))" 
          :y="svgHeight - 30" 
          :width="svgWidth / (maxDonuts +2)" 
          :height="30"
        >
          <div class="x-label">
            {{ xLabels[i] }}
          </div>
        </foreignObject>
      </g>

      <!-- Tonality legend -->
      <g>
        <foreignObject :x="0" :y="svgHeight - 10" :width="svgWidth" height="30">
          <div class="tonality-legend">
            <div 
              class="tonality-legend__item" 
              v-for="(tonality, i) in tonalities" 
              :key="`tonality-legend_${i}`"
              @click="selectTonality(tonality, i)"
              :style="selectedTonality !== undefined ? selectedTonality === tonality.name ? 'opacity:1;' : 'opacity:0.2;' : 'opacity:1;'"
            >
              <div 
                class="legend-marker" 
                :style="`background:${tonality.color};`"
              />
              <span>
                {{ tonality.name }}
              </span>
            </div>
          </div>
        </foreignObject>
      </g>
    </g>

    <!-- DONUTS LAYOUT -->
    <g 
      v-for="(donutSerie,i) in dataset" 
      :key="`donutSerie_${i}`"
    >

      <!-- Yaxis label -->
      <foreignObject style="overflow: visible;" :x="0" :y="(i+1) * maxDonutSize * 3 - maxDonutSize/2 - padding / 1.5" :height="maxDonutSize * 2 + padding / 2" :width="(svgWidth / (maxDonuts +2) *2) - padding/3">
        <div class="y-label">
          {{ donutSerie.name }}
        </div>
      </foreignObject>

      <!-- Horizontal line passing through all donuts of a serie -->
      <line 
        v-if="!selectedDonut.hasOwnProperty('x')" 
        :x1="svgWidth / (maxDonuts +2) * 2 + maxDonutSize" 
        :x2="svgWidth - maxDonutSize - 2.5" 
        :y1="(i+1) * maxDonutSize*3" 
        :y2="(i+1) * maxDonutSize*3" 
        class="donut-connector"
      />

      <!-- Line indicators (selected state) -->
      <g 
        v-if="selectedDonut.hasOwnProperty('x')"
      >
        <line 
          :x1="selectedDonut.x" 
          :x2="2 * (svgWidth / (maxDonuts + 2))" 
          :y1="selectedDonut.y" 
          :y2="selectedDonut.y" 
          class="donut-connector--dashed"
        />
        <line 
          :x1="selectedDonut.x" 
          :x2="selectedDonut.x" 
          :y1="selectedDonut.y" 
          :y2="svgHeight - padding" 
          class="donut-connector--dashed"
        />
        <circle 
          :cx="2 * (svgWidth / (maxDonuts + 2))" 
          :cy="selectedDonut.y" 
          r="2" 
          class="plot"
        />
        <circle 
          :cx="selectedDonut.x" 
          :cy="svgHeight - padding" 
          r="2" 
          class="plot"
        />
      </g>
      
      <!-- Donuts, markers, hollows, sum labels -->
      <g 
        v-for="(donut,j) in buildSeries(donutSerie)" 
        :key="`donut_${i}_${j}`" 
        @click="selectDonut({donut, x:svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2), y:(i+1) * maxDonutSize*3, id:donut.donutId})" 
        :style="selectedDonut.hasOwnProperty('x') ? selectedDonut.donutId === donut.donutId ? 'opacity: 1' : 'opacity:0.2' : 'opacity:1'" 
        class="pointer"
      >

        <!-- Plot marker (specifically visible if the sum of a serie = 0) -->
        <circle 
          :cx="svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2)" 
          :cy="(i+1) * maxDonutSize*3" 
          r="2" 
          class="plot"
        />

        <!-- Donut hollow -->
        <circle 
          :cx="svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2)" 
          :cy="(i+1) * maxDonutSize*3" 
          :r="donut.base / maxSerie * maxDonutSize + 2"
          fill="white" 
        />

        <!-- Sum label above donut -->
        <text 
          text-anchor="middle" 
          font-size="10" 
          fill="black" 
          :x="svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2)" 
          :y="(i+1) * maxDonutSize*3 - donut.base / maxSerie * maxDonutSize - 5"
        >
          {{ 
            selectedTonality !== undefined 
            ? donut.series[selectedTonalityIndex]
            ?  donut.series[selectedTonalityIndex].values[j] 
            : 0 : getSum(donut.series)
          }}
        </text>

        <text 
          v-if="selectedTonality !== undefined && donut.series[selectedTonalityIndex]"
          text-anchor="middle"
          font-size="10"
          fill="grey"
          :x="svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2)"
          :y="(i+1) * maxDonutSize * 3 + donut.base / maxSerie * maxDonutSize +12"
        >
          {{
            isNaN(donut.series[selectedTonalityIndex].values[j] / getSum(donut.series)) ? 0 : (donut.series[selectedTonalityIndex].values[j] / getSum(donut.series) * 100).toFixed(rounding)
          }}%
        </text>

        <!-- Donut generation -->
        <path 
          v-for="(arc,k) in makeDonut(donut, svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2), (i+1) * maxDonutSize*3, donut.base / maxSerie * maxDonutSize, donut.base / maxSerie * maxDonutSize)" 
          :key="`arc_${i}_${j}_${k}`" 
          :d="arc.path" 
          :stroke="arc.color" 
          :stroke-width="donut.base / maxSerie * 6 < 2 ? 2 : donut.base / maxSerie * 6"
          :style="selectedTonality !== undefined ? selectedTonality === arc.name ? 'opacity:1' : 'opacity:0.1' : 'opacity:1'"
        />
      </g>
    </g>

    <!-- DONUT SELECTED STATE -->
    <template 
      v-if="selectedDonut.hasOwnProperty('x')"
    >
        <g 
          @click="selectDonut({selectedDonut, x:selectedDonut.x, y: selectedDonut.y, id: selectedDonut.donutId})"
        >
          <circle
            :cx="selectedDonut.x"
            :cy="selectedDonut.y"
            :r="50"
            fill="white"
          />
          <path
            v-for="(arc, i) in makeDonut(
              selectedDonut,
              selectedDonut.x,
              selectedDonut.y,
              50,
              50
            )"
            :key="`arc_selected_${i}`"
            :d="arc.path"
            :stroke="arc.color"
            :stroke-width="20"
            fill="none"
          />
        </g>
      </template>

    <!-- DONUT HOLLOW (SELECTED STATE) -->
    <template 
      v-if="selectedDonut.hasOwnProperty('x')"
    >
      <foreignObject 
        @click="selectDonut({selectedDonut, x:selectedDonut.x, y:selectedDonut.y, id:selectedDonut.donutId})"
        :x="selectedDonut.x - 60"
        :y="selectedDonut.y - 60"
        height="120"
        width="120"
        :style="'overflow: visible;'"
        id="selected"
        class="donut__segments--selected pointer"
      >
        <div
          :class="{ 'donut-gradient': gradient, 'donut-overlay': overlay }"
          :style="`
            align-items: center;
            border-radius: 50%; 
            font-weight: bold;
            color: black;
            display: flex;
            font-size:0.7rem;
            height: 100%;
            justify-content: center;
            overflow: visible;
            text-align: center;
            width:100%;
            `"
        >
          <span class="zoomed-verbatim">
            <span style="color: black; font-size: 1.3em;">
              {{ getSum(selectedDonut.series).toLocaleString() }}
            </span>
          </span>
        </div>
      </foreignObject>
    </template>
          
      <!-- MARKERS DONUT SELECTED STATE -->
    <template 
      v-if="selectedDonut.hasOwnProperty('x')"
    >
      <foreignObject
        @click="selectDonut({selectedDonut, x:selectedDonut.x, y:selectedDonut.y, id:selectedDonut.donutId})"
        id="markers"
        v-for="(arc, k) in makeDonut(
          selectedDonut,
          selectedDonut.x - 18,
          selectedDonut.y - 18,
          50,
          50
        )"
        :key="`arc_select_${k}`"
        :x="arc.center.endX"
        :y="arc.center.endY"
        :height="35"
        :width="35"
        style="overflow: visible"
        class="donut__segments--selected pointer"
      >
        <div 
          v-if="arc.value > 0.01"
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
    </template>
  </svg>
</template>

<script>
export default {
  name: "DonutEvolution",
  props: {
    dataset: {
      type: Array,
      default() {
        /** Dataset must respect this format:
         * 
         * [
         *    {
         *      id: String,
         *      name: String,
         *      series: [
         *        {
         *          name: String,
         *          values: Number[],
         *          color: String (hex format)
         *        }
         *      ]
         *      // Empty data in series.values must be replaced with 0
         *    }
         * ]
         * 
         */
        return [
          {
            id: "01",
            name: "topic_1",
            series: [
              {
                name: "Positive",
                values: [32, 30, 27, 31, 42, 27, 38, 30, 32, 41, 40, 34, 44],
                color: "#15B300",
              },
              {
                name: "Neutral",
                values: [17, 0, 30, 31, 12, 13, 16, 20, 40, 25, 37, 21, 12],
                color: "#ccc",
              },
              {
                name: "Negative",
                values: [13, 22, 15, 40, 45, 39, 25, 12, 24, 32, 16, 50, 44],
                color: "#F17171",
              },
              {
                name: "Mixed",
                values: [18, 16, 12, 25, 36, 5, 2, 29, 4, 16, 18, 25, 32],
                color: "#ebc034",
              },
            ],
          },
          {
            id: "02",
            name: "topic_2",
            series: [
              {
                name: "Positive",
                values: [12, 16, 20, 13, 26, 40, 16, 12, 10, 5, 6, 0, 81],
                color: "#15B300",
              },
              {
                name: "Neutral",
                values: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 0, 0],
                color: "#ccc",
              },
              {
                name: "Negative",
                values: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 65, 0],
                color: "#F17171",
              },
              {
                name: "Mixed",
                values: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 0, 0],
                color: "#ebc034",
              },
            ],
          },
          {
            id: "03",
            name: "topic_3",
            series: [
              {
                name: "Positive",
                values: [10, 19, 50, 55, 8, 13, 18, 12, 19, 11, 9, 19, 20],
                color: "#15B300",
              },
              {
                name: "Neutral",
                values: [3, 7, 4, 12, 10, 11, 1, 12, 9, 16, 13, 16, 15],
                color: "#ccc",
              },
              {
                name: "Negative",
                values: [4, 2, 10, 32, 10, 9, 12, 15, 18, 4, 11, 12, 20],
                color: "#F17171",
              },
              {
                name: "Mixed",
                values: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                color: "#ebc034",
              },
            ],
          },
          {
            id: "04",
            name: "topic_4",
            series: [
              {
                name: "Positive",
                values: [70, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                color: "#15B300",
              },
              {
                name: "Neutral",
                values: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                color: "#ccc",
              },
              {
                name: "Negative",
                values: [4, 51, 61, 72, 50, 29, 30, 25, 51, 35, 29, 18, 40],
                color: "#F17171",
              },
              {
                name: "Mixed",
                values: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                color: "#ebc034",
              },
            ],
          },
          {
            id: "05",
            name: "topic_5",
            series: [
              {
                name: "Positive",
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0],
                color: "#15B300",
              },
              {
                name: "Neutral",
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0],
                color: "#ccc",
              },
              {
                name: "Negative",
                values: [3, 8, 4, 9, 5, 7, 12, 15, 11, 13, 21, 27, 0],
                color: "#F17171",
              },

            ],
          },
        ];
      },
    },
    fontFamily: {
      type: String,
      default: "Product Sans",
    },
    gradient: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 400,
    },
    maxWidth: {
      type: Number,
      default: 1200,
    },
    overlay: {
      type: Boolean,
      default: false,
    },
    rounding: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 800,
    },
    xLabels: {
      type: Array,
      default() {
        return [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
          "JAN",
        ];
      },
    },
  },
  data() {
    return {
      gap: 2,
      padding: 30,
      svgHeight: this.height,
      svgWidth: this.width,
      selectedDonut: {},
      selectedTonality: undefined,
      selectedTonalityIndex: undefined,
    };
  },
  mounted() {
    this.svgHeight =
      this.padding * 2 +
      this.dataset.length * (this.maxDonutSize + this.padding * 1.6);
  },
  computed: {
    tonalities(){
      return this.dataset[0].series.map((serie) => {
        const {name, color} = serie;
        return {
          name,
          color
        }
      })
    },  
    maxSerie() {
      const arr = [...this.dataset]
        .map((dataset) => {
          return this.buildSeries(dataset);
        })
        .map((dataset) => {
          return dataset.flatMap((el) => el.base);
        });
      return Math.max(...arr.flat());
    },
    maxDonuts() {
      const arr = [];
      this.dataset.forEach((item) => {
        item.series.forEach((serie) => {
          arr.push(serie.values.length);
        });
      });
      return Math.max(...arr);
    },
    maxDonutSize() {
      return this.svgWidth / (this.maxDonuts * 2 + this.gap * 4);
    },
    seriesBases() {
      const arr = [];
      this.dataset.forEach((el) => {
        let arr2 = [];
        for (let i = 0; i < this.maxDonuts; i += 1) {
          arr2.push(
            el.series
              .map((serie) => {
                return serie.values[i] ? serie.values[i] : 0;
              })
              .reduce((a, b) => a + b, 0)
          );
        }
        arr.push(arr2);
      });
      return arr;
    },
  },
  methods: {
    selectTonality(tonality, index){
      const {name} = tonality;
      this.selectedDonut = {};
      if(this.selectedTonality !== undefined && this.selectedTonality === name){
        this.selectedTonality = undefined;
        this.selectedTonalityIndex = undefined;
      }else{
        this.selectedTonality = name;
        this.selectedTonalityIndex = index;
      }
    },
    selectDonut({ donut, x, y, id }) {
      if (
        this.selectedDonut.hasOwnProperty("x") &&
        id === this.selectedDonut.donutId
      ) {
        this.selectedDonut = {};
      } else {
        this.selectedDonut = { ...donut, x, y, donutId: id };
      }
    },
    buildSeries(dataset) {
      const arr = [];
      for (let i = 0; i < this.maxDonuts; i += 1) {
        arr.push({
          ...dataset,
          donutId: `${dataset.id}_${i}`,
          base: dataset.series
            .map((serie) => {
              return serie.values[i] ? serie.values[i] : 0;
            })
            .reduce((a, b) => a + b, 0),
          series: dataset.series.map((serie) => {
            return {
              ...serie,
              value: serie.values[i] ? serie.values[i] : 0,
            };
          }),
        });
      }
      return arr;
    },
    getSum(serie) {
      return serie.map((el) => el.value).reduce((a, b) => a + b, 0);
    },
    // DONUT GENERATION METHODS
    addVector([a1, a2], [b1, b2]) {
      return [a1 + b1, a2 + b2];
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
      if (!series || item.base === 0)
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
  },
};
</script>

<style lang="scss" scoped>
* {
  transition: all 0.2s ease-in-out;
}
svg {
  background: white;
  overflow: visible;
  padding: 24px;
  user-select: none;
}
path {
  fill: none;
}
line.gridline {
  stroke: #ddd;
  stroke-width: 1;
}
line.donut-connector {
  stroke: #252525;
  stroke-width: 0.3;
}
line.donut-connector--dashed {
  stroke-dasharray: 4;
  stroke-width: 1;
  stroke: #464646;
}
rect.x-segment--white {
  fill: white;
}
rect.x-segment--grey {
  fill: #fafafa;
}
circle.plot {
  fill: #252525;
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
.pointer {
  cursor: pointer;
}
.horizontal {
  stroke-width: 0.5px;
  stroke: #ddd;
}
.x-label{
  color: black;
  font-size:0.7rem;
}
.y-label{
  display: flex;
  text-align: left;
  align-items:center;
  justify-content:center;
  width: 100%;
  height: 100%;
  line-height: 14px;
}
.tonality-legend{
  align-items:center;
  display: flex;
  flex-wrap: wrap;
  justify-content:center;
  width: 100%;
  gap: 12px;
  text-align:center;
  color: black;
  &__item{
    cursor: pointer;
    display: flex;
    align-items:center;
    justify-content: center;
    gap:3px;
  }
}
.legend-marker{
  display: block;
  border-radius: 50%;
  height: 12px;
  width:12px;
}
</style>
