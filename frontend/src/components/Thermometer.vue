<template>
  <div class="thermometer">
    <button
      v-if="showRefreshButton"
      class="mb-11"
      absolute
      bottom
      left
      small
      outlined
      fab
      color="grey"
      @click="
        reinit();
        animate();
      "
    >
      REFRESH
    </button>
    <canvas
      height="440"
      width="200"
      class="thermometer__canvas"
      ref="thermometerCanvas"
      style="background: white"
    ></canvas>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Thermometer",

  props: {
    animated: {
      type: Boolean,
      default: false,
    },
    base10: {
      type: Boolean,
      default: false,
    },
    base100: {
      type: Boolean,
      default: false,
    },
    colors: {
      type: Array,
      default() {
        return [
          "red",
          "#ff3300",
          "#ff6600",
          "#ff9933",
          "#ffae00",
          "#ffcc00",
          "#ffff00",
          "#ccff33",
          "greenyellow",
          "#5cd65c",
          "#33cc69",
          "#33cc9e",
          "#33ccc9",
          "#33b3cc",
          "#33a6cc",
          "#3399cc",
          "#338acc",
          "#337dcc",
          "#3375cc",
          "#3366cc",
        ];
      },
    },
    range: {
      type: Array,
      default() {
        return [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
      },
    },
    score: {
      type: Number | String,
      default: 0,
    },
    showRefreshButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      initValue: 0,
      base10Measures: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      base100Measures: [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100],
      acceleration: 1.2,
    };
  },
  computed: {
    canvas() {
      return this.$refs.thermometerCanvas;
    },
    convertedScore() {
      if (this.base10) {
        return this.score;
      } else if (this.base100) {
        if (this.score === 0) {
          return 5;
        } else if (this.score > 0) {
          return 5 + this.score / 20;
        } else if (this.score < 0) {
          return 5 - Math.abs(this.score) / 20;
        }
      }
    },
    ctx() {
      return this.canvas.getContext("2d");
    },
    rangeProportion() {
      return [...this.range].map((rect) => {
        return (rect / 400) * 1600;
      });
    },
  },
  methods: {
    drawRects() {
      const x = 80;
      let step = 420;
      this.rangeProportion.forEach((proportion, i) => {
        this.ctx.save();
        this.ctx.fillStyle = this.colors[i];
        this.ctx.strokeWidth = 1;
        this.ctx.fillRect(x, step - proportion, 44, proportion);
        this.ctx.restore();
        step -= proportion;
      });
    },
    drawMainTicks() {
      let x = 80;
      let y = 20;
      let x2 = 124;
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "black";
      for (let i = 0; i <= 400; i += 40) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
        this.ctx.restore();
      }
    },
    drawHalfTicks() {
      let x = 80;
      let y = 20;
      let x2 = 100;
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeStyle = "black";
      for (let i = 0; i <= 400; i += 20) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
        this.ctx.restore();
      }
    },
    drawTicks() {
      let x = 80;
      let y = 20;
      let x2 = 90;
      this.ctx.lineWidth = 0.25;
      this.ctx.strokeStyle = "black";
      for (let i = 0; i <= 400; i += 5) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
        this.ctx.restore();
      }
    },
    drawPointer(score) {
      let x = 70;
      let x2 = 80;
      let y = 420 - (score / 10) * 400;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.strokeWidth = 1;
      this.ctx.moveTo(x2, y);
      this.ctx.lineTo(x, y - 6);
      this.ctx.lineTo(x, y + 6);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
      x = 124;
      x2 = 134;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.strokeWidth = 1;
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y - 6);
      this.ctx.lineTo(x2, y + 6);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    },
    drawScoreFromBase10(score, source) {
      let x = 30;
      let y = 420 - (score / 10) * 400 + 6;
      this.ctx.save();
      this.ctx.fillStyle = "black";
      this.ctx.font = "18px Arial bold";
      this.ctx.fillText(source.toFixed(1), x, y);
      this.ctx.restore();
    },
    drawScoreFromBase100(score, source) {
      let x = 30;
      let y = 420 - (score / 10) * 400 + 6;
      this.ctx.save();
      this.ctx.fillStyle = "black";
      this.ctx.font = "18px Arial bold";
      this.ctx.fillText(source.toFixed(0), x, y);
      this.ctx.restore();
    },
    drawMeasureSet(measureSet) {
      let init = 425;
      let x = 140;
      measureSet.forEach((measure, i) => {
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.font = "14px Arial bold";
        this.ctx.fillText(measure, x, init);
        init -= 40;
        this.ctx.restore();
      });
    },
    drawMeasures() {
      if (this.base10) {
        this.drawMeasureSet(this.base10Measures);
      } else if (this.base100) {
        this.drawMeasureSet(this.base100Measures);
      }
    },
    drawThermometer(score, source) {
      this.drawRects();
      this.drawTicks();
      this.drawHalfTicks();
      this.drawMainTicks();
      this.drawPointer(score);
      if (this.base10) {
        this.drawScoreFromBase10(score, source);
      } else {
        this.drawScoreFromBase100(score, source);
      }
      this.drawMeasures();
    },
    animate() {
      this.ctx.save();
      this.ctx.clearRect(0, 0, 200, 440);
      let tempScore =
        this.initValue > Number(this.convertedScore)
          ? Number(this.convertedScore)
          : this.initValue;

      this.drawThermometer(tempScore, this.base10 ? tempScore : this.score);

      if (this.initValue < Number(this.convertedScore)) {
        this.initValue += 0.05 * this.acceleration;
        this.acceleration += 0.1;
        requestAnimationFrame(this.animate);
      }

      this.ctx.restore();
    },
    reinit() {
      this.initValue = 0;
      this.acceleration = 1.2;
      if (this.animated) {
        requestAnimationFrame(this.animate);
      } else {
        this.drawThermometer(this.convertedScore, this.score);
      }
    },
  },
  mounted() {
    if (this.animated) {
      requestAnimationFrame(this.animate);
    } else {
      this.drawThermometer(this.convertedScore, this.score);
    }
  },
  updated() {
    if (this.animated) {
      requestAnimationFrame(this.animate);
    } else {
      this.drawThermometer(this.convertedScore, this.score);
    }
  },
});
</script>

<style lang="scss" scoped></style>
