<template>
  <div class="dropcloud" style="width:100%; max-width: 1000px">
    <svg
      height="100%"
      width="100%"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      @pointerout="unselectDonut"
    >
      <g
        v-for="(item, i) in paths"
        :key="`circle_${i}`"
        @pointerover="selectDonut(i)"
        @click="selectDonut(i)"
        :style="`${
          typeof selectedDonutIndex === 'number' && selectedDonutIndex === i
            ? 'opacity: 1'
            : 'opacity: 0.1'
        }; ${selectedDonutIndex === undefined ? 'opacity: 1' : ''}`"
      >
        <path
          v-for="(el, j) in (selectedDonutIndex === i ? generatePaths(circles[i], circles[i].x, circles[i].y, 200, 200) : item)"
          :key="`path_${i}_${j}`"
          :d="el.path"
          :stroke="el.color"
          :stroke-width="selectedDonutIndex === i ? donutWidth*4 : donutWidth"
        />
        <foreignObject
        v-if="selectedDonutIndex === i"
          :x="circles[i].x - 200"
          :y="circles[i].y - 200"
          :height="400"
          :width="400"
          :style="'overflow: visible'"
        >
          <div
            :style="`color: black;
              text-align: center;
              height: 100%;
              width:100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size:${selectedDonutIndex === i ? '66' : circles[i].r/3}px;
              overflow: visible;
              border-radius: 50%;`
            "
          >
            {{ dataset[i].verbatim }}
          </div>
        </foreignObject>
        <foreignObject
          v-else
          :x="circles[i].x - circles[i].r"
          :y="circles[i].y - circles[i].r"
          :height="circles[i].r * 2"
          :width="circles[i].r * 2"
          :style="'overflow: visible'"
        >
          <div
            :style="`color: black;
              text-align: center;
              height: 100%;
              width:100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size:${selectedDonutIndex === i ? '66' : circles[i].r/3}px;
              overflow: visible;`
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
      default: 16,
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
      clientX: undefined,
      clientY: undefined,
      cos: Math.cos,
      drawIteration: 0,
      firstCircle: {},
      index: 0,
      initX: 0,
      initY: 0,
      maxRadius: 200,
      minRadius: 30,
      originalCircle: {},
      paths: [],
      previousCircle: {},
      anteCircle: {},
      rowIndex: 0,
      selectedDonutIndex: undefined,
      sin: Math.sin,
      starts: true,
      svgHeight: this.height,
      svgWidth: this.width,
      π: Math.PI,
    };
  },
  computed: {
    rows() {
      return [...this.dataset].map(() => {
        return [];
      });
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
      return Math.floor(Math.sqrt(this.dataset.length));
    },
  },
  mounted() {
    const sortedDataset = this.dataset
      .map((item) => {
        return {
          ...item,
          total: item.breakdown
            .map((el) => el.value)
            .reduce((a, b) => a + b, 0),
        };
      })
      .sort((a, b) => b.total - a.total);

    sortedDataset.forEach((item, i) => {
      const sum = item.breakdown
        .map((el) => el.value)
        .reduce((a, b) => a + b, 0);
      const r = (sum / this.max) * this.maxRadius;
      this.createAndDrawCircle(r, item);
    });
    sortedDataset
      .map((item) => {
        return {
          ...item,
          total: item.breakdown
            .map((el) => el.value)
            .reduce((a, b) => a + b, 0),
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
      if(index === this.selectedDonutIndex){
        this.$nextTick(this.unselectDonut)
      }
      this.$nextTick(() => {
        this.selectedDonutIndex = index;
        });
    },
    unselectDonut(){
      this.$nextTick(() => {
        this.selectedDonutIndex = undefined;
      });
    },
    createAndDrawCircle(r, item) {
      let maxItems = this.maxItemsPerRow;
      const circle = {
        x: 0,
        y: 0,
        r: r < this.minRadius ? this.minRadius : r,
        ...item,
      };

      // draw the field & first circle
      if (this.starts) {
         this.svgWidth = (circle.r * 2 + this.donutWidth * 2) * (maxItems + 2);
        this.svgHeight = this.svgWidth * 0.7;
        this.originalCircle = circle;
        this.starts = false;
      }

      // draw first row
      if (this.index <= maxItems && this.rowIndex === 0) {
        if (this.index === 0 && !this.previousCircle.hasOwnProperty("x")) {
          circle.x = this.svgWidth / 2;
          circle.y = this.svgHeight / 2;
        } else {
          circle.y = this.originalCircle.y;
          if (this.index % 2 === 0) {
            circle.x =
              this.anteCircle.x -
              this.anteCircle.r -
              circle.r -
              this.donutWidth * 2;
            console.log(this.anteCircle);
          } else {
            if (this.anteCircle.hasOwnProperty("x")) {
              circle.x =
                this.anteCircle.x +
                this.anteCircle.r +
                this.donutWidth * 2 +
                circle.r;
            } else {
              circle.x =
                this.previousCircle.x +
                this.previousCircle.r +
                this.donutWidth * 2 +
                circle.r;
            }
          }
        }
      }
      // top rows
      if (this.rowIndex % 2 === 1) {
        // first top row
        if (this.index === 0) {
              circle.x = this.originalCircle.x;
            if(this.rows[this.rowIndex - 2]){
                const refRow = this.rows[this.rowIndex - 2][0];
                circle.y = refRow.y - refRow.r - circle.r - this.donutWidth * 2; 
            }else{
                circle.y =
                this.originalCircle.y -
                this.originalCircle.r -
                circle.r -
                this.donutWidth * 2;
            }
            this.previousCircle = circle;
        }else{
            circle.y = this.previousCircle.y;
            if (this.index % 2 === 0) {
            circle.x =
              this.anteCircle.x -
              this.anteCircle.r -
              circle.r -
              this.donutWidth * 2;
            console.log(this.anteCircle);
          } else {
            if (this.anteCircle.hasOwnProperty("x")) {
              circle.x =
                this.anteCircle.x +
                this.anteCircle.r +
                this.donutWidth * 2 +
                circle.r;
            } else {
              circle.x =
                this.previousCircle.x +
                this.previousCircle.r +
                this.donutWidth * 2 +
                circle.r;
            }
          }
        }
      }
      // bottom rows
      if (this.rowIndex % 2 === 0 && this.rowIndex > 0) {
        // first top row
        if (this.index === 0) {
              circle.x = this.originalCircle.x;
            if(this.rows[this.rowIndex - 2]){
                const refRow = this.rows[this.rowIndex - 2][0];
                circle.y = refRow.y + refRow.r + circle.r + this.donutWidth * 2; 
            }else{
                circle.y =
                this.originalCircle.y -
                this.originalCircle.r -
                circle.r -
                this.donutWidth * 2;
            }
            this.previousCircle = circle;
        }else{
            circle.y = this.previousCircle.y;
            if (this.index % 2 === 0) {
            circle.x =
              this.anteCircle.x -
              this.anteCircle.r -
              circle.r -
              this.donutWidth * 2;
            console.log(this.anteCircle);
          } else {
            if (this.anteCircle.hasOwnProperty("x")) {
              circle.x =
                this.anteCircle.x +
                this.anteCircle.r +
                this.donutWidth * 2 +
                circle.r;
            } else {
              circle.x =
                this.previousCircle.x +
                this.previousCircle.r +
                this.donutWidth * 2 +
                circle.r;
            }
          }
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
        this.anteCircle = {};
        // this.svgHeight += this.originalCircle.r / 1.2; // needs fixing
      } else {
        this.anteCircle = this.previousCircle;
        this.previousCircle = circle;
        this.index += 1;
      }

      // add final padding
      if (this.drawIteration === this.dataset.length) {
        // if first row in event, offset left
        if(this.rows[0].length % 2 === 0){
            this.circles.forEach((c) => {
                c.x -= this.rows[0][0].r;
            })
        }
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
* {
    transition: all 0.1s ease-in-out;
}
.dropcloud {
    user-select: none;
  position: relative;
  &__tooltip {
    height: 100px;
    width: 100px;
    background: white;
    height: fit-content;
    &__foreignObject {
      overflow: visible;
    }
  }
  svg {
    background: white;
  }
  path {
    fill: none;
  }
  g {
    transition: all 0.1s ease-in-out;
    transform: translate();
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
