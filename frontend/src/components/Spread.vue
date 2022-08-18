<template>
  <svg width="100%" :viewBox="`0 0 ${1000} ${1000}`">

    <!-- <g v-for="(spread, i) in spreads" :key="`spread_${i}`">
        <line 
            :x1="spread.x1 - 50"
            :y1="spread.y1 + 50 * i/100"
            :x2="spread.x2 - 50"
            :y2="spread.y2 + 50"
            :stroke="spread.color"
            stroke-linecap="round"
            stroke-width="6"
            :class="{animated: animated}"
            :style="animated ? `animation-delay:${randomAnimation ? (i*Math.random()*10) : i * 10}ms` : ''"
        />
    </g> -->

     <g v-for="(spread, i) in spreads" :key="`spread_2_${i}`">
        <line 
            :x1="makeShape(spread,i).x1"
            :y1="makeShape(spread,i).y1"
            :x2="makeShape(spread,i).x2"
            :y2="makeShape(spread,i).y2"
            :stroke="spread.color"
            stroke-linecap="round"
            stroke-width="6"
            :class="{animated: animated}"
            :style="animated ? `animation-delay:${randomAnimation ? (i*Math.random()*10) : i * 10}ms` : ''"
        />
    </g>
   
    <circle :cx="radius" :cy="radius" r="0" fill="white"/>
    
  </svg>
</template>

<script>

export default {
  name: "Spread",
  props: {
    animated: {
        type: Boolean,
        default: false,
    },
    leaf: {
        type: Boolean,
        default: false,
    },
    randomAnimation: {
        type: Boolean,
        default: false,
    },
    range: {
        type: Number,
        default: 100,
    },
    size: {
        type: Number,
        default: 400,
    },
  },
  data() {
    return {
        radius: this.size * 1.3,
        maxStroke: this.size / 2
    };
  },
  computed: {
    dataset(){
        const arr = [];
            let r = 0;
            let g = 0;
            let b = 0;
            for(let i = 0; i < this.range; i += 1){
                arr.push({
                id: `0${i}`,
                name: `set_${i}`,
                value: i,
                color: `rgb(${r},${g},${b})`
                });
                r += 1.3/ this.range * 150;
                g += 1.6/ this.range * 150;
                b += 0.8/ this.range * 150;
            }
            return arr;
    },
    sortedDataset(){
        return this.dataset.sort((childA, childB) => childB.value - childA.value)
    },
    total(){
        return this.dataset.map((child) => child.value).reduce((a,b) => a + b , 0);
    },
    max(){
        return Math.max(...this.dataset.map((child) => child.value));
    },
    spreads(){
        const spreads = [];
        const angleGap = 6.28319 / this.sortedDataset.length;
        const regAngleGap = 360 / this.sortedDataset.length;
        let angle = 4.71;
        for(let i = 0; i < this.sortedDataset.length; i += 1){
            const child = this.sortedDataset[i];
            let x1 = this.radius;
            let y1 = this.radius;
            let x2 = this.radius + ((child.value / this.max) * this.maxStroke) * Math.cos(angle) 
            let y2 = this.radius + ((child.value / this.max) * this.maxStroke) * Math.sin(angle)
            spreads.push({
                ...child,
                x1,
                y1,
                x2,
                y2,
                angle
            });
            angle += angleGap;
        }
        return spreads;
    }
  },
  methods: {
    makeShape(spread, index){
        const {x1,y1,x2,y2} = spread;
        if(this.leaf){
            return {
                x1: x1 + 50 * index / 1000,
                y1: y1 + 50 * index / 100,
                x2: x2 - 10 * index / 50,
                y2: y2 - 10 * index / 10
            }
        }else{
            return spread;
        }
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
  },
};
</script>

<style lang="scss" scoped>
svg{
    background: transparent;
    overflow: visible;
}
line.animated{
    opacity:0;
    animation: fade 1s ease-in alternate-reverse infinite;
}
@keyframes fade{
    from{
        opacity:0;
    }
    to {
        opacity: 1;
    }
}
</style>
