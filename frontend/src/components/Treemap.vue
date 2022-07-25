<template>
  <div class="treemap">
    <svg
      class="treemap__svg"
      :height="height"
      :width="width"
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="xMinYMin"
    >
      <!-- <defs>
            <rect v-for="(rect,i) in squarified" :key="`defs_${i}`" :x="rect.x0" :y="rect.y0" :height="rect.y1 - rect.y0" :width="rect.x1 - rect.x0" :id="`wrap_${i}`"/>
        </defs> -->
      <g v-for="(rect, i) in squarified" :key="`line_${i}`" @pointerover="selectRect(orderedDataset[i].id)" @pointerout="selectedRect = undefined">
        <polygon
          :points="`${rect.x0},${rect.y0} ${rect.x1},${rect.y0} ${rect.x1},${rect.y1} ${rect.x0},${rect.y1}`"
          :fill="orderedDataset[i].color" :class="{'selected' : selectedRect === orderedDataset[i].id}"
        ></polygon>
        <foreignObject
          v-if="showLabels"
          :x="rect.x0"
          :y="rect.y0"
          :height="rect.y1 - rect.y0"
          :width="rect.x1 - rect.x0"
        >
          <div xmlns="http://www.w3.org/1999/xhtml" :style="textStyle(rect)">
            <div>
              {{ orderedDataset[i].name }} :
              <strong>{{ orderedDataset[i].area }}</strong>
            </div>
          </div>
        </foreignObject>
        <!-- <text
          :x="rect.x1 - ((rect.x1 - rect.x0) / 2)"
          :y="rect.y1 - ((rect.y1 - rect.y0) /2)"
          fill="black"
          text-anchor="middle"
          :font-size="10"
          alignment-baseline="central" 
          dominant-baseline="central"
          :style="`shape-inside: url(#wrap_${i})`"
          shape-padding="20px"

        >
          {{ orderedDataset[i].name }} : {{ orderedDataset[i].area }}
        </text> -->
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "Treemap",
  props: {
    dataset: {
      type: Array,
      default() {
        return [
          {
            name: "Item1",
            area: 5,
            color: "red",
          },
          {
            name: "Item2",
            area: 8,
            color: "orange",
          },
          {
            name: "Item3",
            area: 12,
            color: "yellow",
          },
          {
            name: "Item4",
            area: 3,
            color: "green",
          },
          {
            name: "Item5",
            area: 1,
            color: "blue",
          },
        ];
      },
    },
    height: {
      type: Number,
      default: 400,
    },
    showLabels: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      selectedRect: undefined,
    };
  },
  computed: {
    orderedDataset() {
      return this.dataset.sort((a, b) => b.area - a.area).map((item, i) => {
        return {
          ...item,
          id: i
        }
      });
    },
    total() {
      return this.dataset.map((item) => item.area).reduce((a, b) => a + b, 0);
    },
    squarified() {
      return this.generateRects(
        this.orderedDataset.map((el) => {
          return { value: el.area };
        }),
        { x0: 0, y0: 0, x1: this.width, y1: this.height }
      );
    },
  },

  methods: {
    selectRect(rectId){
      console.log(rectId)
      this.selectedRect = rectId;
    },
    textStyle(rect) {
      const { x0, x1, y0, y1 } = rect;
      const width = x1 - x0;
      const height = y1 - y0;
      let fontSize = (width * height) / 1000;
      if (fontSize > 30) {
        fontSize = 30;
      }
      if (fontSize < 12) {
        fontSize = 12;
      }
      return `
            padding: 6px;
            height: 100%;
            width: 100%;
            display: flex;
            align-items:center;
            justify-content: center;
            ${height > width && width < 100 ? "transform: rotate(-90deg)" : ""};
            font-size: ${fontSize}px;
        `;
    },
    generateRects(data, container) {
      const x0 = container.x0;
      const y0 = container.y0;
      const x1 = container.x1;
      const y1 = container.y1;

      const input = {
        x0,
        y0,
        x1,
        y1,
        children: data,
      };
      return this.recurse(input);
    },
    calculateMaxAspectRatio(row, length) {
      const rowLength = row.length;
      if (rowLength === 0) {
        throw new Error("Input " + row + " is an empty array");
      } else {
        let minArea = Infinity;
        let maxArea = -Infinity;
        let sumArea = 0;
        for (let i = 0; i < rowLength; i += 1) {
          const area = row[i].normalizedValue;
          if (area < minArea) {
            minArea = area;
          }
          if (area > maxArea) {
            maxArea = area;
          }
          sumArea += area;
        }
        const result = Math.max(
          (length ** 2 * maxArea) / sumArea ** 2,
          sumArea ** 2 / (length ** 2 * minArea)
        );
        return result;
      }
    },
    doesAddingToRowImproveAspectRatio(currentRow, nextDatum, length) {
      if (currentRow.length === 0) {
        return true;
      } else {
        const newRow = currentRow.concat(nextDatum);
        const currentMaxAspectRatio = this.calculateMaxAspectRatio(
          currentRow,
          length
        );
        const newMaxAspectRatio = this.calculateMaxAspectRatio(newRow, length);
        return currentMaxAspectRatio >= newMaxAspectRatio;
      }
    },
    normalizeData(data, area) {
      const dataLength = data.length;
      let dataSum = 0;
      for (let i = 0; i < dataLength; i += 1) {
        dataSum += data[i].value;
      }
      const multiplier = area / dataSum;
      const result = [];
      let elementResult, datum;
      for (let j = 0; j < dataLength; j += 1) {
        datum = data[j];
        elementResult = Object.assign({}, datum, {
          normalizedValue: datum.value * multiplier,
        });
        result.push(elementResult);
      }
      return result;
    },
    containerToRect(container) {
      const xOffset = container.xOffset;
      const yOffset = container.yOffset;
      const width = container.width;
      const height = container.height;
      return {
        x0: xOffset,
        y0: yOffset,
        x1: xOffset + width,
        y1: yOffset + height,
      };
    },
    rectToContainer(rect) {
      const x0 = rect.x0;
      const y0 = rect.y0;
      const x1 = rect.x1;
      const y1 = rect.y1;
      return {
        xOffset: x0,
        yOffset: y0,
        width: x1 - x0,
        height: y1 - y0,
      };
    },
    getShortestEdge(input) {
      const container = this.rectToContainer(input);
      const width = container.width;
      const height = container.height;
      const result = Math.min(width, height);
      return result;
    },
    getCoordinates(row, rect) {
      const container = this.rectToContainer(rect);
      const width = container.width;
      const height = container.height;
      const xOffset = container.xOffset;
      const yOffset = container.yOffset;
      const rowLength = row.length;
      let valueSum = 0;
      for (let i = 0; i < rowLength; i += 1) {
        valueSum += row[i].normalizedValue;
      }
      const areaWidth = valueSum / height;
      const areaHeight = valueSum / width;
      let subXOffset = xOffset;
      let subYOffset = yOffset;
      const coordinates = [];
      if (width >= height) {
        for (let i = 0; i < rowLength; i += 1) {
          const num = row[i];
          const y1 = subYOffset + num.normalizedValue / areaWidth;
          const rectangle = {
            x0: subXOffset,
            y0: subYOffset,
            x1: subXOffset + areaWidth,
            y1,
          };
          const nextCoordinate = Object.assign({}, num, rectangle);
          subYOffset = y1;
          coordinates.push(nextCoordinate);
        }

        return coordinates;
      } else {
        for (let i = 0; i < rowLength; i += 1) {
          const num = row[i];
          const x1 = subXOffset + num.normalizedValue / areaHeight;
          const rectangle = {
            x0: subXOffset,
            y0: subYOffset,
            x1,
            y1: subYOffset + areaHeight,
          };
          const nextCoordinate = Object.assign({}, num, rectangle);
          subXOffset = x1;
          coordinates.push(nextCoordinate);
        }
        return coordinates;
      }
    },
    cutArea(rect, area) {
      const { width, height, xOffset, yOffset } = this.rectToContainer(rect);
      if (width >= height) {
        const areaWidth = area / height;
        const newWidth = width - areaWidth;
        const container = {
          xOffset: xOffset + areaWidth,
          yOffset,
          width: newWidth,
          height,
        };
        return this.containerToRect(container);
      } else {
        const areaHeight = area / width;
        const newHeight = height - areaHeight;
        const container = {
          xOffset,
          yOffset: yOffset + areaHeight,
          width,
          height: newHeight,
        };
        return this.containerToRect(container);
      }
    },
    squarify(inputData, inputCurrentRow, inputRect, inputStack) {
      let data = inputData,
        currentRow = inputCurrentRow,
        rect = inputRect,
        stack = inputStack;
      while (true) {
        const dataLength = data.length;
        if (dataLength === 0) {
          const newCoordinates = this.getCoordinates(currentRow, rect);
          const newStack = stack.concat(newCoordinates);
          return newStack;
        }
        const width = this.getShortestEdge(rect);
        const nextDatum = data[0];
        const restData = data.slice(1, dataLength);
        if (
          this.doesAddingToRowImproveAspectRatio(currentRow, nextDatum, width)
        ) {
          const newRow = currentRow.concat(nextDatum);
          data = restData;
          currentRow = newRow;
          rect = rect;
          stack = stack;
        } else {
          const currentRowLength = currentRow.length;
          let valueSum = 0;
          for (let i = 0; i < currentRowLength; i += 1) {
            valueSum += currentRow[i].normalizedValue;
          }
          const newContainer = this.cutArea(rect, valueSum);
          const newCoordinates = this.getCoordinates(currentRow, rect);
          const newStack = stack.concat(newCoordinates);
          data = data;
          currentRow = [];
          rect = newContainer;
          stack = newStack;
        }
      }
    },
    flatten(listOfLists) {
      const result = [];
      const listOfListsLength = listOfLists.length;
      for (let i = 0; i < listOfListsLength; i += 1) {
        const innerList = listOfLists[i];
        const innerListLength = innerList.length;
        for (let j = 0; j < innerListLength; j += 1) {
          result.push(innerList[j]);
        }
      }
      return result;
    },
    getArea(rect) {
      return (rect.x1 - rect.x0) * (rect.y1 - rect.y0);
    },
    recurse(datum) {
      if (datum.children === undefined) {
        const result = [datum];
        return result;
      } else {
        const normalizedChildren = this.normalizeData(
          datum.children,
          this.getArea(datum)
        );
        const squarified = this.squarify(normalizedChildren, [], datum, []);

        const squarifiedLength = squarified.length;
        const contained = [];
        for (let i = 0; i < squarifiedLength; i += 1) {
          contained.push(this.recurse(squarified[i]));
        }
        const flattened = this.flatten(contained);
        return flattened;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.treemap {
  &__svg {
    padding: 12px;
    background: white;
  }
  polygon {
    opacity: 0.2;
    stroke: white;
    stroke-width: 5;
    transition: opacity 0.15s ease-in-out;
    
  }
  polygon.selected{
    opacity: 0.4;
  }
}
</style>
