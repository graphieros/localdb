<template>
  <div class="dropcloud">
    <svg
      :height="svgHeight"
      :width="svgWidth"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
    >
      <g
        v-for="(item, i) in paths"
        :key="`circle_${i}`"
        @pointerover="selectDonut(i)"
        @pointerout="selectedDonutIndex = undefined"
        :style="`${
          typeof selectedDonutIndex === 'number' && selectedDonutIndex === i
            ? 'opacity: 1'
            : 'opacity: 0.1'
        }; ${selectedDonutIndex === undefined ? 'opacity: 1' : ''}`"
      >
        <path
          v-for="(el, j) in item"
          :key="`path_${i}_${j}`"
          :d="el.path"
          :stroke="el.color"
          :stroke-width="donutWidth"
        />
        <foreignObject
          :x="circles[i].x - circles[i].r"
          :y="circles[i].y - circles[i].r"
          :height="circles[i].r * 2"
          :width="circles[i].r * 2"
        >
          <div
            style="
              color: black;
              text-align: center;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            {{ dataset[i].verbatim }}
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "DropCloud",
  props: {
    dataset: {
      type: Array,
      default() {
        return [
          {
            verbatim: "1",
            breakdown: [
              {
                name: "insat",
                value: 3,
                color: "#F17171",
              },
              {
                name: "neutral",
                value: 3,
                color: "#C4C4C4",
              },
              {
                name: "sat",
                value: 3,
                color: "#15B300",
              },
            ],
          },
          {
            verbatim: "2",
            breakdown: [
              {
                name: "insat",
                value: 10,
                color: "#F17171",
              },
              {
                name: "neutral",
                value: 3,
                color: "#C4C4C4",
              },
              {
                name: "sat",
                value: 4,
                color: "#15B300",
              },
            ],
          },
          {
            verbatim: "3",
            breakdown: [
              {
                name: "insat",
                value: 1,
                color: "#F17171",
              },
              {
                name: "neutral",
                value: 2,
                color: "#C4C4C4",
              },
              {
                name: "sat",
                value: 4,
                color: "#15B300",
              },
            ],
          },
        ];
      },
    },
    donutWidth: {
      type: Number,
      default: 8,
    },
    height: {
      type: Number,
      default: 600,
    },
    width: {
      type: Number,
      default: 600,
    },
  },
  data() {
    return {
      circles: [],
      cos: Math.cos,
      maxRadius: 80,
      minRadius: 30,
      paths: [],
      sin: Math.sin,
      π: Math.PI,
      initX: this.width / 2,
      initY: 0,
      svgHeight: this.height,
      svgWidth: this.width,
      circleN1: {},
      circleN2: {},
      index: 1,
      selectedDonutIndex: undefined,
    };
  },
  computed: {
    datasetSums() {
      return this.dataset.map((el) => {
        return el.breakdown.map((el) => el.value).reduce((a, b) => a + b);
      });
    },
    max() {
      return Math.max(...this.datasetSums);
    },
  },
  mounted() {
    this.dataset.forEach((item, i) => {
      const r = (this.datasetSums[i] / this.max) * this.maxRadius;
      // http://bl.ocks.org/fabiovalse/dfcd8104a79aed092af1
      // x and y should already be decided
      // also they could affect the svg dimensions too
      this.createAndDrawCircle(r);
    });
    this.dataset.forEach((item, i) => {
      if (item && this.circles.length && this.circles[i]) {
        this.paths.push(
          this.generatePaths(
            item,
            this.circles[i].x,
            this.circles[i].y,
            this.circles[i].r,
            this.circles[i].r
          )
        );
      }
    });
  },
  methods: {
    selectDonut(index) {
      this.selectedDonutIndex = index;
    },
    // CIRCLE PACKING
    dist(c1, c2) {
      return (
        Math.sqrt(
          (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y)
        ) -
        this.donutWidth * 2
      );
    },
    createAndDrawCircle(r) {
      if (this.index === 1) {
        this.initY += r * 2 + this.donutWidth * 2;
        this.initX = r * 2 + this.donutWidth * 2;
      }
      const circle = {
        x: 0,
        y: 0,
        r: r < this.minRadius ? this.minRadius : r,
      };
      if (this.circleN1.hasOwnProperty("x")) {
        if (this.index % 2 === 0) {
          this.initX += this.circleN1.r + this.donutWidth * 2;
          this.initY += this.circleN1.r * 4 + this.donutWidth * 2;
        }
      }
      if (this.circleN2.hasOwnProperty("x")) {
        if (this.index % 1 === 0) {
          this.initX -= this.circleN2.r * 2 + this.donutWidth * 2;
          this.initY -= this.circleN2.r - this.donutWidth * 2;
        }
      }
      if (this.initX > this.svgWidth - r * 2) {
        this.initX = r * 2;
        this.initY += r / 2;
      }
    //   if (this.initY > this.svgHeight - (r * 2 + this.donutWidth * 2)) {
    //     this.svgHeight += this.initY + circle.r;
    //   }
      if (this.initX < r * 2 + this.donutWidth * 2) {
        this.initX = this.svgWidth / 1.3;
      }

      circle.x = this.initX;
      circle.y = this.initY;

      this.circles.push(circle);
      this.index += 1;

      if (this.initY > this.svgHeight - (r * 2 + this.donutWidth * 2)) {
        console.log("LAST")
        this.svgHeight = circle.y + circle.r*2;
        return;
      }
      console.log(Math.round(this.svgHeight), Math.round(circle.y));

      this.circleN2 = this.circleN1;
      this.circleN1 = circle;
    },

    // PATH GENERATION
    generatePaths(item, cx, cy, rx, ry) {
      // TODO: find cx and xy placements
      const { breakdown } = item;
      const sum = [...breakdown].map((el) => el.value).reduce((a, b) => a + b);
      const ratios = [];
      let acc = 0;
      for (let i = 0; i < breakdown.length; i += 1) {
        const proportion = breakdown[i].value / sum;
        const ratio = proportion * (this.π * 1.999);
        ratios.push({
          ...breakdown[i],
          proportion,
          ratio,
          path: this.createEllipse([cx, cy], [rx, ry], [acc, ratio], 110),
        });
        acc += ratio;
      }
      return ratios;
    },
    addVector([a1, a2], [b1, b2]) {
      return [a1 + b1, a2 + b2];
    },
    createEllipse([cx, cy], [rx, ry], [t1, Δ], φ) {
      Δ = Δ % (2 * this.π);
      const rotMatrix = this.rotateMatrix(φ);
      const [sX, sY] = this.addVector(
        this.matrixTimes(rotMatrix, [rx * this.cos(t1), ry * this.sin(t1)]),
        [cx, cy]
      );
      const [eX, eY] = this.addVector(
        this.matrixTimes(rotMatrix, [
          rx * this.cos(t1 + Δ),
          ry * this.sin(t1 + Δ),
        ]),
        [cx, cy]
      );
      const fA = Δ > this.π ? 1 : 0;
      const fS = Δ > 0 ? 1 : 0;
      return `M${sX} ${sY} A ${[
        rx,
        ry,
        (φ / (2 * this.π)) * 360,
        fA,
        fS,
        eX,
        eY,
      ].join(" ")}`;
    },
    matrixTimes([[a, b], [c, d]], [x, y]) {
      return [a * x + b * y, c * x + d * y];
    },
    rotateMatrix(x) {
      return [
        [this.cos(x), -this.sin(x)],
        [this.sin(x), this.cos(x)],
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.dropcloud {
  svg {
    background: white;
    // padding: 36px;
  }
  path {
    fill: none;
  }
  g {
    transition: all 0.1s ease-in-out;
    transform: translate();
  }
}
</style>
