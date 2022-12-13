<template>
  <div>
    <div>
      <details open>
        <summary>Tools</summary>

        <div class="tool-selection">
          <!-- DELETE -->
          <button
            :disabled="shapes.length === 0"
            :class="{ 'button-tool': true, 'button-tool--selected': isDeleteMode }"
            @click="
              isDeleteMode = !isDeleteMode;
              isMoveMode = false;
              isResizeMode = false;
              isTextMode = false;
              isWriting = false;
              activeShape = undefined;
            "
          >
            <svg style="width: 80%; margin-bottom: -4px" viewBox="0 0 24 24">
              <path
                d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
              />
            </svg>
          </button>

          <!-- MOVE -->
          <button
            :disabled="shapes.length === 0"
            :class="{ 'button-tool': true, 'button-tool--selected': isMoveMode }"
            @click="
              isMoveMode = !isMoveMode;
              activeShape = undefined;
              isDeleteMode = false;
              isDrawMode = false;
              isResizeMode = false;
              isTextMode = false;
              isWriting = false;
            "
          >
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                d="M13,11H18L16.5,9.5L17.92,8.08L21.84,12L17.92,15.92L16.5,14.5L18,13H13V18L14.5,16.5L15.92,17.92L12,21.84L8.08,17.92L9.5,16.5L11,18V13H6L7.5,14.5L6.08,15.92L2.16,12L6.08,8.08L7.5,9.5L6,11H11V6L9.5,7.5L8.08,6.08L12,2.16L15.92,6.08L14.5,7.5L13,6V11Z"
              />
            </svg>
          </button>

          <!-- RESIZE -->
          <button
            :disabled="shapes.length === 0"
            :class="{ 'button-tool': true, 'button-tool--selected': isResizeMode }"
            @click="
              isResizeMode = !isResizeMode;
              isMoveMode = false;
              isDeleteMode = false;
              isDrawMode = false;
              isTextMode = false;
              isWriting = false;
              activeShape = undefined;
            "
          >
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                d="M23,15H21V17H23V15M23,11H21V13H23V11M23,19H21V21C22,21 23,20 23,19M15,3H13V5H15V3M23,7H21V9H23V7M21,3V5H23C23,4 22,3 21,3M3,21H11V15H1V19A2,2 0 0,0 3,21M3,7H1V9H3V7M15,19H13V21H15V19M19,3H17V5H19V3M19,19H17V21H19V19M3,3C2,3 1,4 1,5H3V3M3,11H1V13H3V11M11,3H9V5H11V3M7,3H5V5H7V3Z"
              />
            </svg>
          </button>

          <!-- UNDO LAST SHAPE -->
          <button
            :disabled="shapes.length === 0"
            :class="{ 'button-tool': true, 'button-tool--one-shot': true }"
            @click="
              isResizeMode = false;
              isMoveMode = false;
              isDeleteMode = false;
              isDrawMode = false;
              isTextMode = false;
              isWriting = false;
              activeShape = undefined;
              undoLastShape();
            "
          >
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
              />
            </svg>
          </button>
        </div>

        <div class="tool-selection">
          <button
            :class="{
              'button-tool': true,
              'button-tool--selected': activeShape === 'circle',
            }"
            @click="setShapeTo('circle')"
          >
            <svg viewBox="0 0 12 12" style="width: 100%">
              <circle
                :cx="6"
                :cy="6"
                r="4"
                :fill="
                  options.circle.filled
                    ? activeShape === 'circle'
                      ? 'white'
                      : 'grey'
                    : 'none'
                "
                stroke="grey"
              ></circle>
            </svg>
          </button>
          <div class="tool-input" v-if="activeShape === 'circle'">
            <label for="circleRadius">Circle radius</label>
            <input type="number" id="circleRadius" v-model="options.circle.radius" />
          </div>
          <div class="tool-input" v-if="activeShape === 'circle'">
            <label for="circleFill">Filled</label>
            <input
              type="checkbox"
              v-model="options.circle.filled"
              :checked="options.circle.filled"
            />
          </div>

          <button
            :class="{
              'button-tool': true,
              'button-tool--selected': activeShape === 'rect',
            }"
            @click="setShapeTo('rect')"
          >
            <svg viewBox="0 0 12 12" style="width: 100%">
              <rect
                x="3"
                y="3"
                height="6"
                width="6"
                :fill="
                  options.rect.filled
                    ? activeShape === 'rect'
                      ? 'white'
                      : 'grey'
                    : 'none'
                "
                stroke="grey"
              />
            </svg>
          </button>
          <div class="tool-input" v-if="activeShape === 'rect'">
            <label for="rectFill">Filled</label>
            <input
              id="rectFill"
              type="checkbox"
              v-model="options.rect.filled"
              :checked="options.rect.filled"
            />
          </div>

          <button
            :class="{
              'button-tool': true,
              'button-tool--selected': activeShape === 'arrow',
            }"
            @click="setShapeTo('arrow')"
          >
            <svg viewBox="0 0 24 24" style="width: 100%">
              <path
                :stroke="
                  options.arrow.filled
                    ? activeShape === 'arrow'
                      ? 'white'
                      : 'grey'
                    : 'none'
                "
                stroke-width="2"
                d="M5,19 19,5"
              />
              <circle
                :fill="
                  options.arrow.filled
                    ? activeShape === 'arrow'
                      ? 'white'
                      : 'grey'
                    : 'none'
                "
                cx="17"
                cy="7"
                r="3"
              />
            </svg>
          </button>

          <!-- TEXT -->
          <button
            :class="{ 'button-tool': true, 'button-tool--selected': isTextMode }"
            @click="
              isTextMode = !isTextMode;
              isDeleteMode = false;
              isMoveMode = false;
              isResizeMode = false;
              isDrawMode = false;
              activeShape = undefined;
            "
          >
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z"
              />
            </svg>
          </button>

          <div v-if="isTextMode">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <label for="textFont" style="font-size: 0.7em">Font size</label>
              <input
                id="textFont"
                type="number"
                v-model="textFont"
                style="
                  padding: 0 4px;
                  width: 40px;
                  border: 1px solid #dadada;
                  border-radius: 3px;
                "
              />
            </div>
          </div>
        </div>
      </details>

      <!-- TEMP DEBUG COORDINATES -->
      <span style="color: blue">
        x:{{ Math.round(pointerPosition.x) }} y:{{ Math.round(pointerPosition.y) }}
      </span>
    </div>
    <svg
      :key="step"
      ref="mainSvg"
      class="draw"
      :style="`cursor:${cursorClass};`"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      width="100%"
      @pointerdown="chooseAction($event)"
      @pointerup="resetDraw"
      @pointermove="
        setPointer($event);
        chooseMove($event);
      "
      @pointerout="preventEdit = true"
      @pointerover="preventEdit = false"
      @click="clickSvg($event)"
    >
      <g
        v-for="(shape, i) in userShapes"
        :key="`shape_${i}`"
        :id="shape.id"
        v-html="shape"
        @click="
          deleteShape($event);
          isMoveMode = false;
        "
      ></g>
    </svg>
  </div>
