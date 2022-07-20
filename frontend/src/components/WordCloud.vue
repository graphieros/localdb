<template>
  <canvas ref="wordCloud" :height="canvasSize" :width="canvasSize" :style="`height:${squareDimension}px;width:${squareDimension}px`"></canvas>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "WordCloud",
  props: {
    dataset: {
        type: Array,
        default(){
            return [
                {
                    text: "Hello",
                    weight: 100,
                },
                {
                    text: "Word !",
                    weight: 50,
                },
            ]
        } 
    },
    rainbow: {
      type: Boolean,
      default: false,
    },
    sampleSize: {
      type: Number,
      default: undefined,
    },
    test: {
      type: Boolean,
      default: false,
    },
    testCircles: {
      type: Boolean,
      default: false,
    },
    squareDimension: {
      type: Number,
      default: 400,
    }
  },
  data() {
    return {
      canvasSize: 2000,
    }
  },
  
  computed: {
    canvas(){
      const canvas = this.$refs.wordCloud;
      return canvas;
    },
    ctx(){
      return this.canvas.getContext("2d");
    },
    maxWeight(){
      return Math.max(...this.words.map((word) => word.weight));
    },
    testSet(){
      let arr = [];
      for(let i = 0; i < 100; i += 1){
        let word = i % 2 === 0 ? "Hello" : "World";
        arr.push({
          text: word,
          weight: i
        });
      }
      return arr;
    },
    words(){
      let dataset;
      if(this.test){
        dataset = this.testSet;
      }else{
        dataset = this.dataset;
      }
      dataset = dataset.sort((a,b) => b.weight - a.weight);
      if(this.sampleSize){
        return dataset.slice(0, this.sampleSize);
      }
      return dataset;
    }
  },
  mounted(){
    this.generateWordCloud();
  },
  methods: {
    dist(obj1, obj2){
      const a = obj1.x - obj2.x;
      const b = obj1.y - obj2.y;
      return Math.hypot(a,b);
    },
    randomColor(){
      const r = Math.random() * 160;
      const g = Math.random() * 160;
      const b = Math.random() * 160;
      return {r,g,b}
    },
    generateWordCloud(){
      const circles = [];
      let protection = 0;
      this.words.forEach((word) => {
        let size = (word.weight / this.maxWeight) * 100;
        if(size < 10){
          size = 100;
        }
        word.size = size;
      })
        let counter = 0;
        while(circles.length < this.words.length){
          const circle = {
            x: this.canvasSize / 6 + Math.random() * this.canvasSize /1.5,
            y: this.canvasSize / 6 + Math.random() * this.canvasSize /1.5,
            r: this.words[counter].size,
            w: this.words[counter].weight
          }

          let overlapping = false;

          for(let j = 0; j < circles.length; j += 1){
            let other = circles[j];
            let d = this.dist(circle, other);
            const {x,y,r} = circle;
            if(d < r + other.r){
              overlapping = true;
            }
          }
          if(!overlapping){
            circles.push(circle);
            counter += 1;
          }
          protection += 1;
          if(protection > 10000){
            console.warn("TOO MANY NOTES", counter)
            break;
          }
        }
  
      circles.forEach((circle, i) => {
        circle.word = this.words[i].text;
        this.ctx.font = `${circle.w / this.maxWeight * 100}px Arial`;
        this.ctx.textAlign = "center";
        this.ctx.beginPath();
        this.ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
        if(this.testCircles) {
          this.ctx.strokeStyle="#ddd";
        }else{
          this.ctx.strokeStyle="transparent";
        }
        let {r,g,b} = this.randomColor();
        if(!this.rainbow){
          r = 0;
          g = 0;
          b = 0;
        }
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.fillStyle= `rgba(${r},${g},${b},${1 - circle.w / this.maxWeight + 0.1})`;
        this.ctx.fillText(circle.word, circle.x, circle.y + circle.r / Math.PI);
        this.ctx.stroke();

        // console.log(circle.r)
      })
    },
  },
});
</script>

<style lang="scss" scoped>
canvas{
  background: white;
}
</style>
