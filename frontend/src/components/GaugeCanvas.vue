<template>
  <div class="gauge__container">
    <div
      @mouseover="isTooltip = true"
      @mouseleave="isTooltip = false"
      class="gauge__tooltip-trap"
    ></div>

    <canvas
      :height="size"
      :width="size"
      class="gauge__canvas"
      ref="customGaugeCanvas"
    ></canvas>
    <div
      v-show="isTooltip && tooltipHtml"
      @mouseover="isTooltip = true"
      @mouseleave="isTooltip = false"
      class="gauge__tooltip"
      v-html="tooltipHtml"
    ></div>
  </div>
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
    tooltipHtml: {
      type: String,
      default: "",
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
      isTooltip: false,
      rotation: 1.5,
    };
  },
  mounted() {
    // window.addEventListener("mousemove", this.hover, false);
    this.drawGauge();
  },
  methods: {
    drawGauge() {
      this.ctx.clearRect(0, 0, 400, 400);
      this.drawRange();
      this.drawTicks();

      this.drawPointerCenter(20, this.getScoreColor());
      this.drawPointer(this.getScoreColor());
      this.drawPointerDetails(1, "white");
      this.drawPointerCenter(10, this.getScoreColor());

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
      const ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const halfTicks = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5];
      const tickSize = 152;
      const halfTickSize = 130;
      const positionReset = 0;
      ticks.forEach((tick) => {
        const rotation = this.getGaugeRotation(tick, true);
        const x2 =
          x +
          tickSize * Math.sin(this.degreesToRadians(positionReset + rotation));
        const y2 =
          y +
          tickSize *
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
      halfTicks.forEach((tick) => {
        const rotation = this.getGaugeRotation(tick, true);
        const x2 =
          x +
          halfTickSize *
            Math.sin(this.degreesToRadians(positionReset + rotation));
        const y2 =
          y +
          halfTickSize *
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
    drawPointer(color) {
      const { x, y } = this.chartParams;

      const pointerSize = 110;
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

      const gradient = this.ctx.createRadialGradient(x, y, 1, x2, y2, 35);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, this.getScoreColor());
      this.ctx.fillStyle = gradient;
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = color;

      let angle = Math.atan2(y2 - y, x2 - x);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(
        x2 - pointerSize * Math.cos(angle - Math.PI / 40),
        y2 - pointerSize * Math.sin(angle - Math.PI / 40)
      );
      this.ctx.lineTo(
        x2 - pointerSize * Math.cos(angle + Math.PI / 40),
        y2 - pointerSize * Math.sin(angle + Math.PI / 40)
      );

      this.ctx.lineTo(x2, y2);
      this.ctx.lineTo(
        x2 - pointerSize * Math.cos(angle - Math.PI / 40),
        y2 - pointerSize * Math.sin(angle - Math.PI / 40)
      );
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    },
    drawPointerDetails(thickness, color) {
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
    drawPointerCenter(radius, color) {
      const { x, y } = this.chartParams;
      this.ctx.beginPath();
      this.ctx.strokeStyle = "";
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
      gradient.addColorStop(1, color);
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
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
      this.ctx.strokeStyle = this.getScoreColor();
      this.ctx.font = "700 45px Arial";
      this.ctx.fillStyle = this.getScoreColor();
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
      const range = this.range;
      let colorSteps = [];
      let accumulator = 0;
      for (let i = 0; i < range.length; i += 1) {
        colorSteps.push(range[i] + accumulator);
        accumulator += range[i];
      }

      if (this.base10) {
        colorSteps = colorSteps.map((scale) => scale / 10);
        if (range.length === 2) {
          if (this.score < colorSteps[0]) {
            return this.colors[0];
          } else {
            return this.colors[1];
          }
        } else if (range.length === 3) {
          if (this.score < colorSteps[0]) {
            return this.colors[0];
          } else if (
            this.score >= colorSteps[0] &&
            this.score < colorSteps[1]
          ) {
            return this.colors[1];
          } else if (this.score >= colorSteps[1]) {
            return this.colors[2];
          }
        } else if (colorSteps.length === 4) {
          if (this.score < colorSteps[0]) {
            return this.colors[0];
          } else if (
            this.score >= colorSteps[0] &&
            this.score < colorSteps[1]
          ) {
            return this.colors[1];
          } else if (
            this.score >= colorSteps[1] &&
            this.score < colorSteps[2]
          ) {
            return this.colors[2];
          } else if (this.score >= colorSteps[2]) {
            return this.colors[3];
          }
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
    // getMousePosition(event) {
    //https://stackoverflow.com/questions/30795139/displaying-tooltips-on-mouse-hover-on-shapes-positioncoordinates-on-canvas
    //   const rect = this.canvas.getBoundingClientRect();
    //   return {
    //     x: event.clientX - rect.left,
    //     y: event.clientY - rect.top,
    //   };
    // },
    // hover(event) {
    //   const clientPosition = this.getMousePosition(event);
    //   if (!clientPosition) return;
    //   console.log(clientPosition);
    // },
  },
});
</script>

<style lang="scss" scoped>
.gauge {
  &__canvas {
    background: white;
    height: 300px;
  }
  &__container {
    width: 100%;
    position: relative;
  }
  &__tooltip-trap {
    height: 50%;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
  }
  &__tooltip {
    background: white;
    border-radius: 6px;
    bottom: 0;
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
