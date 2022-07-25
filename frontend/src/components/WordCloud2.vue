<template>
  <div class="wordcloud">
    <canvas ref="canvas" height="800" width="800"></canvas>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "WordCloud2",
  components: {},
  data() {
    return {
        plots: [],
        occupied: [],
        spiralLimit: 360 * 8,
        spiralResolution: 0.1,
        x: 1,
        y: 1,
        test: 100,
        idx: 0,
    };
  },
  computed: {
    canvas(){
        return this.$refs.canvas;
    },
    ctx(){
        return this.canvas.getContext("2d");
    },
    maxWeight(){
        return Math.max(...this.words.map((word) => word.weight));
    },
    startPoint(){
        return {
            x: this.canvas.offsetWidth,
            y: this.canvas.offsetHeight, 
        }
    },
    words(){
        const arr = [];
        for(let i = 0; i < this.test; i += 1){
            let word = i % 2 === 0 ? 'Hello' : 'World';
            arr.push({
                text: word,
                weight: Math.random() * 100
            });
        }
        return arr.sort((a,b) => b.weight - a.weight);
    }
  },
  methods: {

    findAvailableSpot(i, metrics){
        const {actualBoundingBoxLeft, actualBoundingBoxRight} = metrics
        if(!this.occupied.length){
            this.occupied.push(this.plots[0]);
        }
        let hasFound = false;
        let index = i;
        const xl = this.occupied.map((occ) => occ.x - actualBoundingBoxLeft)[index];
        const xr = this.occupied.map((occ) => occ.x + actualBoundingBoxRight)[index];
        const yt = this.occupied.map((occ) => occ.y - occ.height)[index];
        const yb = this.occupied.map((occ) => occ.y + occ.height)[index];

        while(!hasFound){
            const plot = this.plots[this.idx];
            if(this.idx === 10000){
                this.hasFound = true;
                return this.plots[Math.round(Math.random()*this.plots.length)];
            }
            console.log("PLOTY:", plot.y, "YT:", yt)
            if(
                plot.x < xl
              ){
                console.log("plotX:", plot.x, "xr:", xr);
                hasFound = true;
                this.idx += 1;
                index += 1;
                console.log("FOUND")
                return plot;
            }else{
                const fallback = this.plots[this.idx];
                this.idx += 1;
                index += 1;
                console.log("FUKK")
                return fallback;
            }
            
        }
    },
    placeWords(){
        this.words.forEach((word, i) => {
            this.ctx.textAlign = "center";
            this.ctx.font=`${word.weight / this.maxWeight * 70}px Arial`;
            const metrics = this.ctx.measureText(word.text);
            console.log({metrics});
            const availableSpot = this.findAvailableSpot(i, metrics);
            this.ctx.fillText(word.text, availableSpot.x, availableSpot.y);
            this.occupied.push({
                x: availableSpot.x,
                y: availableSpot.y,
                width: metrics.width,
                height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
            })
        })
    },
    spiral(i, callback){
        const angle = this.spiralResolution * i;
        this.x = (angle) * Math.cos(angle);
        this.y = (angle) * Math.sin(angle);
        return callback ? callback() : null;
    },
    trace(x,y){
        this.ctx.fillRect(x,y,1,1);
    },
    traceSpiral(){
        const that = this;
        this.ctx.beginPath();
        for(let i = 0; i < this.spiralLimit; i += 1){
            this.spiral(i, () => {
                const plot = {
                    x: that.startPoint.x + that.x,
                    y: that.startPoint.y + that.y,
                }
                that.trace(plot.x, plot.y);
                that.plots.push(plot);
            })
        }
    }
  },
  mounted(){
    this.traceSpiral();
    this.placeWords();
  }
});
</script>

<style lang="scss" scoped>
canvas {
    background: white;
    height: 400px;
    width: 400px;
}
</style>