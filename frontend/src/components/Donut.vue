<template>
<svg width="100%" :viewBox="`0 0 ${width} ${height}`">
     <path
        v-for="(arc, j) in makeDonut(
            dataset,
            width/2,
            height/2 - 30,
            100,
            100
        )"
        :key="`arc_${j}`"
        :d="arc.path"
        :stroke="arc.color"
        :stroke-width="50"
    />

    <foreignObject
        :x="75"
        :y="45"
        :height="height - 150"
        :width="width - 150"
        :style="'overflow: visible;'"
    >
        <div
            :class="{ 'donut-gradient': gradient }"
            :style="
                `
                align-items: center;
                border-radius: 50%; font-weight: bold;
                color: black;
                display: flex;
                flex-direction: column;
                font-size:30px;
                height: 100%;
                justify-content: center;
                overflow: visible;
                text-align: center;
                width:100%;
                `
            "
        >
            <span style="font-size:0.8em;">
                {{ dataset.name }}
            </span>
            <span style="color: #a5a5a5">
             {{ getSum(dataset)}}
            </span>
        </div>
    </foreignObject>

    <!-- MARKERS -->

    <foreignObject
        id="markers"
        v-for="(arc, k) in makeDonut(
            dataset,
            width / 2,
            height / 2 - 30,
            100,
            100
        )"
        :key="`arc_marker_${k}`"
        :x="arc.center.endX"
        :y="arc.center.endY"
        :height="40"
        :width="40"
        style="overflow: visible"
    >
        <div
            v-if="arc.proportion * 100 > markerLimit"
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
                margin-left:-24px; 
                margin-top:-24px; 
                padding: 12px; 
                width: 40px !important; 
                z-index:100;
                `
            "
        >
            {{ (arc.proportion * 100).toFixed(0) }}%
        </div>
    </foreignObject>

    <!-- LEGEND -->
    <foreignObject :x="0" :y="height/2 + 120" width="100%" height="80">
        <div class="legend">
            <div class="legend__item" v-for="(tonality, i) in dataset.series" :key="`tonality_legend_${i}`">
                <span :style="`color:${tonality.color}; font-weight: bold; font-size: 1.3rem;`">
                    {{ tonality.value.toLocaleString() }}
                </span>
                <span>
                    {{ tonality.name }}
                </span>
            </div>
        </div>
    </foreignObject> 

</svg>
</template>

<script>
export default{
  name: "Donut",
  props: {
     dataset: {
        type: Object,
        default(){
            return {
                id: "01",
                name: "donut",
                series: [
                    {
                        name: "Positive",
                        value: 12,
                        color: "#15B300",
                    },
                    {
                        name: "Neutral",
                        value: 6,
                        color: "#ccc"
                    },
                    {
                        name: "Negative",
                        value: 3,
                        color: "#F17171",
                    },
                    {
                        name: "Mixed",
                        value: 0.5,
                        color: "#ebc034"
                    }
                ]
            }
        }
    },
    gradient: {
        type: Boolean,
        default: false,
    },
    height: {
        type: Number,
        default: 400,
    },
    markerLimit: {
        type: Number,
        default: 5,
    },
    width: {
        type: Number,
        default: 400,
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    getSum(donut){
        return donut.series.map((serie) => serie.value).reduce((a,b) => a + b, 0);
    },
    addVector([a1,a2],[b1,b2]){
        return [a1 + b1, a2 + b2];
    },
    matrixTimes([[a,b],[c,d]],[x,y]){
        return [a * x + b * y, c * x + d * y];
    },
    rotateMatrix(x){
        return [
            [Math.cos(x), -Math.sin(x)],
            [Math.sin(x), Math.cos(x)],
        ];
    },
    createArc([cx,cy],[rx,ry],[position,ratio],phi){
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
    makeDonut(item,cx,cy,rx,ry){
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
            [rx * 1.35, ry * 1.35],
            [acc, midRatio],
            110
          ), // center of the arc, to display the marker. rx & ry are larger to be displayed with a slight offset
        });
        acc += ratio;
      }
      return ratios;
    }
  },
};
</script>

<style lang="scss" scoped>
svg{
    background: white;
    overflow: visible;
    user-select: none;
}
path{
    fill:none;
}
.donut-gradient {
    background: radial-gradient(
        transparent,
        transparent,
        transparent,
        transparent,
        transparent,
        transparent,
        transparent,
        transparent,
        transparent,
        rgba(255, 255, 255, 0.6),
        rgba(0,0,0,0.1),
        rgba(0,0,0,0.2),
        rgba(0,0,0,0.3),
        rgba(0,0,0,0.5),
        rgba(0,0,0,0.5),
        transparent,
        transparent,
    );
}
.legend{
    width: 100%;
    height: 100%;
    display: flex;
    gap: 18px;
    align-items:center;
    justify-content: center;
    color: black;
    line-height: 21px;
    &__item{
        display: flex;
        flex-direction: column;
        align-items:center;
        justify-content: center;
    }
}
</style>
