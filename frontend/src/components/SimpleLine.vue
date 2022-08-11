<template>
  <svg width="100%" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">
    <g>
      <line class="mainline" x1="0" :x2="svgWidth" :y1="zeroLevel" :y2="zeroLevel" :stroke-width="Math.sqrt(svgWidth / svgHeight)"/>
      <line class="mainline" x1="0" x2="0" y1="0" :y2="svgHeight" :stroke-width="Math.sqrt(svgWidth / svgHeight)"/>
    </g>
    <g v-for="(dataPoint,i) in dataPoints" :key="`dataPoint_${i}`">
        <circle v-for="(plot,k) in dataPoint.plots" 
            :key="`plot_${i}_${k}`"
            :cx="getCoordinates(plot).x"
            :cy="getCoordinates(plot).y"
            r="3"
            :fill="dataPoint.color"
        />
        <path :d="generateLine(dataPoint, i)" :stroke="dataPoint.color" fill="none" :stroke-width="Math.sqrt(svgWidth / svgHeight) * lineWidth"/>
        <line v-for="(plot,k) in dataPoint.plots" :key="`tick_x_${i}_${k}`" class="tick__x" :x1="k * interval + interval / 2" :y1="zeroLevel + 5" :x2="k * interval + interval / 2" :y2="zeroLevel - 5" stroke-width="1"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: "SimpleLine",
  props: {
    dataset: {
      type: Object,
      default() {
        return {
          xLabels: [
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
          ],
          series: [
            {
              id: "S1",
              name: "Serie 1",
              data: [0.5, 0.2, 1 , 1.2,0.4, 1, 1, 2, 1, 3, 1, 3],
              type: "line",
              color: "#6376DD",
              style:"smooth"
            },
            {
              id: "S2",
              name: "Serie 2",
              data: [4, 3, 6, 9, 2, 7, 4, 1, 9, 25, 3, 10],
              type: "line",
              color: "#000000",
              style:""
            },
          ],
        };
      },
    },
    height: {
        type:Number,
        default: 400,
    },
    lineWidth: {
      type:Number,
      default: 5,
    },
    width: {
        type: Number,
        default: 400,
    }
  },
  data() {
    return {
        svgHeight: this.height, 
        svgWidth:this.width,
    };
  },
  mounted(){
    if(this.minValueInAllSeries < 0){
        this.svgHeight = this.ratioToMax(this.maxValueInAllSeries, this.height) + this.ratioToMax(Math.abs(this.minValueInAllSeries), this.height);     
    }else{
        this.svgHeight = this.height;
    }
    this.svgWidth = this.svgHeight * 2;
  },
  computed: {
    interval(){
        return this.svgWidth / this.maxSeriesLength;
    },
    maxSeriesLength(){
        return Math.max(...this.dataset.series.map((serie) => {
            return serie.data.length;
        }));
    },
    maxYMarker(){
      if(this.maxSeriesLength < this.magnitudeMax){
        return this.magnitudeMax;
      }else{
        return this.maxSeriesLength + (this.maxSeriesLength - this.magnitudeMax);
      }
    },
    magnitudeMax(){
      return Math.pow(10,Math.floor(Math.log10(this.maxValueInAllSeries)))
    },
    maxValueInAllSeries(){
        return Math.max(...this.dataset.series.flatMap((serie) => serie.data));
    },
    minValueInAllSeries(){
        return Math.min(...this.dataset.series.flatMap((serie) => serie.data));
    },
    dataPoints(){
        return this.dataset.series.map((serie) => {
            return {
                ... serie,
                plots: serie.data.map((plot, i) => {
                    return {
                        x: i * this.interval + this.interval / 2,
                        y: this.ratioToMax(plot, this.height)
                    }
                })
            }
        })
    },
    zeroLevel(){
        if(this.minValueInAllSeries < 0){
            return this.svgHeight - this.ratioToMax(Math.abs(this.minValueInAllSeries), this.height);
        }
        return this.svgHeight;
    }
  },
  methods: {
    generateLine(dataPoint){
      // try to find a way to make smooth curves
        const tuples = dataPoint.plots.map((plot, i) => {
            return `|${this.getCoordinates(plot).x},${this.getCoordinates(plot).y}|`;
        }).toString().replaceAll("|,|", " ").replaceAll("|", "");
        return `M${tuples}`;
    },  
    getCoordinates(plot){
        return {
            x: plot.x,
            y: this.height - plot.y,
        }
    },
    ratioToMax(value, base){
        return value / (this.maxValueInAllSeries) * base;
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  background: white;
  padding: 48px;
  overflow: visible;
}
line.mainline{
  stroke: #ccc;
}
.tick{
  &__x{
    stroke: #aaa;
  }
}
</style>
