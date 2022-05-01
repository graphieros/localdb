<template>
  <canvas
    :height="size"
    :width="size"
    class="gauge__canvas"
    ref="customGaugeCanvas"
  ></canvas>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "GaugeCanvas",
  components: {},
  props: {
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
        return ["red", "orange", "greenyellow", "green"];
      },
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
    size: {
      type: Number | String,
      default: 400,
    },
  },
  computed: {
    canvas() {
      return this.$refs.customGaugeCanvas;
    },
    ctx() {
      return this.canvas.getContext("2d");
    },
    measures() {
      if (this.base10) {
        return [
          { value: "0", x: 75, y: 325 },
          { value: "1", x: 38, y: 257 },
          { value: "2", x: 33, y: 181 },
          { value: "3", x: 62, y: 111 },
          { value: "4", x: 117, y: 60 },
          { value: "5", x: 194, y: 42 },
          { value: "6", x: 268, y: 60 },
          { value: "7", x: 326, y: 111 },
          { value: "8", x: 355, y: 181 },
          { value: "9", x: 350, y: 257 },
          { value: "10", x: 305, y: 325 },
        ];
      } else if (this.base100) {
        return [
          { value: "-100", x: 50, y: 325 },
          { value: "-80", x: 20, y: 257 },
          { value: "-60", x: 15, y: 181 },
          { value: "-40", x: 43, y: 111 },
          { value: "-20", x: 103, y: 60 },
          { value: "0", x: 194, y: 42 },
          { value: "20", x: 268, y: 60 },
          { value: "40", x: 326, y: 111 },
          { value: "60", x: 355, y: 181 },
          { value: "80", x: 350, y: 257 },
          { value: "100", x: 305, y: 325 },
        ];
      }
    },
  },
  data() {
    return {
      chartParams: {
        x: this.size / 2,
        y: this.size / 2,
        radius: this.size / 3,
        lineWidth: this.size / 10,
        strokeStyle: "#fff",
      },
      rotation: 1.5,
    };
  },
  mounted() {
    this.drawGauge();
  },
  updated() {
    this.drawGauge();
  },
  methods: {
    drawGauge() {
      this.drawRange();
      this.drawTicks();
      this.drawPointer(10, this.getScoreColor());
      this.drawPointer(1, "white");
      this.drawPointerCenter();
      this.drawMeasures();
      this.drawScore();
    },
    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180;
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
    drawTicks() {
      const { x, y } = this.chartParams;
      const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const halfPositions = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5];
      const bigTickSize = 152;
      const smallTickSize = 130;
      const positionReset = 0;
      positions.forEach((position) => {
        const rotation = this.getGaugeRotation(position, true);
        const x2 =
          x +
          bigTickSize *
            Math.sin(this.degreesToRadians(positionReset + rotation));
        const y2 =
          y +
          bigTickSize *
            -1 *
            Math.cos(this.degreesToRadians(positionReset + rotation));
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "white";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      });
      halfPositions.forEach((position) => {
        const rotation = this.getGaugeRotation(position, true);
        const x2 =
          x +
          smallTickSize *
            Math.sin(this.degreesToRadians(positionReset + rotation));
        const y2 =
          y +
          smallTickSize *
            -1 *
            Math.cos(this.degreesToRadians(positionReset + rotation));
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = "white";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      });
    },
    drawPointer(thickness, color) {
      const { x, y } = this.chartParams;
      const pointerSize = 100;
      const positionReset = 0;
      const rotation = this.getGaugeRotation(this.score);
      const x2 =
        x +
        pointerSize * Math.sin(this.degreesToRadians(positionReset + rotation));
      const y2 =
        y +
        pointerSize *
          -1 *
          Math.cos(this.degreesToRadians(positionReset + rotation));
      this.ctx.lineWidth = thickness;
      this.ctx.strokeStyle = color;
      this.ctx.lineCap = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    },
    drawPointerCenter() {
      const { x, y } = this.chartParams;
      this.ctx.beginPath();
      this.ctx.strokeStyle = "";
      this.ctx.lineWidth = 1;
      const gradient = this.ctx.createRadialGradient(x, y, 1, x, y, 20);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, this.getScoreColor());
      this.ctx.arc(x, y, 20, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.stroke();
    },
    drawMeasures() {
      this.ctx.strokeStyle = "black";
      this.ctx.font = "20px Arial";
      this.ctx.fillStyle = "black";
      this.measures.forEach((measure) => {
        const { value, x, y } = measure;
        this.ctx.fillText(value, x, y);
      });
    },
    drawScore() {
      const { x, y } = this.chartParams;
      this.ctx.strokeStyle = this.getScoreColor(); //should depend on score;
      this.ctx.font = "700 45px Arial";
      this.ctx.fillStyle = this.getScoreColor(); //ibid;
      this.ctx.textAlign = "center";
      let sign;
      if (this.base100) {
        if (this.score > 0) {
          sign = "+";
        } else if (this.score < 0) {
          sign = " ";
        } else {
          sign = null;
        }
      }

      this.ctx.fillText(
        `${sign ? sign : ""}${this.score}`,
        sign ? x - 10 : x,
        y + 120
      );
    },
    getScoreColor() {
      //find a logic based on range & colors
      if (this.base10) {
        if (this.score < 6) {
          return this.colors[0];
        } else if (this.score >= 6 && this.score < 8) {
          return this.colors[1];
        } else if (this.score >= 8) {
          return this.colors[2];
        }
      } else if (this.base100) {
        if (this.score === 0) {
          return "grey";
        } else if (this.score > 0) {
          return this.colors[1];
        } else if (this.score < 0) {
          return this.colors[0];
        }
      }
    },
    getGaugeRotation(value = 0, isTick = false) {
      if (this.base10 || isTick) {
        return -135 + value * 27;
      } else if (this.base100) {
        return Number(value) * 1.35;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.gauge {
  &__canvas {
    background: white;
    height: 300px;
  }
}
</style>
