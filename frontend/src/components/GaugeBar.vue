<template>
  <div class="gauge-bar" :style="`height: ${this.height}px`">
    <v-btn
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
      ><v-icon>mdi-refresh</v-icon></v-btn
    >
    <canvas
      :height="barHeight + barHeight / 8"
      :width="width"
      class="gauge-bar__canvas"
      ref="gaugeBar"
    ></canvas>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "",
  props: {
    animated: {
      type: Boolean,
      default: false,
    },
    animationSpeed: {
      type: Number | String,
      default: 0,
    },
    acceleration: {
      type: Number | String,
      default: 0.3,
    },
    base10: {
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
        ];
      },
    },
    dark: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number | String,
      default: 400,
    },
    pointerColor: {
      type: String,
      default: null,
    },
    pointerSize: {
      type: Number | String,
      default: 8,
    },
    range: {
      type: Array,
      default() {
        return [0, 100];
      },
    },
    rainbow: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number | String,
      default: 0,
    },
    showRefreshButton: {
      type: Boolean,
      default: false,
    },
    tickColor: {
      type: String,
      default: "black",
    },
    tickCount: {
      type: Number | String,
      default: 10,
    },
  },
  components: {},
  data() {
    return {
      barHeight: 400,
      initValue: 0,
      speed: Number(this.animationSpeed),
    };
  },
  updated() {
    this.drawGauge();
  },
  mounted() {
    setTimeout(() => {
      this.drawGauge();
    }, 400);
  },
  computed: {
    allTicksCount() {
      return Number(this.tickCount) * 10;
    },
    canvas() {
      return this.$refs.gaugeBar;
    },
    ctx() {
      return this.canvas.getContext("2d");
    },
    fontColor() {
      if (this.dark) {
        return "white";
      }
      return "black";
    },
    halfTicksCount() {
      return Number(this.tickCount) * 2;
    },
    invertedScore() {
      if (this.base10) {
        return this.height - (Number(this.score) / 10) * this.height;
      }
      return this.height - (Number(this.score) / 100) * this.height;
    },
    fontSize() {
      return this.height / 28.57;
    },
    rectWidth() {
      return this.width / 3.5;
    },
    xTick() {
      return this.rectWidth + 20;
    },
    yTop() {
      return this.height / 16;
    },
    width() {
      return this.height / 2;
    },
  },
  methods: {
    animate() {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let tempScore =
        this.initValue > Number(this.score)
          ? Number(this.score)
          : this.initValue;
      if (this.rainbow) {
        this.drawBaseRect();
      } else {
        this.drawRectSections();
      }
      this.drawMainTicks();
      this.drawHalfTicks();
      this.drawAllTicks();
      this.drawMeasures();
      this.drawPointer(Math.round(tempScore));
      this.drawScore(Math.round(tempScore));
      if (this.initValue < Number(this.score)) {
        this.initValue += Number(this.acceleration) * this.speed;
        this.speed += Number(this.acceleration);
        requestAnimationFrame(this.animate);
      }
      this.ctx.restore();
    },
    drawGauge() {
      if (this.animated) {
        requestAnimationFrame(this.animate);
      } else {
        if (this.rainbow) {
          this.drawBaseRect();
        } else {
          this.drawRectSections();
        }
        this.drawMainTicks();
        this.drawHalfTicks();
        this.drawAllTicks();
        this.drawMeasures();
        this.drawPointer(this.invertedScore);
        this.drawScore(Number(this.score));
      }
    },
    drawScore(score) {
      const stringScore = this.base10 ? String(score / 10) : String(score);
      let offset = 0;
      if (stringScore.length === 1) {
        offset = 30;
      }
      if (stringScore.length === 2) {
        offset = 20;
      }
      if (stringScore.length === 3) {
        offset = 10;
      }

      this.ctx.save();
      this.ctx.strokeStyle = this.fontColor;
      this.ctx.font = `${this.barHeight / 18}px Arial bold`;
      this.ctx.fillStyle = this.getScoreColor(score);
      this.ctx.fillText(
        this.base10 ? score / 10 : score,
        offset,
        this.height - (score / 100) * this.height + this.barHeight / 12.3
      );
      this.ctx.restore();
    },
    drawMeasures() {
      let x = this.rectWidth;
      let y = 0 + this.yTop;
      this.ctx.save();
      this.ctx.strokeStyle = this.fontColor;
      this.ctx.font = `${this.fontSize}px Arial`;
      this.ctx.fillStyle = this.fontColor;
      for (
        let i = 0;
        i <= this.height;
        i += this.height / Number(this.tickCount)
      ) {
        const value =
          ((this.height - Math.round((i / Math.max(...this.range)) * 100)) /
            this.height) *
          100;
        this.ctx.fillText(
          this.base10 ? value / 10 : value,
          x + this.width / 2.6,
          y + i + 4
        );
      }
      this.ctx.restore();
    },
    drawPointer(score) {
      let y = this.height - (score / 100) * this.height + this.yTop;
      let x2 = this.width / 3.3;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(this.xTick, y);
      this.ctx.lineTo(x2, y - Number(this.pointerSize));
      this.ctx.lineTo(x2, y + Number(this.pointerSize));
      if (this.pointerColor) {
        this.ctx.fillStyle = this.pointerColor;
      } else {
        this.ctx.fillStyle = this.getScoreColor(score);
      }
      this.ctx.fill();
      this.ctx.restore();
    },
    drawAllTicks() {
      let y = 0 + this.yTop;
      let x2 = this.xTick + this.rectWidth - 50;
      this.ctx.save();
      this.ctx.lineWidth = 0.2;
      this.ctx.strokeStyle = this.tickColor;
      this.ctx.beginPath();
      for (let i = 0; i < this.height; i += this.height / this.allTicksCount) {
        this.ctx.moveTo(this.xTick, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
      }
      this.ctx.restore();
    },
    drawHalfTicks() {
      let y = 0 + this.yTop;
      let x2 = this.xTick + this.rectWidth - 35;
      this.ctx.save();
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeStyle = this.tickColor;
      this.ctx.beginPath();
      for (let i = 0; i < this.height; i += this.height / this.halfTicksCount) {
        this.ctx.moveTo(this.xTick, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
      }
      this.ctx.restore();
    },
    drawMainTicks() {
      let x = this.rectWidth + 20;
      let y = 0 + this.yTop;
      let x2 = x + this.rectWidth - this.width / 18;
      this.ctx.save();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = this.tickColor;
      this.ctx.beginPath();
      for (
        let i = 0;
        i < this.height;
        i += this.height / Number(this.tickCount)
      ) {
        this.ctx.moveTo(x, y + i);
        this.ctx.lineTo(x2, y + i);
        this.ctx.stroke();
      }
      this.ctx.restore();
    },
    drawRectSections() {
      this.ctx.save();
      let sectionHeights = [];
      let j = 0;
      for (let i = 0; i <= this.height; i += this.height / 10) {
        sectionHeights.push({
          value: i === 0 ? i + 25 : i - 15,
          color: [...this.colors].reverse()[j],
          height: this.height / 10,
        });
        j += 1;
      }
      sectionHeights.forEach((section) => {
        this.ctx.fillStyle = section.color;
        this.ctx.save();
        this.ctx.fillRect(
          this.rectWidth + this.width / 10,
          section.value,
          this.rectWidth - this.width / 18,
          section.height
        );
        this.ctx.restore();
      });
      this.ctx.restore();
    },
    drawBaseRect() {
      const gradient = this.ctx.createLinearGradient(
        0,
        this.width,
        0,
        this.height
      );
      [...this.colors].reverse().forEach((color, i) => {
        gradient.addColorStop(0 + i * (1 / this.colors.length), color);
      });
      this.ctx.save();
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        this.rectWidth + 20,
        this.yTop,
        this.rectWidth,
        this.height
      );
      this.ctx.restore();
    },
    getScoreColor(score) {
      const reverseColors = [...this.colors].reverse();
      const max = Math.max(...this.range);
      const min = Math.min(...this.range);
      let colorSteps = [];
      let universalScale = [];
      let i = max;
      let j = 0;
      while (i >= min) {
        colorSteps.push(i);
        universalScale.push({
          color: reverseColors[j],
          step: i,
        });
        i -= Math.abs(min - max) / 10;
        j += 1;
      }
      const color = {};

      universalScale.forEach((scale, i) => {
        color[scale.step] = scale.color;
      });

      const closest =
        universalScale.find((el) => {
          return el.step < score;
        }) || universalScale[universalScale.length - 1];

      return closest.color || this.reverseColors[0];
    },
    reinit() {
      this.initValue = 0;
      this.speed = Number(this.animationSpeed);
    },
  },
});
</script>

<style lang="scss" scoped>
.gauge-bar {
  align-items: center;
  display: flex;
  height: 100%;
  padding: 0px;
  justify-content: center;
  &__canvas {
    height: 90%;
  }
}
</style>
