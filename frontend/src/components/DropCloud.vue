<template>
  <div class="dropcloud">
    <svg :height="svgHeight" :width="svgWidth" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">
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
        <circle
          :cx="circles[i].x"
          :cy="circles[i].y"
          :r="circles[i].r - 2"
          fill="rgba(255,255,255,0.9)"
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
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      circles: [],
      cos: Math.cos,
      maxRadius: 80,
      minRadius: 5,
      paths: [],
      sin: Math.sin,
      π: Math.PI,
      initX: 0,
      initY: 0,
      svgHeight: this.height,
      svgWidth: this.width,
      firstCircle: {},
      index: 0,
      rowIndex: 0,
      selectedDonutIndex: undefined,
      previousCircle: {},
      starts: true,
      originalCircle: {},
      drawIteration: 0,
    };
  },
  computed: {
    rows(){
        return [...this.dataset].map(() => {
            return []
        })
    },
    datasetSums() {
      return this.dataset.map((el) => {
        return el.breakdown.map((el) => el.value).reduce((a, b) => a + b);
      });
    },
    max() {
      return Math.max(...this.datasetSums);
    },
    maxItemsPerRow() {
      return Math.ceil(Math.sqrt(this.dataset.length));
    },
  },
  mounted() {
    const sortedDataset = this.dataset
      .map((item) => {
        return {
          ...item,
          total: item.breakdown.map((el) => el.value).reduce((a, b) => a + b, 0),
        };
      })
      .sort((a, b) => b.total - a.total);

    sortedDataset.forEach((item, i) => {
      const sum = item.breakdown.map((el) => el.value).reduce((a, b) => a + b, 0);
      const r = (sum / this.max) * this.maxRadius;
      // http://bl.ocks.org/fabiovalse/dfcd8104a79aed092af1
      // x and y should already be decided
      // also they could affect the svg dimensions too
      this.createAndDrawCircle(r, item.verbatim);
    });
    sortedDataset
      .map((item) => {
        return {
          ...item,
          total: item.breakdown.map((el) => el.value).reduce((a, b) => a + b, 0),
        };
      })
      .forEach((item, i) => {
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
        Math.sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y)) -
        this.donutWidth * 2
      );
    },
    createAndDrawCircle(r, name) {
      let maxItems = this.maxItemsPerRow;
      if (this.maxItemsPerRow > 5) {
        maxItems = 5;
      }
      const circle = {
        x: 0,
        y: 0,
        r: r < this.minRadius ? this.minRadius : r,
        ref: name
      };

      if (this.starts) {
        this.svgWidth = circle.r * 2 + this.donutWidth * 2;
        this.svgHeight = circle.r * 2 + this.donutWidth * 2;
        circle.x = this.svgWidth / 2;
        circle.y = this.svgHeight / 2;
        this.originalCircle = circle;
        this.starts = false;
      }

      // draw first row
      if (this.index <= maxItems && this.rowIndex === 0) {
        if (this.index === 0 && !this.previousCircle.hasOwnProperty("x")) {
          circle.x = this.svgWidth / 2;
          circle.y = this.svgHeight / 2;
        } else {
          this.svgWidth += this.donutWidth;
          circle.y =
            this.previousCircle.y +
            this.previousCircle.r -
            circle.r -
            this.donutWidth / 2;
          circle.x =
            this.previousCircle.x +
            this.previousCircle.r +
            this.donutWidth * 2 +
            circle.r;
          this.svgWidth += circle.r * 2 + this.donutWidth;
        }
      }
      // top rows
      if (this.rowIndex % 2 === 1) {
        if (this.index === 0) {
          this.circles.forEach((c) => {
            c.y += circle.r * 2;
          });
        circle.y = circle.r + this.donutWidth * 2;
          if(this.rows[this.rowIndex - 2]){
            circle.x = this.rows[this.rowIndex-2][0].x + this.rows[this.rowIndex-2][0].r + this.donutWidth;
          }else{
              circle.x = this.originalCircle.x + this.originalCircle.r + this.donutWidth * 2;
          }

          this.previousCircle = circle;
        } else {
          circle.y = this.previousCircle.y;
          circle.x = this.previousCircle.x + circle.r * 2 + this.donutWidth * 4;
          if (circle.x + circle.r + this.donutWidth * 2 > this.svgWidth) {
            this.svgWidth += circle.r * 2;
          }
        }
      }
      // bottom rows
      if (this.rowIndex % 2 === 0 && this.rowIndex > 0) { // needs fixing
        if (this.index === 0) {
          circle.x = this.rows[this.rowIndex-2][0].x + this.rows[this.rowIndex-2][0].r + this.donutWidth;
          circle.y = this.rows[this.rowIndex-2][0].y + this.rows[this.rowIndex-2][0].r + circle.r + this.donutWidth;
          if(circle.y + circle.r + this.donutWidth * 2 > this.svgHeight){
            this.svgHeight += circle.r
          }
          this.previousCircle = circle;
        } else {
            circle.y = this.previousCircle.y;
            circle.x = this.previousCircle.x + this.previousCircle.r*2 + this.donutWidth*2
        }
      }

      this.circles.push(circle);
      this.rows[this.rowIndex].push(circle);
      this.drawIteration += 1;

      // when index === maxRowSize create new row

      if (this.index === maxItems) {
        this.rowIndex += 1;
        this.index = 0;
        this.previousCircle = {};
        this.svgHeight += this.originalCircle.r/1.2; // needs fixing
      } else {
        this.previousCircle = circle;
        this.index += 1;
      }

      // add final padding
      if(this.drawIteration === this.dataset.length){
        this.circles.forEach(c => {
            c.x += this.rows[0][0].r;
            c.y += this.rows[0][0].r;
        });
                    this.svgWidth += this.rows[0][0].r*2;
                    this.svgHeight += this.rows[0][0].r*2;
      }
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
        this.matrixTimes(rotMatrix, [rx * this.cos(t1 + Δ), ry * this.sin(t1 + Δ)]),
        [cx, cy]
      );
      const fA = Δ > this.π ? 1 : 0;
      const fS = Δ > 0 ? 1 : 0;
      return `M${sX} ${sY} A ${[rx, ry, (φ / (2 * this.π)) * 360, fA, fS, eX, eY].join(
        " "
      )}`;
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
    // stroke-linecap:square;
  }
  g {
    transition: all 0.1s ease-in-out;
    transform: translate();
  }
}
</style>
