<template>
  <svg width="100%" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">
    <!-- X & Y AXIS LINES -->
    <g>
      <line class="mainline" x1="0" :x2="svgWidth" :y1="zeroLevel" :y2="zeroLevel" :stroke-width="Math.sqrt(svgWidth / svgHeight)/2"/>
      <!-- <line class="mainline" x1="0" x2="0" y1="0" :y2="svgHeight" :stroke-width="Math.sqrt(svgWidth / svgHeight) / 2"/> -->
    </g>
    <!-- VERTICAL XAXIS LINES --->
    <g v-if="showVerticalLines" class="vertical-lines">
      <line v-for="(xAxis, i) in dataset.xLabels" :key="`vertical_line_${i}`" class="tick__vertical-line" :x1="i * interval + interval / 2" :x2="i * interval + interval / 2" :y1="0" :y2="svgHeight" :stroke-width="Math.sqrt(svgWidth / svgHeight)/2" />
    </g>

    <g>
      <line v-for="(tick,i) in dataset.xLabels" :key="`tick_x_${i}`" class="tick__x" :x1="i * interval + interval / 2" :y1="zeroLevel + 5" :x2="i * interval + interval / 2" :y2="zeroLevel - 5" stroke-width="1"/>
    </g>

    <!-- DATAPOINTS & LINES -->
    <g v-for="(dataPoint,i) in dataPoints" :key="`dataPoint_bar_${i}`">
      <g v-if="dataPoint.type === 'line'">
        <circle v-for="(plot,k) in dataPoint.plots" 
            :key="`plot_${i}_${k}`"
            :cx="getCoordinates(plot).x"
            :cy="getCoordinates(plot).y"
            :r="dataPoint.style.markerRadius ? dataPoint.style.markerRadius: markerRadius"
            :fill="dataPoint.color"
        />
      </g>
        
      <g v-if="dataPoint.type === 'bar'">
        <line v-for="(plot,k) in dataPoint.plots" :key="`bar_${i}_${k}`" :x1="getCoordinates(plot).x" :x2="getCoordinates(plot).x" :y1="getCoordinates(plot).y" :y2="zeroLevel" :stroke="dataPoint.color" :stroke-width="dataPoint.style.barWidth ? dataPoint.style.barWidth : barWidth" :style="`opacity:${dataPoint.style.opacity ? dataPoint.style.opacity : 1}`"/>
      </g>

      <g v-if="dataPoint.type === 'bar'">
        <text v-for="(plot, k) in dataPoint.plots" :key="`value_line_plot_${i}_${k}`" :x="getCoordinates(plot).x" :y="plot.data >=0 ? getCoordinates(plot).y - Math.sqrt(svgWidth)/2 : getCoordinates(plot).y + Math.sqrt(svgWidth)" text-anchor="middle" :font-size="Math.sqrt(svgWidth) / 2">
          {{ plot.data }}
        </text>
      </g>
        
    </g>

     <g v-for="(dataPoint,i) in dataPoints" :key="`dataPoint_line_${i}`">
      <g v-if="dataPoint.type === 'line'">
        <circle v-for="(plot,k) in dataPoint.plots" 
            :key="`plot_${i}_${k}`"
            :cx="getCoordinates(plot).x"
            :cy="getCoordinates(plot).y"
            :r="dataPoint.style.markerRadius ? dataPoint.style.markerRadius: markerRadius"
            :fill="dataPoint.color"
        />
      </g>

      <g v-if="dataPoint.type === 'line'">
        <path :d="generateLine(dataPoint, i)" :stroke="dataPoint.color" fill="none" :stroke-width="Math.sqrt(svgWidth / svgHeight) * (dataPoint.style.lineWidth ? dataPoint.style.lineWidth : lineWidth)"/>
      </g>

      <g v-if="dataPoint.type === 'line'">
        <text v-for="(plot, k) in dataPoint.plots" :key="`value_line_plot_${i}_${k}`" :x="getCoordinates(plot).x" :y="plot.data >=0 ? getCoordinates(plot).y - Math.sqrt(svgWidth)/2 : getCoordinates(plot).y + Math.sqrt(svgWidth)" text-anchor="middle" :font-size="Math.sqrt(svgWidth) / 2">
          {{ plot.data }}
        </text>
      </g>

    </g>

        <!-- AXIS LABELS -->
    <g class="x-labels">
      <text v-for="(label,i) in dataset.xLabels" :key="`x-label_${i}`" text-anchor="middle" :x="i * interval + interval / 2" :y="zeroLevel + Math.sqrt(svgWidth)" :font-size="Math.sqrt(svgWidth) / 2">
        {{ label }}
      </text>
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
              data: [0.5, 0.2, 0, 1.2,0.4, 1, 1, 2, 1, 3, 1, 3],
              type: "line",
              color: "#6376DD",
              style: {
                lineWidth: 3,
                markerRadius: 5
              }
            },
            {
              id: "S2",
              name: "Serie 2",
              data: [4, 3, 6, 9, 0, 7, 4, 1, 9, 25, 3, 10],
              type: "bar",
              color: "#ccc",
              style: {
                lineWidth:1,
                markerRadius: 3,
                opacity: 0.8,
              }
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
      default: 1,
    },
    markerRadius: {
      type: Number,
      default: 3,
    },
    showVerticalLines: {
      type: Boolean,
      default: false,
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
    yTicks(){
      const arr = [];
      for(let i = this.minValueInAllSeries; i <= this.maxValueInAllSeries; i += 1){
        if(i % 10 === 0){
          arr.push(
          {x: 0, y: i < 0 ? this.height + i : this.height - (this.minValueInAllSeries < 0 ? Math.abs(this.minValueInAllSeries) : 0) - i}
        )
        }
        
      }
      return arr;
    },
    barWidth(){
      return this.interval * 0.9;
    },
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
                        data: plot,
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
  &__vertical-line{
    stroke: #ddd;
  }
}
path{
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
