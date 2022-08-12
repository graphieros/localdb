<template>
  <svg width="100%" :viewBox="`0 0 ${width} ${height}`" :style="`font-family:${fontFamily}; max-width:${maxWidth}px`">
    <!-- RADIO BUTTONS -->
    <foreignObject 
      class="selectors" 
      :x="0" 
      :y="height-12" 
      width="100%" 
      height="20"
    >
      <div class="radios">
        <template v-for="(radio,i) in selectors">
          <div class="radios__set" :key="`radio_${i}`">

            <label 
              :class="{'active-label': i === comparatorIndex}" 
              :for="`radio_${i}`" 
              :style="i === comparatorIndex ? `color:${selectors[comparatorIndex].color};` : 'black'"
            >
              {{ radio.name }}
            </label>

            <input 
              :id="`radio_${i}`"  
              type="radio" 
              v-model="comparatorIndex" 
              :value="i" 
              :checked="i === comparatorIndex" 
              @change="selectComparator(i)" 
              :style="i === comparatorIndex ? `background: radial-gradient(at top, rgba(255,255,255,0.1) 10%, ${selectors[comparatorIndex].color} 50%, rgba(0,0,0,0.9) 100%, white);` : `background: radial-gradient(at top, rgba(255,255,255,0.1) 10%, ${selectors[i].color} 50%, rgba(0,0,0,0.9) 100%, white); opacity:0.2`"
            >
          </div>
        </template>
        
      </div>
    </foreignObject>

    <!-- GRID -->
    <g class="grid">
        <line 
          :x1="padding" 
          :x2="width - padding" 
          :y1="height - padding" 
          :y2="height - padding"
        />
        <line 
          :x1="padding" 
          :x2="padding" 
          :y1="padding" 
          :y2="height - padding"
        />
        <line 
          :x1="padding" 
          :x2="width - padding" 
          :y1="height - padding" 
          :y2="padding" 
          class="dotted"
        />
        
        <path :d="`
          M${width-padding},${padding + 5} 
           ${width - padding},${padding} 
           ${width - padding - 5},${padding}
          Z`"
        />

        <path :d="`
          M${padding},${padding} 
           ${padding-3},${padding + 5} 
           ${padding + 3},${padding + 5}
          Z`"
        />

        <path :d="`
          M${width - padding},${height - padding} 
           ${width -5 - padding},${height-3 - padding} 
           ${width - 5 - padding},${height + 3 - padding}
          Z`"
        />

        <text 
          text-anchor="end" 
          :x="(height - padding)/2 - 15" 
          :y="- (width-padding) / 2" 
          transform="rotate(-90)" 
          transform-origin="top" 
          font-size="14"
        >
          + {{ yLabel }}
        </text>

        <text 
          text-anchor="end" 
          :x="width - padding" 
          :y="height - padding + 20" 
          fill="black" 
          font-size="14"
        >
          % {{ xLabel}}
        </text>

        <circle 
          :cx="padding" 
          :cy="height - padding" 
          r="1" 
          fill="black"
        />
    </g>

    <!-- DONUTS -->
    <g v-for="(plot,i) in plots" :key="`plot_${i}`">
        <g 
          class="donut__item" 
          v-if="hasData(plot)"  
          @click="selectDonut(plot, i)" 
          :style="selectedDonutIndex === undefined ? 'opacity: 1' : selectedDonutIndex === i ? 'opacity:1' : 'opacity:0.2'"
        >

          <path 
            class="donut" 
            v-for="(arc,j) in selectedDonutIndex !== undefined && selectedDonutIndex === i ? makeDonut(plot, plot.x, plot.y, 50,50) : makeDonut(plot, plot.x, plot.y, 10,10)" 
            :key="`donut_${i}_${j}`" 
            :d="arc.path" 
            :stroke="arc.color" 
            :stroke-width="selectedDonutIndex !== undefined && selectedDonutIndex === i ? 20 : 6"
          />

          <text 
            text-anchor="middle" 
            :x="plot.x" 
            :y="plot.y +20" 
            font-size="8"
          >
            {{ plot.verbatim }}
          </text>

          <circle 
            :cx="plot.x" 
            :cy="plot.y" 
            r="7" 
            fill="white"
          />
        </g>
    </g>

    <!-- DONUT SEGMENTS SELECTED STATE -->
          <template v-if="selectedDonutIndex !== undefined">
            <g @click="selectDonut(selectedDonut, selectedDonutIndex)" >
              <circle
                :cx="selectedDonut.x"
                :cy="selectedDonut.y"
                :r="50"
                fill="white"
              />
              <path
                v-for="(arc, j) in makeDonut(
                  selectedDonut,
                  selectedDonut.x,
                  selectedDonut.y,
                  50,
                  50
                )"
                :key="`arc_${selectedDonutIndex}_${j}`"
                :d="arc.path"
                :stroke="arc.color"
                :stroke-width="20"
                fill="none"
              />
            </g>
              <!-- VERBATIM SELECTED STATE -->
          </template>
          <foreignObject @click="selectDonut(selectedDonut, selectedDonutIndex)"
            v-if="selectedDonutIndex !== undefined"
            :x="selectedDonut.x - 60"
            :y="selectedDonut.y - 60"
            height="120"
            width="120"
            :style="'overflow: visible;'"
            id="selected"
            class="donut__segments--selected"
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
              <span class="zoomed-verbatim">{{
                selectedDonut.verbatim
              }}<br>
                <span style="color: #aaa; font-size: 1em;">
                  {{ getSum(selectedDonut).toLocaleString() }}
                </span>
              </span>
            </div>
          </foreignObject>

          <!-- MARKERS DONUT SELECTED STATE -->
          <template v-if="selectedDonutIndex !== undefined">
             <foreignObject
                @click="selectDonut(selectedDonut, selectedDonutIndex)"
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
                class="donut__segments--selected"
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
  name: "ScatterDonut",
  props: {
    dataset: {
      type: Array,
      default() {
        /** Dataset must respect this format:
         * 
         * [
         *    {
         *      id: String,
         *      verbatim: String,
         *      series: [
         *        {
         *          name: String,
         *          value: Number,
         *          color: String (hex format)
         *        }
         *      ]
         *      // All series should ideally contain the same types of children,
         *      // as illustrated in the default dataset below
         *    }
         * ]
         * 
         */
        return [
          {
            id: "01",
            verbatim: "subtopic_1",
            series: [
              {
                name: "Positive",
                value: 1,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 0,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 2,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 1,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "02",
            verbatim: "subtopic_2",
            series: [
              {
                name: "Positive",
                value: 185,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 14,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 25,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 16,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "03",
            verbatim: "subtopic_3",
            series: [
              {
                name: "Positive",
                value: 20,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 19,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 10,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 14,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "04",
            verbatim: "subtopic_4",
            series: [
              {
                name: "Positive",
                value: 34,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 12,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 7,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 5,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "05",
            verbatim: "subtopic_5",
            series: [
              {
                name: "Positive",
                value: 6,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 25,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 102,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 65,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "06",
            verbatim: "subtopic_6",
            series: [
              {
                name: "Positive",
                value: 7,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 7,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 7,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 8,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "07",
            verbatim: "subtopic_7",
            series: [
              {
                name: "Positive",
                value: 20,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 6,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 13,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 5,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "08",
            verbatim: "subtopic_8",
            series: [
              {
                name: "Positive",
                value: 13,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 5,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 42,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 9,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "09",
            verbatim: "subtopic_9",
            series: [
              {
                name: "Positive",
                value: 6,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 18,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 10,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 21,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "10",
            verbatim: "subtopic_10",
            series: [
              {
                name: "Positive",
                value: 1,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 1,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 0,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 0,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "11",
            verbatim: "subtopic_11",
            series: [
              {
                name: "Positive",
                value: 25,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 6,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 45,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 23,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "12",
            verbatim: "subtopic_12",
            series: [
              {
                name: "Positive",
                value: 123,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 13,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 50,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 34,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "13",
            verbatim: "subtopic_13",
            series: [
              {
                name: "Positive",
                value: 12,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 15,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 67,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 12,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "14",
            verbatim: "subtopic_14",
            series: [
              {
                name: "Positive",
                value: 44,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 0,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 44,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 8,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "15",
            verbatim: "subtopic_15",
            series: [
              {
                name: "Positive",
                value: 2,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 1,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 6,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 1,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "16",
            verbatim: "subtopic_16",
            series: [
              {
                name: "Positive",
                value: 49,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 49,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 49,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 18,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "17",
            verbatim: "subtopic_17",
            series: [
              {
                name: "Positive",
                value: 1,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 1,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 1,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 10,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "18",
            verbatim: "subtopic_18",
            series: [
              {
                name: "Positive",
                value: 77,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 31,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 49,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 43,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "19",
            verbatim: "subtopic_19",
            series: [
              {
                name: "Positive",
                value: 20,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 19,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 66,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 15,
                color: "#ebc034"
              }
            ],
          },
          {
            id: "20",
            verbatim: "subtopic_20",
            series: [
              {
                name: "Positive",
                value: 3,
                color: "#15B300",
              },
              {
                name: "Neutral",
                value: 1,
                color: "#ccc",
              },
              {
                name: "Negative",
                value: 10,
                color: "#F17171",
              },
              {
                name: "Mixed",
                value: 111,
                color: "#ebc034"
              }
            ],
          },
        ];
      },
    },
    defaultTonalityIndex: {
      type: Number,
      default: 0,
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
      default: 1000,
    },
    overlay: {
      type: Boolean,
      default: false,
    },
    yLabel: {
      type: String,
      default: "Respondent base"
    },
    width: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
        comparatorIndex: this.defaultTonalityIndex,
        padding: 24,
        selectedDonut: {},
        selectedDonutIndex: undefined,
    };
  },
  computed: {
    colors(){
      return this.dataset[0].series.map((serie) => serie.color);
    },
    categories(){
      return this.dataset[0].series.map((serie) => serie.name);
    },
    selectors(){
      return this.dataset[0].series.map((serie) => serie);
    },
    xLabel(){
      return this.dataset[0].series[this.comparatorIndex].name;
    },
    plots(){
        const datasetWithProportions = this.dataset.map((item) => {
            const total = item.series.map((serie) => serie.value).reduce((a,b) => a + b, 0);
            return {
                ...item,
                total,
                series: item.series.map((serie) => {
                    return {
                        ...serie,
                        proportion: (serie.value / total) * (this.width - this.padding * 4)
                    }
                })
            }
        });

        const maxTotal = Math.max(...datasetWithProportions.map((item) => item.total));

        return datasetWithProportions.map((item) => {
            return {
                ...item,
                x: item.series[this.comparatorIndex].proportion + this.padding*2,
                y: (this.height - this.padding*2) - item.total / maxTotal * (this.height - this.padding * 4)
            }
        })
    },
  },
  methods: {
    selectComparator(index){
      this.selectedDonut = {};
      this.selectedDonutIndex = undefined;
      this.comparatorIndex = index;
    },
    hasData(plot){
      return plot.series.map((serie) => serie.value).reduce((a,b) => a + b, 0) > 0;
    },
    selectDonut(plot, index){
      if(this.selectedDonutIndex !== undefined && this.selectedDonutIndex === index){
        this.selectedDonutIndex = undefined;
        this.selectedDonut = {};
      }else{
        this.selectedDonut = plot;
        this.selectedDonutIndex = index;
      }
    },
    getSum(item) {
      return item.series.map((el) => el.value).reduce((a, b) => a + b, 0);
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
      if(!series) return {...series, proportion:0, ratio:0, path:'', startX:0, startY:0,endX:0,center:{}};
      // series = series.map((el) => {
      //   return {
      //     ...el,
      //     value: el.value,
      //   }
      // })
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
*{
  transition: all 0.2s ease-in-out;
}
svg {
  background: white;
  overflow: visible;
  padding: 48px;
  user-select: none;
}
g.grid{
    line, path{
        stroke: #ccc;
        fill: #ccc;
    }
}
line.dotted{
  stroke-dasharray: 4;
}
path.donut{
  fill: none;
}
.donut{
  &__item{
    cursor: pointer;
  }
  &__segments{
    &--selected{
      cursor: pointer;
    }
  }
}
foreignObject.selectors{
  overflow: visible;
  color: black;
}
.radios{
  width:100%;
  display: flex;
  align-items:center;
  justify-content:center;
  gap: 12px;
  overflow: visible;
  &__set{
    display: flex;
    flex-direction: column;
    font-size:10px;
    overflow: visible;
    align-items:center;
  }
}
.active-label {
  font-weight: bold;
}
input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  border-radius: 50%;
  width: 16px;
  height: 16px;

  border: 2px solid #ffffff;
  transition: 0.2s all linear;
  top: 4px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.2);
  padding: 2px;
}
input, label{
  cursor: pointer;
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
</style>
