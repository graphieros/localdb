<template>
  <div class="donutcloud" style="width: 100%; max-width: 1000px">
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
        <!-- DONUT SEGMENTS -->
        <path
          v-for="(el, j) in selectedDonutIndex === i
            ? generatePaths(
                circles[i],
                circles[i].x,
                circles[i].y,
                zooming,
                zooming
              )
            : item"
          :key="`path_${i}_${j}`"
          :d="el.path"
          :stroke="el.color"
          :stroke-width="selectedDonutIndex === i ? donutWidth * 4 : donutWidth"
        />

        <!-- MARKERS -->
        <template v-if="selectedDonutIndex === i">
          <foreignObject
            @pointerover="selectDonut(i)"
            v-for="(marker, k) in generatePaths(
              circles[i],
              circles[i].x,
              circles[i].y,
              zooming,
              zooming
            )"
            :key="`marker_${k}`"
            :x="marker.center.endX"
            :y="marker.center.endY"
            :height="zooming"
            :width="zooming"
            style="overflow: visible"
          >
            <div
              :style="`
                align-items:center; 
                background:white; 
                border-radius: 50%; 
                box-shadow: 0 3px 6px rgba(0,0,0,0.31);
                color: black; 
                display: block; 
                display: flex; 
                font-size:3em; 
                font-weight: bold; 
                height: 100px !important; 
                justify-content:center; 
                margin-left:-50px; 
                margin-top:-50px; 
                padding: 12px; 
                width: 100px !important; 
                `"
            >
              {{ (marker.proportion * 100).toFixed(0) }}%
            </div>
          </foreignObject>
        </template>

        <!-- VERBATIM SELECTED STATE -->
        <foreignObject
          v-if="selectedDonutIndex === i"
          :x="circles[i].x - 200"
          :y="circles[i].y - 200"
          :height="400"
          :width="400"
          :style="'overflow: visible;'"
        >
          <div
            :style="`
              align-items: center;
              border-radius: 50%; font-weight: bold;
              color: black;
              display: flex;
              font-size:${selectedDonutIndex === i ? '66' : circles[i].r / 3}px;
              height: 100%;
              justify-content: center;
              overflow: visible;
              text-align: center;
              width:100%;
              `"
          >
            {{ dataset[i].verbatim }}
          </div>
        </foreignObject>

        <!-- VERBATIM UNSELECTED STATE -->
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
              font-size:${selectedDonutIndex === i ? '66' : circles[i].r / 3}px;
              overflow: visible;`"
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
  name: "DonutCloud",
  props: {
    dataset: {
      type: Array,
      default() {
        return [
          {
            verbatim: "Lorem",
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
            verbatim: "Ipsum",
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
            verbatim: "Consectetur",
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
    zooming: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      anteCircle: {},
      circles: [],
      cos: Math.cos,
      drawIteration: 0,
      firstCircle: {},
      index: 0,
      maxRadius: 200,
      minRadius: 30,
      originalCircle: {},
      paths: [],
      previousCircle: {},
      rowIndex: 0,
      selectedDonutIndex: undefined,
      sin: Math.sin,
      starts: true,
      svgHeight: this.height,
      svgWidth: this.width,
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
    maxItemsPerRow() {
      return Math.floor(Math.sqrt(this.dataset.length));
    },
    rows() {
      return [...this.dataset].map(() => {
        return [];
      });
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
      this.generateCloud(r, item);
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
    generateCloud(r, item) {
    
      const circle = {
        x: 0,
        y: 0,
        r: r < this.minRadius ? this.minRadius : r,
        ...item,
      };
      
      let maxItems = this.maxItemsPerRow;
      const hasReferenceRow = this.rows[this.rowIndex - 2];
      const indexIsEven = this.index % 2 === 0;
      const isBottomRow = this.rowIndex % 2 === 0 && this.rowIndex > 0;
      const isFirstCircleOfRow = this.index === 0;
      const isFirstRow = this.index <= maxItems && this.rowIndex === 0;
      const isTopRow = this.rowIndex % 2 === 1;

      if (this.starts) {
        this.svgWidth = (circle.r * 2 + this.donutWidth * 2) * (maxItems + 2);
        this.svgHeight = this.svgWidth * 0.7;
        this.originalCircle = circle;
        this.starts = false;
      }

      if (isFirstRow) {
        if (isFirstCircleOfRow && !this.previousCircle.hasOwnProperty("x")) {
          circle.x = this.svgWidth / 2;
          circle.y = this.svgHeight / 2;
        } else {
          circle.y = this.originalCircle.y;
          if (indexIsEven) {
            // place donut on the left
            circle.x =
              this.anteCircle.x -
              this.anteCircle.r -
              circle.r -
              this.donutWidth * 2;
          } else {
            // place donut on the right
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
      // after first row is completed; next rows will alternate on top and bottom
      if (isTopRow) {
        if (isFirstCircleOfRow) {
          circle.x = this.originalCircle.x;
          if (hasReferenceRow) {
            const refRow = hasReferenceRow[0];
            circle.y = refRow.y - refRow.r - circle.r - this.donutWidth * 2;
          } else {
            circle.y =
              this.originalCircle.y -
              this.originalCircle.r -
              circle.r -
              this.donutWidth * 2;
          }
          this.previousCircle = circle;
        } else {
          circle.y = this.previousCircle.y;
          if (indexIsEven) {
            circle.x =
              this.anteCircle.x -
              this.anteCircle.r -
              circle.r -
              this.donutWidth * 2;
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

      if (isBottomRow) {
        if (isFirstCircleOfRow) {
          circle.x = this.originalCircle.x;
          if (hasReferenceRow) {
            const refRow = hasReferenceRow[0];
            circle.y = refRow.y + refRow.r + circle.r + this.donutWidth * 2;
          } else {
            circle.y =
              this.originalCircle.y -
              this.originalCircle.r -
              circle.r -
              this.donutWidth * 2;
          }
          this.previousCircle = circle;
        } else {
          circle.y = this.previousCircle.y;
          if (indexIsEven) {
            circle.x =
              this.anteCircle.x -
              this.anteCircle.r -
              circle.r -
              this.donutWidth * 2;
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

      const rowHasEnded = this.index === maxItems;

      if (rowHasEnded) {
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

      const allDonutsAreDrawn = this.drawIteration === this.dataset.length;
      const rowsAreEven = this.rows[0].length % 2 === 0;

      if (allDonutsAreDrawn) {
        if (rowsAreEven) {
          this.circles.forEach((c) => {
            c.x -= this.rows[0][0].r;
          });
        }
      }
    },
    generatePaths(item, cx, cy, rx, ry) {
      const { breakdown } = item;
      const sum = [...breakdown].map((el) => el.value).reduce((a, b) => a + b);
      const ratios = [];
      let acc = 0;
      for (let i = 0; i < breakdown.length; i += 1) {
        const proportion = breakdown[i].value / sum;
        const ratio = proportion * (Math.PI * 1.999);
        // midProportion & midRatio are used to find the midpoint of the arc to display markers
        const midProportion = breakdown[i].value / 2 / sum;
        const midRatio = midProportion * (Math.PI * 1.999);
        const { startX, startY, endX, endY, path } = this.createEllipse(
          [cx, cy],
          [rx, ry],
          [acc, ratio],
          110
        );
        ratios.push({
          ...breakdown[i],
          proportion,
          ratio,
          path,
          startX,
          startY,
          endX,
          endY,
          center: this.createEllipse(
            [cx, cy],
            [rx * 1.3, ry * 1.3],
            [acc, midRatio],
            110
          ), // center of the arc, to display the marker. rx & ry are larger to be displayed with a slight offset
        });
        acc += ratio;
      }
      return ratios;
    },
    addVector([a1, a2], [b1, b2]) {
      return [a1 + b1, a2 + b2];
    },
    createEllipse([cx, cy], [rx, ry], [position, ratio], phi) {
      ratio = ratio % (2 * Math.PI);
      const rotMatrix = this.rotateMatrix(phi);
      const [sX, sY] = this.addVector(
        this.matrixTimes(rotMatrix, [
          rx * this.cos(position),
          ry * this.sin(position),
        ]),
        [cx, cy]
      );
      const [eX, eY] = this.addVector(
        this.matrixTimes(rotMatrix, [
          rx * this.cos(position + ratio),
          ry * this.sin(position + ratio),
        ]),
        [cx, cy]
      );
      const fA = ratio > Math.PI ? 1 : 0;
      const fS = ratio > 0 ? 1 : 0;
      return {
        startX: sX,
        startY: sY,
        endX: eX,
        endY: eY,
        path: `M${sX} ${sY} A ${[
          rx,
          ry,
          (phi / (2 * Math.PI)) * 360,
          fA,
          fS,
          eX,
          eY,
        ].join(" ")}`,
      };
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
    selectDonut(index) {
      if (index === this.selectedDonutIndex) {
        this.$nextTick(this.unselectDonut);
      }
      this.$nextTick(() => {
        this.selectedDonutIndex = index;
      });
    },
    unselectDonut() {
      this.$nextTick(() => {
        this.selectedDonutIndex = undefined;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  transition: all 0.1s ease-in-out;
}
.donutcloud {
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
