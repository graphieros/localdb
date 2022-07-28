<template>
  <div
    :class="{ treemap: true}"
    @pointerout="tooltipActive = false"
  >
    <div
      v-show="tooltipActive"
      class="treemap__tooltip"
      v-html="tooltipContent"
      :style="tooltipStyle"
      @pointerout="tooltipActive = false"
    ></div>
    <svg
      :class="{ treemap__svg: true }"
      height="100%"
      width="100%"
      :viewBox="`0 0 ${width} ${height}`"
      @pointerover="tooltipActive = true"
      @pointermove="setClientPosition($event)"
      @pointerout="tooltipActive = false"
    >
      <g
        v-for="(rect, i) in squarified"
        :key="`line_${i}`"
        @pointerover="
          setClientPosition($event);
          selectRect(allRects[i]);
        "
        @pointerout="selectedRect = undefined"
      >
        <rect
          :x="rect.x0"
          :y="rect.y0"
          :height="getHeight(rect)"
          :width="getWidth(rect)"
          :fill="
            wordcloud
              ? 'transparent'
              : generateColorOpacity(
                  allRects[i].color,
                  allRects[i].normalizedValue / 50000,
                  allRects[i]
                )
          "
          :class="{ selected: selectedRect === allRects[i].id }"
        />
        <foreignObject
          v-if="showLabels"
          :x="rect.x0"
          :y="rect.y0"
          :height="rect.y1 - rect.y0"
          :width="rect.x1 - rect.x0"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            :style="textStyle(rect, allRects[i])"
            :class="{ 'text-parent': true }"
          >
            <div
              :class="{ 'text-child': true, bubbles: bubbles }"
              :style="`font-size:${
                (getWidth(rect) / width) * width + 20
              }%; line-height:${getLineHeight(
                getWidth(rect)
              )}%; word-break: break-all; color:${textColor(
                generateColorOpacity(
                  allRects[i].color,
                  allRects[i].normalizedValue / 50000,
                  allRects[i]
                )
              )}`"
            >
              
              <template v-if="justify">
                <div v-for="(letter,j) in splitText(allRects[i].name)" :key="`letter_${i}_${j}_${letter}`" v-html="letter" :class="{'impact': impact}">
              </div>
              </template>

              <template v-else>
                {{ allRects[i].name }}
              <span v-if="!showJustNames"
                >( {{ allRects[i].value.toFixed(rounding) }} )</span
              >
              </template>
              
            </div>
          </div>
        </foreignObject>
      </g>
    </svg>
    <div class="treemap__legend" v-if="showLegend && parents.length" @pointerover="tooltipActive = false">
      <div class="treemap__legend__item" v-for="(parent,i) in parents" :key="`parent_${i}`">
        	<span :style="`color:${parent.color}; font-size:1.6em;`">&#11200;</span>
        <strong style="margin:0 6px">{{parent.name}}</strong> ( {{ parent.children.length }} )
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Treemap",
  props: {
    bubbles: {
      type: Boolean,
      default: false,
    },
    dataset: {
      type: Array,
      default() {
        return [
          {
            name: "Item1",
            value: 1,
            color: "#6376DD",
            id: "serie1",
            children: [
              {
                // children inherit the color of their parent
                name: "Sub1",
                value: Math.random(),
                id: "s1_sub1",
                children: undefined,
              },
              {
                name: "Sub2",
                value: Math.random(),
                id: "s1_sub2",
                children: undefined,
              },
              {
                name: "Sub3",
                value: Math.random(),
                id: "s1_sub3",
                children: undefined,
              },
              {
                name: "Sub4",
                value: Math.random(),
                id: "s1_sub4",
                children: undefined,
              },
              {
                name: "Sub5",
                value: Math.random(),
                id: "s1_sub5",
                children: undefined,
              },
              {
                name: "Sub6",
                value: Math.random(),
                id: "s1_sub6",
                children: undefined,
              },
              {
                name: "Sub7",
                value: Math.random(),
                id: "s1_sub7",
                children: undefined,
              },
              {
                name: "Sub8",
                value: Math.random(),
                id: "s1_sub8",
                children: undefined,
              },
              {
                name: "Sub9",
                value: Math.random(),
                id: "s1_sub9",
                children: undefined,
              },
              {
                name: "Sub10",
                value: Math.random(),
                id: "s1_sub10",
                children: undefined,
              },
            ],
          },
          {
            name: "Item2",
            value: 1,
            color: "#a86232",
            id: "serie2",
            children: [
              {
                name: "Sub1",
                value: Math.random(),
                id: "s2_sub1",
                children: undefined,
              },
              {
                name: "Sub2",
                value: Math.random(),
                id: "s2_sub2",
                children: undefined,
              },
              {
                name: "Sub3",
                value: Math.random(),
                id: "s2_sub3",
                children: undefined,
              },
              {
                name: "Sub4",
                value: Math.random(),
                id: "s2_sub4",
                children: undefined,
              },
              {
                name: "Sub5",
                value: Math.random(),
                id: "s2_sub5",
                children: undefined,
              },
            ],
          },
          {
            name: "Item3",
            value: 1,
            color: "#57ad32",
            id: "serie3",
            children: [
              {
                name: "Sub1",
                value: Math.random(),
                id: "s3_sub1",
                children: undefined,
              },
              {
                name: "Sub2",
                value: Math.random(),
                id: "s3_sub2",
                children: undefined,
              },
              {
                name: "Sub3",
                value: Math.random(),
                id: "s3_sub3",
                children: undefined,
              },
              {
                name: "Sub4",
                value: Math.random(),
                id: "s3_sub4",
                children: undefined,
              },
              {
                name: "Sub5",
                value: Math.random(),
                id: "s3_sub5",
                children: undefined,
              },
            ],
          },
        ];
      },
    },
    fontFamily: {
      type: String,
      default:"", //todo
    },
    height: {
      type: Number,
      default: 400,
    },
    impact: {
      type: Boolean,
      default: false,
    },
    justify: {
      type: Boolean,
      default: false,
    },
    rounding: {
      type: Number,
      default: 1,
    },
    showJustNames: {
      type: Boolean,
      default: false,
    },
    showLabels: {
      type: Boolean,
      default: false,
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
    sorted: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 500,
    },
    wordcloud: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      clientX: undefined,
      clientY: undefined,
      selectedRect: undefined,
      tooltipContent: "",
      tooltipActive: false,
    };
  },
  mounted() {
    // this.squarified.forEach((datapoint, i) => {
    //   const {x0, y0, x1, y1} = datapoint;
    //   const canvas = document.getElementById(`rect_${this.orderedDataset[i].id}`);
    //   const ctx = canvas.getContext("2d");
    //   ctx.rect(0,0, this.getWidth({x0,x1}), this.getHeight({y0,y1}));
    //   ctx.font = "30px Jost";
    //   ctx.fillStyle = "black";
    //   ctx.fillText(this.orderedDataset[i].name, this.getWidth({x0, x1}) / 2, this.getHeight({y0, y1}) / 2);
    //   const imgElement = document.createElement('img');
    //   imgElement.src = canvas.toDataURL('image/png');
    //   document.getElementById(`parent_${this.orderedDataset[i].id}`).appendChild(imgElement);
    // })
  },
  computed: {
    allRects() {
      return this.squarified;
    },
    parents(){
      return this.rectSpecs.filter((rect) => typeof rect.children !== 'undefined').sort((a,b) => b.children.length - a.children.length);
    },
    rectSpecs() {
      return this.getMembers(this.dataset);
    },
    clientHasPosition() {
      return !!this.clientX && !!this.clientY;
    },
    orderedDataset: {
      get() {
        let dataset = [...this.dataset];
        if (this.sorted) {
          dataset = [...this.dataset].sort((a, b) => b.value - a.value);
        }

        return dataset;
      },
      set(val) {
        return val;
      },
    },
    total() {
      return this.dataset.map((item) => item.value).reduce((a, b) => a + b, 0);
    },
    squarified() {
      return this.generateRects(
        this.orderedDataset.map((el) => {
          return {
            value: el.value,
            id: el.id,
            children: el.children
              ? el.children
                  .sort((a, b) => b.value - a.value)
                  .map((item) => {
                    return {
                      ...item,
                      color: el.color,
                      parentName: el.name,
                    };
                  })
              : undefined,
            color: el.color,
            name: el.name,
          };
        }),
        { x0: 0, y0: 0, x1: this.width, y1: this.height }
      );
    },
    tooltipStyle() {
      return `
        top: ${this.clientY}px;
        left: ${this.clientX}px;
      `;
    },
  },

  methods: {
    setClientPosition({ clientX, clientY }) {
      this.clientX = clientX - 100;
      this.clientY = clientY + 12;
    },
    getLineHeight(rectWidth) {
      let ratio = 0;
      if (rectWidth > 120) {
        ratio = 0.8;
      } else if (rectWidth < 100 && rectWidth > 60) {
        ratio = 1.5;
      } else if (rectWidth <= 60 && rectWidth > 40) {
        ratio = 1.8;
      } else if (rectWidth <= 40) {
        ratio = 2.5;
      } else {
        ratio = 1.2;
      }
      return (rectWidth / this.width) * this.width * ratio;
    },
    getHeight({ y0, y1 }) {
      return y1 - y0;
    },
    getWidth({ x0, x1 }) {
      return x1 - x0;
    },
    selectRect(rect) {
      const {id, name, value, color, normalizedValue, parentName=""} = rect
      const exactShade = this.generateColorOpacity(
                  color,
                  normalizedValue / 50000,
                  rect
                )
      this.tooltipContent = `
      <div style="display: flex; align-items:center; justify-content:space-around; width: 100%;">
          <div style="height: 40px; width:fit-content; min-width: 40px; display: flex; align-items:center; justify-content:center; background:${exactShade}; margin-right:12px; font-weight:bold; color:${this.textColor(exactShade)}; padding: 0 6px; border-radius: 2px;">
              ${value.toFixed(this.rounding).toLocaleString()}
          </div>
          <div style="display: flex; flex-direction: column; align-items:start">
            <span>${parentName ? parentName : name}</span>
            <span>${parentName ? name : ''}</span>
          </div>
      </div>
      `;
      this.selectedRect = id;
    },
    textStyle(rect, source) {
      const { x0, x1, y0, y1 } = rect;
      const width = x1 - x0;
      const height = y1 - y0;
      return `
            padding: 6px;
            height: 100%;
            width: 100%;
            display: flex;
            align-items:center;
            justify-content: center;
            ${
              height > width && width < 100 && name.split("").length > 5 // TO BE FIXED !
                ? "transform: rotate(-90deg)"
                : ""
            };
            font-size: 1rem;
            font-family:${this.fontFamily}
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
          const value = row[i].normalizedValue;
          if (value < minArea) {
            minArea = value;
          }
          if (value > maxArea) {
            maxArea = value;
          }
          sumArea += value;
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
    normalizeData(data, value) {
      const dataLength = data.length;
      let dataSum = 0;
      for (let i = 0; i < dataLength; i += 1) {
        dataSum += data[i].value;
      }
      const multiplier = value / dataSum;
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
      const valueWidth = valueSum / height;
      const valueHeight = valueSum / width;
      let subXOffset = xOffset;
      let subYOffset = yOffset;
      const coordinates = [];
      if (width >= height) {
        for (let i = 0; i < rowLength; i += 1) {
          const num = row[i];
          const y1 = subYOffset + num.normalizedValue / valueWidth;
          const rectangle = {
            x0: subXOffset,
            y0: subYOffset,
            x1: subXOffset + valueWidth,
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
          const x1 = subXOffset + num.normalizedValue / valueHeight;
          const rectangle = {
            x0: subXOffset,
            y0: subYOffset,
            x1,
            y1: subYOffset + valueHeight,
          };
          const nextCoordinate = Object.assign({}, num, rectangle);
          subXOffset = x1;
          coordinates.push(nextCoordinate);
        }
        return coordinates;
      }
    },
    cutArea(rect, value) {
      const { width, height, xOffset, yOffset } = this.rectToContainer(rect);
      if (width >= height) {
        const valueWidth = value / height;
        const newWidth = width - valueWidth;
        const container = {
          xOffset: xOffset + valueWidth,
          yOffset,
          width: newWidth,
          height,
        };
        return this.containerToRect(container);
      } else {
        const valueHeight = value / width;
        const newHeight = height - valueHeight;
        const container = {
          xOffset,
          yOffset: yOffset + valueHeight,
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
      if (typeof datum.children === "undefined") {
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
    getMembers(members) {
      let children = [];
      const flattenMembers = members.map((m) => {
        if (m.children && m.children.length) {
          const total = m.children
            .map((el) => el.value)
            .reduce((a, b) => a + b);
          children = children.map((child) => {
            return { ...child, ratio: child.value / total, color: m.color };
          });
          children = [...children, ...m.children];
        }
        return m;
      });
      return flattenMembers.concat(
        children.length ? this.getMembers(children) : children
      );
    },
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : hex;
    },
    componentToHex(c) {
      let hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    rgbaToHex(color) {
      const elements = color.replace("rgba(", "").replace(")", "").split(",");
      const r = Number(elements[0]);
      const g = Number(elements[1]);
      const b = Number(elements[2]);
      return `#${this.componentToHex(r)}${this.componentToHex(
        g
      )}${this.componentToHex(b)}`;
    },
    generateColorOpacity(hex, ratio) {
      const { r, g, b } = this.hexToRgb(hex);
      return `rgba(${r},${g},${b},${ratio * (3 + ratio)})`;
    },
    splitText(text){
      let splitted = text.split("");
      splitted = splitted.map((letter) => {
        if(letter === " "){
          return "&nbsp;"
        }
        return letter.toUpperCase();
      })
      return splitted
    },
    textColor(bgColor) {
      if (bgColor) {
        let color = this.rgbaToHex(bgColor);
        color = color.charAt(0) === "#" ? color.substring(1, 7) : color;
        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(2, 4), 16);
        let b = parseInt(color.substring(4, 6), 16);
        let uiColors = [r / 255, g / 255, b / 255];
        let c = uiColors.map((col) => {
          if (col <= 0.03928) {
            return col / 12.92;
          }
          return Math.pow((col + 0.055) / 1.055, 2.4);
        });
        let L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
        return L > 0.179 ? "#000000" : "#FFFFFF";
      }
      return "#000000";
    },
  },
};
</script>

<style lang="scss" scoped>
.treemap {
  background: white;
  display: block;
  letter-spacing: -0.07em;
  margin: 0 auto;
  max-width: 1000px;
  position: relative;
  user-select: none;
  width: 100%;
  &__legend{
    align-items:center;
    background: inherit;
    display: flex;
    display: flex;
    gap:24px;
    height: 40px;
    justify-content: center;
    margin: -24px 0 0 0;
    padding: 0 24px;
    width: 100%;
    z-index:1;
    &__item{
      align-items:center;
      display: flex;
      justify-content: center;
    }
  }
  &__svg {
    margin: 0 auto;
    padding: 12px;
    width: 100%;
    // background: white;
  }
  &__tooltip {
    align-items: center;
    background: white;
    border-radius: 12px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    opacity: 0.95;
    padding: 12px 24px;
    position: fixed;
    transition: all 0.1s ease-in-out;
    width: fit-content;
  }
  rect {
    opacity: 1;
    stroke-width: 5;
    stroke: white;
    transition: opacity 0.15s ease-in-out;
  }
  rect.selected {
    opacity: 0.4;
  }
  .text-parent {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 10px 0;
  }
  .text-child {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    justify-content: space-evenly;
    row-gap: 0;
    overflow: hidden;
    padding: 1px;
    width: 100%;
    div{
      display: flex;
      align-items:center;
      justify-content: space-around;
    }
  }
  .bubbles {
    border-radius: 12px;
    box-shadow: 0 0px 100px 100px white;
  }
  .impact {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  }
}
</style>