</template>

<script>
// TODO:
// . stroke width
// . font-weight
// . stroke dasharray
// . editable text
// . visibility toggle button, showing on svg TR if shapes
// . multiline text using tspan
// . hover shape indicator
// . hover shape clickable delete icon
// . color picker using sliders
// . resize handles
// . pinhead options
// . save to JSON emit
// . better tools layout
// . move by default except when a shape tool is selected
// . copy paste shape

// KNOWN ISSUES:
// . when resizing a shape, if cursor focuses on other shape, first shape vanishes
// . resizing a rect after having moved it creates seizure effect

export default {
  props: {},
  data() {
    return {
      activeShape: undefined,
      currentPointer: {
        start: {
          x: 0,
          y: 0,
        },
        end: {
          x: 0,
          end: 0,
        },
      },
      currentTarget: undefined,
      isDeleteMode: false,
      isDrawMode: false,
      isMoveMode: false,
      isMouseDown: false,
      isDrawingNewShape: true,
      isResizeMode: false,
      isTextMode: false,
      isDrawing: false,
      isWriting: false,
      pointerDownId: -1,
      pointerPosition: {
        x: 0,
        y: 0,
      },
      preventEdit: true,
      shapes: [],
      step: 0,
      svgHeight: 1000,
      svgWidth: 1000,
      options: {
        arrow: {
          color: "grey",
          filled: true,
        },
        circle: {
          color: "grey",
          filled: false,
          radius: 3,
          strokeWidth: 2,
        },
        rect: {
          color: "grey",
          filled: false,
          strokeWidth: 2,
          height: 12,
          width: 12,
        },
      },
      textFont: 20,
    };
  },
  computed: {
    cursorClass() {
      switch (true) {
        case this.isDeleteMode:
          return "not-allowed";

        case this.isMoveMode:
          return "move";

        case this.isTextMode:
          return "text";

        case this.isResizeMode:
          return "se-resize";

        default:
          return "default";
      }
    },
    records() {
      return this.shapes;
    },
    userShapes() {
      return this.records.map((shape) => {
        switch (true) {
          case shape && shape.type === "arrow":
            return `<g id="${shape.id}">
                    <path id="${shape.id}" d="M${shape.x},${shape.y} ${shape.endX},${shape.endY}" stroke-width="1" stroke="black"/>
                    <circle id="${shape.id}" cx="${shape.endX}" cy="${shape.endY}" r="5" fill="black"/>
                </g>`;

          case shape && shape.type === "circle":
            return `<circle id="${shape.id}" cx="${shape.x}" cy="${shape.y}" r="${
              shape.circleRadius ? shape.circleRadius : Number.MIN_VALUE
            }" fill="${
              shape.circleFilled ? shape.circleColor : "rgba(255,255,255,0.001)"
            }" stroke="${shape.circleColor}" stroke-width="${
              shape.circleStrokeWidth
            }"></circle>`;

          case shape && shape.type === "rect":
            return `<g id="${shape.id}">
                      <rect 
                        id="${this.isResizeMode ? "" : shape.id}" 
                        x="${shape.x}" 
                        y="${shape.y}" 
                        fill="${
                          shape.rectFilled ? shape.rectColor : "rgba(255,255,255,0.001)"
                        }" 
                        height="${shape.rectHeight}" 
                        width="${shape.rectWidth}" 
                        stroke="${shape.rectColor}" 
                        stroke-width="${shape.rectStrokeWidth}"
                        
                      />
                      <rect id="${shape.id}"
                        x="${shape.x + shape.rectWidth}" 
                        y="${shape.y + shape.rectHeight}" 
                        height="20" 
                        width="20" 
                        fill="rgba(0,0,0,0.3)"
                        style="display:${this.isResizeMode ? "initial" : "none"};"
                      />
                    </g> `;

          case shape && shape.type === "text":
            return `<text style="user-select:none;" id="${shape.id}" x="${shape.x}" y="${shape.y}" text-anchor="middle" font-size="${shape.fontSize}">${shape.textContent}</text>`;

          default:
            break;
        }
      });
    },
  },
  created() {
    window.addEventListener("keydown", (e) => {
      this.write(e);
    });
  },
  destroyed() {
    window.removeEventListener("keydown", (e) => {
      this.write(e);
    });
  },
  methods: {
    clickSvg(e) {
      if (this.isTextMode) {
        this.isWriting = !this.isWriting;
      }

      if (!this.isWriting) {
        return;
      }
      let id = `text_${Math.random() * 10000}_${Math.random() * 99999}`;
      if (this.isWriting) {
        this.shapes.push({
          id,
          type: "text",
          x: this.pointerPosition.x,
          y: this.pointerPosition.y,
          textContent: "",
          fontSize: this.copy(this.textFont),
        });
        this.currentTarget = this.shapes.at(-1);
      }
    },
    undoLastShape() {
      this.shapes = this.shapes.slice(0, -1);
    },
    write(e) {
      if (this.preventEdit) {
        return;
      }
      e.preventDefault();
      const keyCode = e.keyCode;
      console.log(keyCode);

      if (!this.isWriting) {
        return;
      }
      const text = this.shapes.at(-1);
      this.currentTarget = text;

      if (text.type !== "text") {
        return;
      }

      const noActionKeys = [
        16,
        17,
        18,
        20,
        27,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        45,
        91,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        "unidentified",
      ];

      // TODO: find a way to move cursor with arrows (37 to 40)
      switch (true) {
        case keyCode === 8:
          text.textContent = text.textContent.slice(0, -1);
          break;
        case keyCode === 9:
          text.textContent += "&nbsp; &nbsp; &nbsp; &nbsp;";
          break;
        case keyCode === 13:
          // find a way to add a <tspan>
          return;
        case noActionKeys.includes(keyCode):
          return;

        default:
          text.textContent += e.key;
      }
    },
    chooseAction(e) {
      this.isMouseDown = true;
      switch (true) {
        case this.isDrawMode:
          this.drawDown();
          break;

        default:
          break;
      }
    },
    chooseMove(e) {
      if (e.target.localName !== "svg") {
        this.currentTarget = e.target;
      }
      switch (true) {
        case this.isMoveMode && this.isMouseDown:
          this.moveDown();
          break;

        case this.isResizeMode && this.isMouseDown:
          this.resize();
          break;

        default:
          break;
      }
    },
    copy(source) {
      return JSON.parse(JSON.stringify(source));
    },
    deleteShape(e) {
      if (!this.isDeleteMode) {
        return;
      }
      const shapeId = e.target.id;
      this.shapes = [...this.shapes].filter((shape) => shape.id !== shapeId);
    },
    drawUp(useShapeReference = false) {
      if (!this.activeShape || !this.isDrawing) {
        return;
      }
      this.currentPointer.end = {
        x: this.pointerPosition.x,
        y: this.pointerPosition.y,
      };
      let currentShape;
      if (this.shapes.length > 0 && this.currentTarget) {
        currentShape = [...this.shapes].find(
          (shape) => shape.id === this.currentTarget.id
        );
      }

      let a, b, distanceToPointer;
      if (currentShape) {
        a = currentShape.x - this.currentPointer.end.x;
        b = currentShape.y - this.currentPointer.end.y;
        distanceToPointer = Math.sqrt(a * a + b * b);
      }

      let Xmax, Xmin, Ymax, Ymin;
      if (useShapeReference) {
        Xmax = Math.max(this.currentPointer.end.x, currentShape.x);
        Xmin = Math.min(this.currentPointer.end.x, currentShape.x);
        Ymax = Math.max(this.currentPointer.end.y, currentShape.y);
        Ymin = Math.min(this.currentPointer.end.y, currentShape.y);
      } else {
        Xmax = Math.max(this.currentPointer.end.x, this.currentPointer.start.x);
        Xmin = Math.min(this.currentPointer.end.x, this.currentPointer.start.x);
        Ymax = Math.max(this.currentPointer.end.y, this.currentPointer.start.y);
        Ymin = Math.min(this.currentPointer.end.y, this.currentPointer.start.y);
      }

      this.$nextTick(() => {
        switch (true) {
          case this.activeShape === "arrow":
            this.shapes.at(-1).endX = this.currentPointer.end.x;
            this.shapes.at(-1).endY = this.currentPointer.end.y;
            break;

          case this.activeShape === "circle":
            this.shapes.at(-1).circleRadius = this.isDrawingNewShape
              ? this.copy(Xmax - Xmin)
              : distanceToPointer;
            break;

          case this.activeShape === "rect":
            this.shapes.at(-1).rectWidth =
              this.copy(this.currentPointer.end.x - this.shapes.at(-1).x) > 0
                ? this.copy(this.currentPointer.end.x - this.shapes.at(-1).x)
                : Number.MIN_VALUE;
            this.shapes.at(-1).rectHeight =
              this.copy(this.currentPointer.end.y - this.shapes.at(-1).y) > 0
                ? this.copy(this.currentPointer.end.y - this.shapes.at(-1).y)
                : Number.MIN_VALUE;

          default:
            break;
        }
      });
    },
    drawDown() {
      this.isDrawing = true;
      if (!this.activeShape) {
        return;
      }
      if (!this.isDrawing) {
        return;
      }
      this.isDrawingNewShape = true;

      this.currentPointer.start = {
        x: this.pointerPosition.x,
        y: this.pointerPosition.y,
      };
      let id = `${this.activeShape}_${Math.random() * 10000}_${Math.random() * 99999}`;

      switch (true) {
        case this.activeShape === "arrow":
          this.shapes.push({
            id,
            x: this.pointerPosition.x,
            y: this.pointerPosition.y,
            endX: this.pointerPosition.x,
            endY: this.pointerPosition.y,
            type: this.activeShape,
          });
          break;

        case this.activeShape === "circle":
          this.shapes.push({
            id,
            circleColor: this.copy(this.options.circle.color),
            circleFilled: this.copy(this.options.circle.filled),
            circleRadius: this.copy(this.options.circle.radius),
            circleStrokeWidth: this.copy(this.options.circle.strokeWidth),
            type: this.activeShape,
            x: this.pointerPosition.x,
            y: this.pointerPosition.y,
          });
          break;

        case this.activeShape === "rect":
          this.shapes.push({
            id,
            rectColor: this.copy(this.options.rect.color),
            rectFilled: this.copy(this.options.rect.filled),
            rectStrokeWidth: this.copy(this.options.rect.strokeWidth),
            rectHeight: this.copy(this.options.rect.height),
            rectWidth: this.copy(this.options.rect.width),
            type: this.activeShape,
            x: this.pointerPosition.x,
            y: this.pointerPosition.y,
          });
          break;

        default:
          break;
      }

      if (this.pointerDownId !== -1 || !this.isDrawing) {
        clearInterval(this.pointerDownId);
        this.pointerDownId = -1;
      }

      if (this.pointerDownId === -1 && this.isDrawing) {
        this.pointerDownId = setInterval(this.drawUp, 10);
        return;
      }
    },
    move(shape) {
      if (!shape || !shape.id) {
        return;
      }
      switch (true) {
        case shape.type === "arrow":
          shape.x = this.copy(this.pointerPosition.x);
          shape.y = this.copy(this.pointerPosition.y);
          // FIX
          break;

        case shape.type === "circle":
          shape.x = this.copy(this.pointerPosition.x);
          shape.y = this.copy(this.pointerPosition.y);
          break;

        case shape.type === "rect":
          shape.x = this.copy(this.pointerPosition.x - shape.rectWidth / 2);
          shape.y = this.copy(this.pointerPosition.y - shape.rectHeight / 2);
          break;

        case shape.type === "text":
          shape.x = this.copy(this.pointerPosition.x);
          shape.y = this.copy(this.pointerPosition.y);
          break;

        default:
          break;
      }
    },
    moveDown() {
      if (!this.currentTarget || !this.currentTarget.id) {
        return;
      }
      const shapeId = this.currentTarget.id;
      const shape = this.shapes.find((shape) => shape.id === shapeId);
      this.shapes = this.shapes.filter((el) => el.id !== shapeId);
      this.shapes.push(shape);

      // TODO: cancelAnimationFrame
      if (this.pointerDownId === -1 && shapeId) {
        window.requestAnimationFrame(() => this.move(shape));
      }
    },
    resetDraw() {
      this.isDrawing = false;
      this.isMouseDown = false;
      this.pointerDownId = -1;
      clearInterval(this.pointerDownId);
    },
    resize() {
      this.isDrawingNewShape = false;
      const shapeId = this.currentTarget.id;
      if (!shapeId) {
        return;
      }
      this.isDrawing = true;
      const shape = this.shapes.find((shape) => shape.id === shapeId);
      this.activeShape = shape.type;
      this.shapes = this.shapes.filter((el) => el.id !== shapeId);
      this.shapes.push(shape);
      this.drawUp(true);
    },
    setPointer(e) {
      const mainSvg = this.$refs.mainSvg;
      const rect = mainSvg.getBoundingClientRect();
      this.pointerPosition.x = ((e.clientX - rect.left) / rect.width) * this.svgWidth;
      this.pointerPosition.y = ((e.clientY - rect.top) / rect.height) * this.svgHeight;
    },
    setShapeTo(shape) {
      if (shape === this.activeShape) {
        this.activeShape = undefined;
        this.isDrawMode = false;
        return;
      }
      this.isDrawMode = true;
      this.isDeleteMode = false;
      this.isMoveMode = false;
      this.isResizeMode = false;
      this.isTextMode = false;
      this.activeShape = shape;
    },
  },
};
</script>

<style lang="scss" scoped>
.hide-shape {
  display: none;
}
button.button-tool {
  height: 36px;
  width: 36px;
  border: 1px solid grey;
  border-radius: 6px;
  opacity: 0.9;
  background: white;
  border: 1px solid #ccc;
  padding: 2px;
  &:hover {
    opacity: 1;
    border: 1px solid #aaa;
  }
  &--one-shot {
    background: grey;
    color: white;
    svg {
      background: grey;
    }
  }
  &--selected {
    background: #ccc;
    border: 1px solid rgb(42, 42, 42);
    svg {
      background: #ccc;
    }
    circle,
    rect {
      stroke: white;
    }
    path {
      fill: white;
    }
  }
}
button.button-tool:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.tool-selection {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ccc;
}
.tool-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  input {
    background: white;
    padding: 3px;
    border-radius: 3px;
    width: 40px;
  }
  label {
    font-size: 0.6em;
  }
}
text {
  user-select: none;
}
</style>
