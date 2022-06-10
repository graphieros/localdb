<template>
  <div class="thermometer__container" @pointerleave="allowTooltip(false)">
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
      :height="resolution * 1.1"
      :width="resolution * 0.5"
      :class="{ thermometer__canvas: true }"
      ref="thermometerCanvas"
      :style="{ background: backgroundColor, height: `${size}px` }"
      @pointerenter="allowTooltip(true)"
      @mousemove="(e) => showTooltip(e)"
      @pointerleave="allowTooltip(false)"
    ></canvas>
    <div
      v-show="isTooltip && tooltipHtml"
      class="thermometer__tooltip"
      v-html="tooltipHtml"
      :style="`position: fixed; left: ${mouseX}px; top:${mouseY}px`"
      @pointerenter="allowTooltip(true)"
      @mousemove="(e) => showTooltip(e)"
    ></div>
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
    dark: {
      type: Boolean,
      default: false,
    },
    darkColor: {
      type: String,
      default: "#18192C",
    },
    hideMeasures: {
      type: Boolean,
      default: false,
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
    size: {
      type: Number | String,
      default: 400,
    },
    tooltipHtml: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      acceleration: 1.2,
      base100Measures: [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100],
      base10Measures: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      initValue: 0,
      isTooltip: false,
      mouseX: 0,
      mouseY: 0,
      resolution: 800,
    };
  },
  computed: {
    backgroundColor() {
      if (this.dark) {
        return this.darkColor;
      }
      return "white";
    },
    canvas() {
      return this.$refs.thermometerCanvas;
    },
    colorRange() {
      const base = this.base10 ? this.base10Measures : this.base100Measures;

      return this.range.map((measure, i) => {
        return {
          step: base[i],
          color: this.colors[i],
        };
      });
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
        return (
          (rect / this.resolution) * this.resolution * (this.resolution / 100)
        );
      });
    },
    textColor() {
      return this.dark ? "white" : this.darkColor;
    },
  },
  methods: {
    allowTooltip(isVisible) {
      const bounds = this.canvas.getBoundingClientRect();
      if (
        this.mouseX > bounds.y &&
        this.mouseX < bounds.y + bounds.width &&
        this.mouseY > bounds.x &&
        this.mouseY < bounds.x + bounds.height
      ) {
        this.isTooltip = true;
      } else {
        setTimeout(() => {
          this.isTooltip = isVisible;
        }, 50);
      }
    },
    showTooltip(e) {
      this.mouseX = e.clientX - 100;
      this.mouseY = e.clientY + 30;
    },
    drawRects() {
      const x = this.resolution * 0.2;
      let step = this.resolution * 1.05;
      this.rangeProportion.forEach((proportion, i) => {
        this.ctx.save();
        this.ctx.fillStyle = this.colors[i];
        this.ctx.strokeWidth = 2;
        this.ctx.fillRect(
          x,
          step - proportion,
          this.resolution * 0.11,
          proportion
        );
        this.ctx.restore();
        step -= proportion;
      });
    },
    drawMainTicks() {
      let x = this.resolution * 0.2;
      let y = this.resolution * 0.05;
      let x2 = this.resolution * 0.31;
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "black";
      for (let i = 0; i <= this.resolution; i += this.resolution / 10) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
        this.ctx.restore();
      }
    },
    drawHalfTicks() {
      let x = this.resolution * 0.2;
      let y = this.resolution * 0.05;
      let x2 = this.resolution * 0.25;
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "black";
      for (let i = 0; i <= this.resolution; i += this.resolution * 0.05) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
        this.ctx.restore();
      }
    },
    drawTicks() {
      let x = this.resolution * 0.2;
      let y = this.resolution * 0.05;
      let x2 = this.resolution * 0.225;
      this.ctx.lineWidth = this.resolution * 0.000625;
      this.ctx.strokeStyle = "black";
      for (let i = 0; i <= this.resolution; i += this.resolution * 0.01) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
        this.ctx.restore();
      }
    },
    drawPointer(score) {
      let x = this.resolution * 0.175;
      let x2 = this.resolution * 0.2;
      let y = this.resolution * 1.05 - (score / 10) * this.resolution;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = "grey";
      this.ctx.fillStyle = this.textColor;
      this.ctx.strokeWidth = this.resolution * 0.00125;
      this.ctx.moveTo(x2, y);
      this.ctx.lineTo(x, y - this.resolution * 0.015);
      this.ctx.lineTo(x, y + this.resolution * 0.015);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    },
    drawScoreFromBase10(score, source) {
      let x = this.resolution * 0.05;
      let y =
        this.resolution * 1.05 -
        (score / 10) * this.resolution +
        this.resolution * 0.015;
      this.ctx.save();
      this.ctx.strokeStyle = "black";
      this.ctx.strokeWidth = this.resolution * 0.0125;
      this.ctx.fillStyle = this.getScoreColor(source);
      this.ctx.font = `900 ${this.resolution * 0.05}px Product Sans`;
      this.ctx.fillText(source.toFixed(1), x, y);
      this.ctx.strokeText(source.toFixed(1), x, y);
      this.ctx.restore();
    },
    drawScoreFromBase100(score, source) {
      let x = 0;
      if (source === -100 || source === 100) {
        x = this.resolution * 0.03125;
      } else {
        x = this.resolution * 0.0625;
      }
      if (source > -10 && source < 10) {
        x = this.resolution * 0.0875;
      }
      let y =
        this.resolution * 1.05 -
        (score / 10) * this.resolution +
        this.resolution * 0.015;
      this.ctx.save();
      this.ctx.fillStyle = this.getScoreColor(source);
      this.ctx.font = `900 ${this.resolution * 0.05}px Product Sans`;
      this.ctx.fillText(`${source > 0 ? "+" : ""}${source.toFixed(0)}`, x, y);
      this.ctx.restore();
    },
    drawMeasureSet(measureSet) {
      let init = this.resolution * 1.0625;
      let x = this.resolution * 0.325;
      measureSet.forEach((measure, i) => {
        this.ctx.save();
        this.ctx.fillStyle = this.textColor;
        this.ctx.font = `${this.resolution * 0.035}px Arial Product Sans`;
        this.ctx.fillText(measure, x, init);
        init -= this.resolution * 0.1;
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

      this.drawPointer(score);
      if (this.base10) {
        this.drawScoreFromBase10(score, source);
      } else {
        this.drawScoreFromBase100(score, source);
      }
      if (!this.hideMeasures) {
        this.drawMeasures();
      }
      this.drawMainTicks();
    },
    animate() {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.resolution * 0.5, this.resolution * 1.1);
      let tempScore =
        this.initValue > Number(this.convertedScore)
          ? Number(this.convertedScore)
          : this.initValue;

      let temp100 = tempScore === 5 ? 0 : (tempScore * 10 - 50) * 2;

      this.drawThermometer(tempScore, this.base10 ? tempScore : temp100);

      if (this.initValue < Number(this.convertedScore)) {
        this.initValue += 0.05 * this.acceleration;
        this.acceleration += 0.01;
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
    getScoreColor(score) {
      const closest = [...this.colorRange]
        .reverse()
        .find((e) => e.step <= score);
      return closest.color;
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

<style lang="scss" scoped>
.thermometer {
  &__canvas {
    background: white;
  }
  &__container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    position: relative;
  }
  &__tooltip-trap {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-radius: 50%;
  }
  &__tooltip {
    background: white;
    border-radius: 6px;
    box-shadow: 0px 10px 20px -5px rgba(0, 0, 0, 0.247);
    height: fit-content;
    width: 200px;
    color: black;
    padding: 12px;
    z-index: 1000000;
  }
}
</style>
