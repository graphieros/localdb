<template>
  <div class="gauge__container">
    <div>
      <v-btn
        v-if="showRefreshButton"
        class="mt-n3"
        absolute
        bottom
        small
        outlined
        fab
        :color="dark ? 'grey' : darkColor"
        @click="
          reinit();
          animate();
        "
        ><v-icon>mdi-refresh</v-icon></v-btn
      >
      <div
        v-if="tooltipHtml"
        @mouseover="isTooltip = true"
        @mouseleave="isTooltip = false"
        class="gauge__tooltip-trap"
      ></div>

      <canvas
        height="400"
        width="400"
        class="gauge__canvas"
        ref="customGaugeCanvas"
        :style="{ background: colorTheme.recto, height: `${size}px` }"
      ></canvas>
      <div
        v-show="isTooltip && tooltipHtml"
        @mouseover="isTooltip = true"
        @mouseleave="isTooltip = false"
        class="gauge__tooltip"
        v-html="tooltipHtml"
        :style="`border: 1px solid ${getScoreColor(score)}`"
      ></div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "GaugeCanvas",
  components: {},
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
    msBeforeMount: {
      type: Number,
      default: 400,
    },
    range: {
      type: Array,
      default() {
        // total must be 100
        return [60, 20, 20];
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
      chartParams: {
        x: 200,
        y: 200,
        radius: 133.33,
        lineWidth: 40,
        strokeStyle: "#fff",
      },
      isLoading: true,
      isTooltip: false,
      rotation: 1.5,
      up: this.base10 ? 0 : -100,
      speed: Number(this.animationSpeed),
    };
  },
  mounted() {
    this.isLoading = true;
    setTimeout(() => {
      this.drawGauge();
      this.isLoading = false;
    }, this.msBeforeMount);
  },
  computed: {
    canvas() {
      return this.$refs.customGaugeCanvas;
    },
    ctx() {
      return this.canvas.getContext("2d");
    },
    colorTheme() {
      if (this.dark) {
        return {
          recto: this.darkColor,
          verso: "white",
        };
      } else {
        return {
          recto: "white",
          verso: this.darkColor,
        };
      }
    },
    measures() {
      if (this.base10) {
        return [
          { value: "0", x: 77, y: 325 },
          { value: "1", x: 40, y: 257 },
          { value: "2", x: 33, y: 181 },
          { value: "3", x: 62, y: 111 },
          { value: "4", x: 120, y: 57 },
          { value: "5", x: 195, y: 40 },
          { value: "6", x: 270, y: 58 },
          { value: "7", x: 330, y: 110 },
          { value: "8", x: 355, y: 181 },
          { value: "9", x: 350, y: 257 },
          { value: "10", x: 310, y: 325 },
        ];
      } else if (this.base100) {
        return [
          { value: "-100", x: 50, y: 325 },
          { value: "-80", x: 20, y: 257 },
          { value: "-60", x: 15, y: 181 },
          { value: "-40", x: 43, y: 111 },
          { value: "-20", x: 105, y: 60 },
          { value: "0", x: 195, y: 40 },
          { value: "20", x: 270, y: 60 },
          { value: "40", x: 330, y: 111 },
          { value: "60", x: 355, y: 181 },
          { value: "80", x: 350, y: 257 },
          { value: "100", x: 310, y: 325 },
        ];
      }
    },
  },

  updated() {
    this.drawGauge();
  },

  methods: {
    animate() {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const { x, y } = this.chartParams;
      const tempScore = this.up > this.score ? this.score : this.up;
      const pointerSize = 110;
      const initRotation = this.getGaugeRotation(0 + tempScore);
      const x2 =
        x + pointerSize * Math.sin(this.degreesToRadians(initRotation));
      this.ctx.clearRect(0, 0, 400, 400);
      const y2 =
        y + pointerSize * -1 * Math.cos(this.degreesToRadians(initRotation));

      this.drawRange();
      this.drawTicks();
      if (!this.hideMeasures) {
        this.drawMeasures();
      }
      this.drawHollow();
      this.drawScore(tempScore, 45, false);
      this.drawPointerCenter(20, this.getScoreColor(tempScore));
      this.drawPointer(
        x2,
        y2,
        pointerSize,
        this.getScoreColor(tempScore),
        tempScore
      );
      this.drawPointerDetails(1, x2, y2, "white");
      this.drawPointerCenter(10, this.getScoreColor(tempScore));
      if (this.up < this.score) {
        this.up += Number(this.acceleration) * this.speed;
        this.speed += Number(this.acceleration);
        requestAnimationFrame(this.animate);
      }
      this.ctx.restore();
    },
    drawGauge() {
      if (this.animated) {
        requestAnimationFrame(this.animate);
      } else {
        const { x, y } = this.chartParams;
        const pointerSize = 110;
        const initRotation = this.getGaugeRotation(this.score);
        const x2 =
          x + pointerSize * Math.sin(this.degreesToRadians(initRotation));
        this.ctx.clearRect(0, 0, 400, 400);
        const y2 =
          y + pointerSize * -1 * Math.cos(this.degreesToRadians(initRotation));
        this.drawRange();
        this.drawTicks();
        this.drawScore(this.score, 45, false);
        if (!this.hideMeasures) {
          this.drawMeasures();
        }
        this.drawHollow();
        this.drawPointerCenter(20, this.getScoreColor(this.score));
        this.drawPointer(
          x2,
          y2,
          pointerSize,
          this.getScoreColor(this.score),
          this.score
        );
        this.drawPointerDetails(1, x2, y2, "white");
        this.drawPointerCenter(10, this.getScoreColor(this.score));
      }
    },
    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180;
    },
    drawHollow() {
      const { x, y } = this.chartParams;
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.colorTheme.recto;
      this.ctx.lineWidth = 1;
      this.ctx.arc(x, y, 112, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colorTheme.recto;
      this.ctx.fill();
      this.ctx.stroke();
    },
    drawRange() {
      const { lineWidth, radius, strokeStyle, x, y } = this.chartParams;
      this.ctx.beginPath();
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.arc(x, y, radius, 0, 0);
      let df = 2.36;
      for (let i = 0; i < this.range.length; i += 1) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors[i];
        this.ctx.arc(
          x,
          y,
          radius,
          df,
          df + Math.PI * this.rotation * (this.range[i] / 100)
        );
        this.ctx.stroke();
        df += Math.PI * this.rotation * (this.range[i] / 100);
      }
    },
    drawTickType(tick, tickSize, lineWidth) {
      const { x, y } = this.chartParams;
      const rotation = this.getGaugeRotation(tick, true);
      const x2 = x + tickSize * Math.sin(this.degreesToRadians(rotation));
      const y2 = y + tickSize * -1 * Math.cos(this.degreesToRadians(rotation));
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = "rgb(60,60,60)";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    },
    drawTicks() {
      const tickTypes = [
        {
          positions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          size: 153,
          lineWidth: 2,
        },
        {
          positions: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5],
          size: 130,
          lineWidth: 1,
        },
        {
          positions: [
            0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.1, 1.2, 1.3, 1.4, 1.6,
            1.7, 1.8, 1.9, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3.1, 3.2,
            3.3, 3.4, 3.6, 3.7, 3.8, 3.9, 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 4.8,
            4.9, 5.1, 5.2, 5.3, 5.4, 5.6, 5.7, 5.8, 5.9, 6.1, 6.2, 6.3, 6.4,
            6.6, 6.7, 6.8, 6.9, 7.1, 7.2, 7.3, 7.4, 7.6, 7.7, 7.8, 7.9, 8.1,
            8.2, 8.3, 8.4, 8.6, 8.7, 8.8, 8.9, 9.1, 9.2, 9.3, 9.4, 9.6, 9.7,
            9.8, 9.9,
          ],
          size: 120,
          lineWidth: 0.5,
        },
      ];

      tickTypes.forEach((tickType) => {
        tickType.positions.forEach((position) => {
          this.drawTickType(position, tickType.size, tickType.lineWidth);
        });
      });
    },
    drawPointer(x2, y2, size, color, score) {
      const { x, y } = this.chartParams;
      const pointerWidth = 35;
      const gradient = this.ctx.createRadialGradient(x, y, 1, x2, y2, 75);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, this.getScoreColor(score) || "grey");
      this.ctx.fillStyle = gradient;
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "grey";
      let angle = Math.atan2(y2 - y, x2 - x);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(
        x2 - size * Math.cos(angle - Math.PI / pointerWidth),
        y2 - size * Math.sin(angle - Math.PI / pointerWidth)
      );
      this.ctx.lineTo(
        x2 - size * Math.cos(angle + Math.PI / pointerWidth),
        y2 - size * Math.sin(angle + Math.PI / pointerWidth)
      );
      this.ctx.lineTo(x2, y2);
      this.ctx.lineTo(
        x2 - size * Math.cos(angle - Math.PI / pointerWidth),
        y2 - size * Math.sin(angle - Math.PI / pointerWidth)
      );
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    },
    drawPointerDetails(thickness, x2, y2, color) {
      const { x, y } = this.chartParams;
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "transparent";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    },
    drawPointerCenter(radius, color) {
      const { x, y } = this.chartParams;
      this.ctx.beginPath();
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 1;
      const gradient = this.ctx.createRadialGradient(
        x,
        y,
        1,
        x + 2,
        y - radius / 2,
        radius
      );
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, "grey");
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.stroke();
    },
    drawMeasures() {
      this.ctx.strokeStyle = this.colorTheme.verso;
      this.ctx.font = "20px Arial";
      this.ctx.fillStyle = this.colorTheme.verso;
      this.measures.forEach((measure) => {
        const { value, x, y } = measure;
        this.ctx.fillText(value, x, y);
      });
    },
    drawScore(score) {
      const { x, y } = this.chartParams;
      this.ctx.strokeStyle = this.getScoreColor(score) || "grey";
      this.ctx.font = `700 45px Arial`;
      this.ctx.fillStyle = this.getScoreColor(score) || "grey";
      this.ctx.textAlign = "center";
      let sign;
      if (this.base100) {
        if (score > 0) {
          sign = "+";
        } else if (score < 0) {
          sign = " ";
        } else {
          sign = null;
        }
      }

      this.ctx.fillText(
        `${sign ? sign : ""}${score.toFixed(1)}`,
        sign ? x - 10 : x,
        y + 120
      );
    },
    getScoreColor(score) {
      const range = this.range;
      let colorSteps = [];
      let universalScale = [];
      let accumulator = 0;
      const base100Scale = [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100];
      for (let i = 0; i < range.length; i += 1) {
        colorSteps.push(range[i] + accumulator);
        universalScale.push({
          color: this.colors[i],
          step: range[i] + accumulator,
        });
        accumulator += range[i];
      }

      if (this.base10) {
        const color = {};

        universalScale.forEach((scale, i) => {
          color[scale.step] = this.colors[i];
        });

        const closest =
          universalScale.find((el) => {
            return el.step > score * 10;
          }) || universalScale[universalScale.length - 1];

        return closest.color || this.colors[0];
      } else if (this.base100) {
        if (this.colors.length === 2) {
          if (score < 0) {
            return this.colors[0];
          } else {
            return this.colors[1];
          }
        }
        colorSteps = [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100];
        const color = {};
        colorSteps = colorSteps.forEach((scale, i) => {
          color[scale] = this.colors[i] || "grey";
        });
        const closestNumber = base100Scale.reduce((a, b) => {
          return Math.abs(b - score) < Math.abs(a - score) ? b : a;
        });
        return color[String(closestNumber)] || this.colors[0];
      }
    },
    getGaugeRotation(value = 0, isTick = false) {
      if (this.base10 || isTick) {
        return -135 + value * 27;
      } else if (this.base100) {
        return Number(value) * 1.35;
      }
    },
    reinit() {
      this.up = this.base10 ? 0 : -100;
      this.speed = Number(this.animationSpeed);
    },
  },
});
</script>

<style lang="scss" scoped>
.gauge {
  &__canvas {
    height: 300px;
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
    height: 170px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 170px;
    border-radius: 50%;
  }
  &__tooltip {
    background: white;
    border-radius: 6px;
    bottom: -20px;
    box-shadow: 0px 10px 20px -5px grey;
    height: fit-content;
    left: 50%;
    max-width: 250px;
    position: absolute;
    transform: translateX(-50%);
    width: fit-content;
  }
}
</style>
