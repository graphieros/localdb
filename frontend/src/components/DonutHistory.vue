<template>
  <svg width="100%" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">

    <g>
      <g v-for="(gridline,i) in maxDonuts" :key="`gridline_${i}`">
        <line :x1="(i+2) * (svgWidth / (maxDonuts +2))" :x2="(i+2) * (svgWidth / (maxDonuts + 2))" :y1="padding" :y2="svgHeight - padding" class="gridline"/>
        <rect :class="{'x-segment--grey': i % 2 === 0, 'x-segment--white' : i % 2 !== 0}" :x="(i+2) * (svgWidth / (maxDonuts +2))" :y="padding" :height="svgHeight - padding*2" :width="(maxDonutSize*2 + 5)"></rect>
        <foreignObject :x="(i+2) * (svgWidth / (maxDonuts + 2))" :y="svgHeight - 30" :width="svgWidth / (maxDonuts +2)" :height="30">
          <div class="x-label">
            {{ xLabels[i] }}
          </div>
        </foreignObject>

      </g>
    </g>

    <g v-for="(donutSerie,i) in dataset" :key="`donutSerie_${i}`">
      <text :x="(svgWidth / (maxDonuts +2) *2) - padding/3" :y="(i+1) * maxDonutSize*3 + 4" text-anchor="end">
        {{ donutSerie.name }}
      </text>
      <line :x1="svgWidth / (maxDonuts +2) * 2 + maxDonutSize" :x2="svgWidth - maxDonutSize - 2.5" :y1="(i+1) * maxDonutSize*3" :y2="(i+1) * maxDonutSize*3" class="donut-connector"/>
      
      <g v-for="(donut,j) in buildSeries(donutSerie)" :key="`donut_${i}_${j}`">
        <circle :cx="svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2)" :cy="(i+1) * maxDonutSize*3" r="2" class="plot"/>
        <circle :cx="svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2)" :cy="(i+1) * maxDonutSize*3" fill="white" :r="donut.base / Math.max(...seriesBases[i]) * maxDonutSize"/>

        <path v-for="(arc,k) in makeDonut(donut, svgWidth / (maxDonuts + 2) * (j+2) + (svgWidth / (maxDonuts + 2) / 2), (i+1) * maxDonutSize*3, donut.base / Math.max(...seriesBases[i]) * maxDonutSize, donut.base / Math.max(...seriesBases[i]) * maxDonutSize)" :key="`arc_${i}_${j}_${k}`" :d="arc.path" :stroke="arc.color" :stroke-width="5"/>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: "DonutHistory",
  props: {
      dataset: {
      type: Array,
      default(){
        return [
          {
            id: "01",
            name:"topic_1",
            series: [
                {
                  name: "Positive",
                  values: [20,100,25,12,15,13,25,18,10,14,42,59,39],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [5,8,5,0,1,2,15,8,1,10,23,10,14],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [8,7,19,6,12,2,7,9,1,9,25,12,14],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [9,8,5,7,1,3,5,8,10,12,44,54,34],
                  color: "#ebc034"
                }
              ],
          },
          {
            id: "02",
            name:"topic_2",
            series: [
                {
                  name: "Positive",
                  values: [2,2,2,1,1,1,2,1,1,1,4,5,0],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [1,3,5,0,1,2,4,2,1,10,2,10,0],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [8,7,19,6,12,2,7,9,1,9,25,12,0],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [9,8,5,7,1,3,5,8,10,12,4,5,0],
                  color: "#ebc034"
                }
              ],
          },
          {
            id: "03",
            name:"topic_3",
            series: [
                {
                  name: "Positive",
                  values: [2,2,2,1,1,1,2,1,1,1,4,0,3],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [1,3,5,0,1,2,4,2,1,10,2,0,1],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [8,7,19,6,12,2,7,9,1,9,25,0,14],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [9,8,5,7,1,3,5,8,10,12,4,0,34],
                  color: "#ebc034"
                }
              ],
          },
          
        ]
      }
    },
    height: {
        type: Number,
        default: 400,
    },
    width: {
        type: Number,
        default: 800,
    },
    xLabels: {
        type: Array,
        default(){
          return ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC","JAN"]
        }
    }
  },
  data() {
    return {
        gap: 2,
        padding: 30,
        svgHeight: this.height,
        svgWidth: this.width,
    };
  },
  mounted(){
    this.svgHeight = this.padding * 2 + this.dataset.length * (this.maxDonutSize + this.padding*1.6);
  },
  computed: {
    maxDonuts(){
      const arr = [];
      this.dataset.forEach(item => {
        item.series.forEach((serie) => {
          arr.push(serie.values.length)
        })
      });
      return Math.max(...arr);
    },
    maxDonutSize(){
      return this.svgWidth / (this.maxDonuts * 2 + this.gap * 4);
    },
    seriesBases(){
      const arr = [];
      this.dataset.forEach((el) => {
        let arr2 = [];
        for(let i = 0; i < this.maxDonuts; i += 1){
          arr2.push(el.series.map((serie) => {
                return serie.values[i] ? serie.values[i] : 0
            }).reduce((a,b) => a + b, 0),
          )
        }
        arr.push(arr2)
      });
      return arr
    }
  },
  methods: {
    buildSeries(dataset){
      const arr = [];
      for(let i = 0; i < this.maxDonuts; i += 1){
        arr.push({
          ...dataset,
          base: dataset.series.map((serie) => {
              return serie.values[i] ? serie.values[i] : 0
          }).reduce((a,b) => a + b, 0),
          series: dataset.series.map((serie) => {
            return {
              ...serie,
              value: serie.values[i] ? serie.values[i] : 0,
            }
          })
        })
      }
      return arr;
    },
    getSum(serie){
      return serie.map((el) => el.value).reduce((a,b) => a + b, 0);
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
      if(!series || item.base === 0) return {...series, proportion:0, ratio:0, path:'', startX:0, startY:0,endX:0,center:{}};
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
svg {
    background: white;
    overflow: visible;
    padding: 24px;
    user-select: none;
}
path{
  fill: none;
}
line.gridline{
  stroke: #ddd;
  stroke-width: 1;
}
line.donut-connector{
  stroke: #252525;
  stroke-width: 1;
}
rect.x-segment--white{
  fill:white;
}
rect.x-segment--grey{
  fill: #fafafa;
}
circle.plot{
  fill: #252525;
}
</style>
