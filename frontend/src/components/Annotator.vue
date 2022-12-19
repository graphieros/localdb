<template>
  <div>
    <div>
      <details
        @toggle="toggleSummary"
        :style="`${
          fixedTools && isSummaryOpen
            ? 'position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 2147483647; background: white; box-shadow: 0 3px 5px rgba(0,0,0,0.1);'
            : ''
        }`"
      >
        <summary>Annotations</summary>

        <div class="tool-selection">
          <!-- DELETE -->
          <button
            :disabled="shapes.length === 0"
            :class="{ 'button-tool': true, 'button-tool--selected': isDeleteMode }"
            @click="
              deleteEmptyTextElement();
              isDeleteMode = !isDeleteMode;
              isMoveMode = false;
              isResizeMode = false;
              isTextMode = false;
              isWriting = false;
              activeShape = undefined;
              showCaret = false;
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
              deleteEmptyTextElement();
              isMoveMode = !isMoveMode;
              activeShape = undefined;
              isDeleteMode = false;
              isDrawMode = false;
              isResizeMode = false;
              isTextMode = false;
              isWriting = false;
              showCaret = false;
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
              deleteEmptyTextElement();
              isResizeMode = !isResizeMode;
              isMoveMode = false;
              isDeleteMode = false;
              isDrawMode = false;
              isTextMode = false;
              isWriting = false;
              activeShape = undefined;
              showCaret = false;
            "
          >
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                d="M23,15H21V17H23V15M23,11H21V13H23V11M23,19H21V21C22,21 23,20 23,19M15,3H13V5H15V3M23,7H21V9H23V7M21,3V5H23C23,4 22,3 21,3M3,21H11V15H1V19A2,2 0 0,0 3,21M3,7H1V9H3V7M15,19H13V21H15V19M19,3H17V5H19V3M19,19H17V21H19V19M3,3C2,3 1,4 1,5H3V3M3,11H1V13H3V11M11,3H9V5H11V3M7,3H5V5H7V3Z"
              />
            </svg>
          </button>

          <!-- SEND SHAPE TO FRONT -->
          <button
            :disabled="shapes.length === 0"
            :class="{ 'button-tool': true }"
            @click="
              isResizeMode = false;
              isMoveMode = true;
              isDeleteMode = false;
              isDrawMode = false;
              isTextMode = false;
              isWriting = false;
              showCaret = false;
              bringShapeTo('front');
            "
          >
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M2,2H11V6H9V4H4V9H6V11H2V2M22,13V22H13V18H15V20H20V15H18V13H22M8,8H16V16H8V8Z"
              />
            </svg>
          </button>

          <!-- SEND SHAPE TO BACK -->
          <button
            :disabled="shapes.length === 0"
            :class="{ 'button-tool': true }"
            @click="
              isResizeMode = false;
              isMoveMode = true;
              isDeleteMode = false;
              isDrawMode = false;
              isTextMode = false;
              isWriting = false;
              showCaret = false;
              bringShapeTo('back');
            "
          >
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M2,2H11V11H2V2M9,4H4V9H9V4M22,13V22H13V13H22M15,20H20V15H15V20M16,8V11H13V8H16M11,16H8V13H11V16Z"
              />
            </svg>
          </button>

          <!-- COPY PASTE LAST SELECTED SHAPE -->
          <button
            :disabled="shapes.length === 0"
            :class="{ 'button-tool': true }"
            @click="
              deleteEmptyTextElement();
              isResizeMode = false;
              isMoveMode = true;
              isDeleteMode = false;
              isDrawMode = false;
              isTextMode = false;
              isWriting = false;
              showCaret = false;
              copyPaste();
            "
          >
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
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
              showCaret = false;
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

          <!-- PRINT -->
          <button v-if="showPrint" :class="{ 'button-tool': true }" @click="print">
            <svg style="width: 80%; margin-bottom: -7px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z"
              />
            </svg>
          </button>
        </div>

        <!-- SET SHAPE TO CIRCLE -->
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
                      ? selectedColor + colorTransparency
                      : selectedColor + colorTransparency
                    : 'none'
                "
                stroke="grey"
              ></circle>
            </svg>
          </button>
          <div class="tool-input" v-if="activeShape === 'circle'">
            <label for="circleFill">Filled</label>
            <input
              type="checkbox"
              v-model="options.circle.filled"
              @change="setFillOfSelectedCircle"
              :checked="options.circle.filled"
            />
          </div>

          <!-- SET SHAPE TO RECT -->
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
                style="rx: 0 !important; ry: 0 !important"
                height="6"
                width="6"
                :fill="
                  options.rect.filled
                    ? activeShape === 'rect'
                      ? selectedColor + colorTransparency
                      : selectedColor + colorTransparency
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
              @change="setFillOfSelectedRect"
              :checked="options.rect.filled"
            />
          </div>

          <!-- SET SHAPE TO ARRROW -->
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
                d="M5,19 19,5 14,5 19,10.5 19,5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- SET STROKE WIDTH -->
          <div v-if="['arrow', 'circle', 'rect'].includes(activeShape)">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <label for="textFont" style="font-size: 0.7em">Thickness</label>
              <input
                id="textFont"
                type="number"
                v-model="strokeSize"
                @input="setStrokeWidthOfSelectedShape"
                style="
                  padding: 0 4px;
                  width: 40px;
                  border: 1px solid #dadada;
                  border-radius: 3px;
                "
              />
            </div>
          </div>

          <!-- SET BORDER DASHARRAY -->
          <div v-if="['arrow', 'circle', 'rect'].includes(activeShape)">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <label for="dashStyle" style="font-size: 0.7em">Dashed lines</label>
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                style="margin-bottom: -5px; margin-top: -10px"
              >
                <line
                  x1="0"
                  x2="24"
                  y1="12"
                  y2="12"
                  stroke-width="2"
                  stroke="black"
                  stroke-dasharray="3"
                ></line>
              </svg>
              <input
                id="dashStyle"
                name="dashStyle"
                type="checkbox"
                v-model="isDash"
                @change="setSelectedShapeToDash"
                :checked="isDash"
              />
            </div>
          </div>

          <!-- SET SHAPE TO TEXT -->
          <button
            :class="{ 'button-tool': true, 'button-tool--selected': isTextMode }"
            @click="
              deleteEmptyTextElement();
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

          <!-- TEXT SET FONT SIZE -->
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
                @input="setCurrentStyleOfSelectedText"
                style="
                  padding: 0 4px;
                  width: 40px;
                  border: 1px solid #dadada;
                  border-radius: 3px;
                "
              />
            </div>
          </div>

          <!-- TEXT SET ALIGN START -->
          <div v-if="isTextMode">
            <button
              :class="{
                'button-tool': true,
                'button-tool--selected': textAlign === 'start',
              }"
              @click="
                isDeleteMode = false;
                isMoveMode = false;
                isResizeMode = false;
                isDrawMode = false;
                activeShape = undefined;
                textAlign = 'start';
                setSelectedTextAlignTo('start');
              "
            >
              <svg
                style="width: 24px; height: 24px; margin-bottom: -6px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3,3H21V5H3V3M3,7H15V9H3V7M3,11H21V13H3V11M3,15H15V17H3V15M3,19H21V21H3V19Z"
                />
              </svg>
            </button>
          </div>

          <!-- TEXT SET ALIGN MIDDLE -->
          <div v-if="isTextMode">
            <button
              :class="{
                'button-tool': true,
                'button-tool--selected': textAlign === 'middle',
              }"
              @click="
                isDeleteMode = false;
                isMoveMode = false;
                isResizeMode = false;
                isDrawMode = false;
                activeShape = undefined;
                textAlign = 'middle';
                setSelectedTextAlignTo('middle');
              "
            >
              <svg
                style="width: 24px; height: 24px; margin-bottom: -6px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3,3H21V5H3V3M7,7H17V9H7V7M3,11H21V13H3V11M7,15H17V17H7V15M3,19H21V21H3V19Z"
                />
              </svg>
            </button>
          </div>

          <!-- TEXT SET ALIGN END -->
          <div v-if="isTextMode">
            <button
              :class="{
                'button-tool': true,
                'button-tool--selected': textAlign === 'end',
              }"
              @click="
                isDeleteMode = false;
                isMoveMode = false;
                isResizeMode = false;
                isDrawMode = false;
                activeShape = undefined;
                textAlign = 'end';
                setSelectedTextAlignTo('end');
              "
            >
              <svg
                style="width: 24px; height: 24px; margin-bottom: -6px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3,3H21V5H3V3M9,7H21V9H9V7M3,11H21V13H3V11M9,15H21V17H9V15M3,19H21V21H3V19Z"
                />
              </svg>
            </button>
          </div>

          <!-- TEXT SET BOLD -->
          <div v-if="isTextMode">
            <button
              :class="{
                'button-tool': true,
                'button-tool--selected': isBold,
              }"
              @click="
                isDeleteMode = false;
                isMoveMode = false;
                isResizeMode = false;
                isDrawMode = false;
                activeShape = undefined;
                isBold = !isBold;
                setCurrentStyleOfSelectedText();
              "
            >
              <svg
                style="width: 24px; height: 24px; margin-bottom: -7px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z"
                />
              </svg>
            </button>
          </div>

          <!-- TEXT SET ITALIC -->
          <div v-if="isTextMode">
            <button
              :class="{
                'button-tool': true,
                'button-tool--selected': isItalic,
              }"
              @click="
                isDeleteMode = false;
                isMoveMode = false;
                isResizeMode = false;
                isDrawMode = false;
                activeShape = undefined;
                isItalic = !isItalic;
                setCurrentStyleOfSelectedText();
              "
            >
              <svg
                style="width: 24px; height: 24px; margin-bottom: -7px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z"
                />
              </svg>
            </button>
          </div>

          <!-- TEXT SET UNDERLINE -->
          <div v-if="isTextMode">
            <button
              :class="{
                'button-tool': true,
                'button-tool--selected': isUnderline,
              }"
              @click="
                isDeleteMode = false;
                isMoveMode = false;
                isResizeMode = false;
                isDrawMode = false;
                activeShape = undefined;
                isUnderline = !isUnderline;
                setCurrentStyleOfSelectedText();
              "
            >
              <svg
                style="width: 24px; height: 24px; margin-bottom: -7px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5,21H19V19H5V21M12,17A6,6 0 0,0 18,11V3H15.5V11A3.5,3.5 0 0,1 12,14.5A3.5,3.5 0 0,1 8.5,11V3H6V11A6,6 0 0,0 12,17Z"
                />
              </svg>
            </button>
          </div>

          <!-- COLOR PICKER -->
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <label for="colorPicker" style="font-size: 0.7em">Color</label>
            <input
              type="color"
              id="colorPicker"
              name="colorPicker"
              v-model="selectedColor"
              @input="setColorOfSelectedShape"
              style="height: 30px; width: 30px"
            />
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: start;
              justify-content: center;
            "
          >
            <label for="colorTransparency" style="font-size: 0.7em">
              Color alpha: {{ transparency > 98 ? 100 : transparency }} %
            </label>
            <input
              id="colorTransparency"
              name="colorTransparency"
              type="range"
              v-model="transparency"
              @input="setTransparencyOfSelectedShape"
              :min="0"
              :max="100"
              style="width: 100px"
            />
          </div>
        </div>
      </details>
    </div>

    <div
      class="annotator annotator__wrapper"
      ref="drawSvgContainer"
      style="position: relative"
    >
      <svg
        id="annotatorSvg"
        v-if="!isSummaryOpen && !hideWhenFolded"
        :key="step"
        ref="mainSvg"
        class="draw"
        :style="`cursor:${cursorClass};`"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        :width="sourceWidth"
        :height="sourceHeight"
        @pointerdown="chooseAction($event)"
        @pointerup="resetDraw"
        @pointermove="
          setPointer($event);
          chooseMove($event);
        "
        @pointerout="
          preventEdit = true;
          hoveredShapeId = undefined;
        "
        @pointerover="allowEditAndHoverShapes($event)"
        @click="clickSvg($event)"
        style="position: absolute; top: 0; left: 0"
      >
        <g
          v-for="(shape, i) in userShapes"
          :key="`shape_${i}`"
          :id="shape.id"
          v-html="shape"
          @click="
            clickShape($event);
            isMoveMode = false;
          "
        ></g>
      </svg>
      <slot></slot>
      <svg
        id="annotatorSvg"
        v-if="isSummaryOpen"
        :key="step"
        ref="mainSvg"
        class="draw"
        :style="`cursor:${cursorClass};`"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        :width="sourceWidth"
        :height="sourceHeight"
        @pointerdown="chooseAction($event)"
        @pointerup="resetDraw"
        @pointermove="
          setPointer($event);
          chooseMove($event);
        "
        @pointerout="
          preventEdit = true;
          hoveredShapeId = undefined;
        "
        @pointerover="allowEditAndHoverShapes($event)"
        @click="clickSvg($event)"
        style="position: absolute; top: 0; left: 0"
      >
        <g
          v-for="(shape, i) in userShapes"
          :key="`shape_${i}`"
          :id="shape.id"
          v-html="shape"
          @click="
            clickShape($event);
            isMoveMode = false;
          "
        ></g>
      </svg>
    </div>
  </div>
</template>

<script>
// TODO:
// . visibility toggle button, showing on svg TR if shapes
// . save to JSON emit
// . better tools layout
// . tutorial modal

// KNOWN ISSUES:
// .

// CAVEATS
// . slotted elements need to have a transparent background in order for the annotations to appear behind when menu is folded.
// . while the menu is open, interactions with the slotted element are impossible, as the svg is rendered on the closest layer. This component is meant to be used for generating quick pdfs or prints.

export default {
  name: "Annotator",
  props: {
    fixedTools: {
      type: Boolean,
      default: false,
    },
    hideWhenFolded: {
      type: Boolean,
      default: false,
    },
    showPrint: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeShape: undefined,
      strokeSize: 1,
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
      hoveredShapeId: undefined,
      isBold: false,
      isDash: false,
      isDeleteMode: false,
      isDrawing: false,
      isDrawingNewShape: true,
      isDrawMode: false,
      isItalic: false,
      isMouseDown: false,
      isMoveMode: false,
      isResizeMode: false,
      isSummaryOpen: false,
      isTextMode: false,
      isUnderline: false,
      isWriting: false,
      lastSelectedShape: undefined,
      pointerDownId: -1,
      pointerPosition: {
        x: 0,
        y: 0,
      },
      preventEdit: true,
      shapes: [],
      shapesOrder: [],
      step: Math.round(Math.random) * 100000,
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
      selectedColor: "#000000",
      showCaret: false,
      sizeRatio: 1,
      slottedSvg: undefined,
      sourceWidth: 1,
      sourceHeight: 1,
      textAlign: "start",
      textFont: 20,
      transparency: 100,
      transparencyCodes: [
        "00",
        "03",
        "05",
        "08",
        "0A",
        "0D",
        "0F",
        "12",
        "14",
        "17",
        "1A",
        "1C",
        "1F",
        "21",
        "24",
        "26",
        "29",
        "2B",
        "2E",
        "30",
        "33",
        "36",
        "38",
        "3B",
        "3D",
        "40",
        "42",
        "45",
        "47",
        "4A",
        "4D",
        "4F",
        "52",
        "54",
        "57",
        "59",
        "5C",
        "5E",
        "61",
        "63",
        "66",
        "69",
        "6B",
        "6E",
        "70",
        "73",
        "75",
        "78",
        "7A",
        "7D",
        "80",
        "82",
        "85",
        "87",
        "8A",
        "8C",
        "8F",
        "91",
        "94",
        "96",
        "99",
        "9C",
        "9E",
        "A1",
        "A3",
        "A6",
        "A8",
        "AB",
        "AD",
        "B0",
        "B3",
        "B5",
        "B8",
        "BA",
        "BD",
        "BF",
        "C2",
        "C4",
        "C7",
        "C9",
        "CC",
        "CF",
        "D1",
        "D4",
        "D6",
        "D9",
        "D8",
        "DE",
        "E0",
        "E3",
        "E6",
        "E8",
        "EB",
        "ED",
        "F0",
        "F5",
        "F7",
        "FF",
        "FF",
        "FF",
      ],
    };
  },
  watch: {
    shapes: {
      handler(newVal) {
        if (newVal.length === 0) {
          this.lastSelectedShape = undefined;
        }
      },
    },
  },
  computed: {
    colorTransparency() {
      return this.transparencyCodes[this.transparency > 98 ? 98 : this.transparency];
    },
    cursorClass() {
      switch (true) {
        case this.isDeleteMode:
          return "default";

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
            const shapeWidthMax = shape.strokeWidth > 3 ? 5 : 10;
            const shapeWidthMin = shape.strokeWidth > 3 ? 2.5 : 5;
            return `
                <defs>
                  <marker 
                    id="${shape.id}" 
                    markerWidth="${shapeWidthMax}" 
                    markerHeight="${shapeWidthMax}" 
                    refX="0" 
                    refY="${shapeWidthMin}" 
                    orient="auto"
                  >
                    <polygon 
                      points="0 0,${shapeWidthMax} ${shapeWidthMin}, 0 ${shapeWidthMax}" 
                      fill="${shape.color}"
                    />
                  </marker>
                </defs>
                ${this.includeSelectionIndicator(shape)}
                <g id="${shape.id}">
                    <path 
                      style="stroke-linecap: round !important; ${
                        shape.isDash ? `stroke-dasharray: ${shape.strokeWidth * 3}` : ""
                      }" 
                      stroke="${shape.color}" 
                      id="${shape.id}" 
                      d="M${shape.x},${shape.y} ${shape.endX},${shape.endY}" 
                      stroke-width="${shape.strokeWidth}" 
                      marker-end="url(#${shape.id})"
                      />
                </g>
                <g id="${shape.id}">
                  <rect 
                    id="${shape.id}"
                    x="${shape.x - 10}"
                    y="${shape.y - 10}"
                    height="20"
                    width="20"
                    fill="rgba(0,0,0,0.3)"
                    style="display:${
                      this.isResizeMode || this.isMoveMode ? "initial" : "none"
                    }; rx:1 !important; ry:1 !important;"
                  />
                </g>
                  ${this.includeDeleteButton(shape)}
                </g>
                `;

          case shape && shape.type === "circle":
            return `
                      <g id="${shape.id}">
                        ${this.includeSelectionIndicator(shape)}
                        <circle 
                          id="${shape.id}" 
                          cx="${shape.x}" 
                          cy="${shape.y}" 
                          r="${
                            shape.circleRadius ? shape.circleRadius : Number.MIN_VALUE
                          }"
                          fill="${
                            shape.isFilled
                              ? shape.color + shape.alpha
                              : "rgba(255,255,255,0.001)"
                          }" 
                          stroke="${shape.color + shape.alpha}" 
                          stroke-width="${shape.strokeWidth}"
                          style="${
                            shape.isDash
                              ? `stroke-dasharray: ${shape.strokeWidth * 3}`
                              : ""
                          }"
                          >
                        </circle>
                      </g>
                      
                    ${this.includeDeleteButton(shape)}`;

          case shape && shape.type === "rect":
            return `<g id="${shape.id}">
                      ${this.includeSelectionIndicator(shape)}
                      <rect
                        id="${this.isResizeMode ? "" : shape.id}"
                        x="${shape.x}"
                        y="${shape.y}"
                        fill="${
                          shape.isFilled
                            ? shape.color + shape.alpha
                            : "rgba(255,255,255,0.001)"
                        }"
                        height="${shape.rectHeight}"
                        width="${shape.rectWidth}"
                        stroke="${shape.color + shape.alpha}"
                        stroke-width="${shape.strokeWidth}"
                        style="rx:1 !important; ry:1 !important; ${
                          shape.isDash ? `stroke-dasharray: ${shape.strokeWidth * 3}` : ""
                        }"
                      />
                      <rect id="${shape.id}"
                        x="${shape.x + shape.rectWidth}"
                        y="${shape.y + shape.rectHeight}"
                        height="20"
                        width="20"
                        fill="rgba(0,0,0,0.3)"
                        style="display:${
                          this.isResizeMode ? "initial" : "none"
                        }; rx:1 !important; ry:1 !important;"
                      />
                      ${this.includeDeleteButton(shape)}
                    </g> `;

          case shape && shape.type === "text":
            const parsedText = shape.textContent.split("‎");
            const parsedContent = [];
            for (let i = 0; i < parsedText.length; i += 1) {
              parsedContent.push(`
              <tspan id="${shape.id}" x="${shape.x}" y="${shape.y + shape.fontSize * i}">
                  ${parsedText[i]}
              </tspan>`);
            }
            return `
                    ${this.includeSelectionIndicator(shape)}
                    ${this.computeTextElement(shape, parsedContent)}
                      `;
          default:
            break;
        }
      });
    },
  },
  mounted() {
    const wrapper = this.$refs.drawSvgContainer;

    const walkTheDOM = (node, func) => {
      func(node);
      node = node.firstChild;
      while (node) {
        walkTheDOM(node, func);
        node = node.nextSibling;
      }
    };

    let foundSvg = false;

    walkTheDOM(wrapper, (node) => {
      if (!foundSvg) {
        if (["DIV", "svg", "section"].includes(node.tagName)) {
          this.slottedSvg = node;
          foundSvg = true;
          return;
        }
      }
    });

    const slottedSvgRect = this.slottedSvg.getBoundingClientRect();
    this.sizeRatio = slottedSvgRect.height / slottedSvgRect.width;

    this.svgWidth = 1000;
    this.svgHeight = this.sizeRatio * 1000;
    this.sourceWidth = slottedSvgRect.width;
    this.sourceHeight = slottedSvgRect.height;

    const myObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.sourceWidth = entry.contentRect.width;
        this.sourceHeight = entry.contentRect.height;
        this.sizeRatio = entry.contentRect.height / entry.contentRect.width;
        this.svgHeight = this.sizeRatio * 1000;
      });
    });

    myObserver.observe(this.slottedSvg);

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
    bringShapeTo(layer) {
      const thisShape = this.shapes.find(
        (shape) => shape.id === this.lastSelectedShape.id
      );
      switch (true) {
        case layer === "front":
          this.shapes = this.shapes.filter((shape) => shape.id !== thisShape.id);
          this.shapes.push(thisShape);
          break;

        case layer === "back":
          this.shapes = this.shapes.filter((shape) => shape.id !== thisShape.id);
          this.shapes = [thisShape, ...this.shapes];
          break;

        default:
          return;
      }
    },
    clickSvg(e) {
      if (this.isDeleteMode) {
        return;
      }

      this.deleteEmptyTextElement();

      if (this.isTextMode) {
        this.isWriting = true;
        this.showCaret = true;
      } else {
        this.isWriting = false;
        this.showCaret = false;
        this.isTextMode = false;
      }

      let id = `text_${Math.random() * 10000}_${Math.random() * 99999}`;

      if (this.isWriting) {
        this.shapes.push({
          id,
          type: "text",
          lines: 0,
          x: this.pointerPosition.x,
          y: this.pointerPosition.y,
          textContent: "",
          fontSize: this.copy(this.textFont),
          textAlign: this.copy(this.textAlign),
          isBold: this.copy(this.isBold),
          isItalic: this.copy(this.isItalic),
          isUnderline: this.copy(this.isUnderline),
          color: this.copy(this.selectedColor),
        });
        this.currentTarget = this.shapes.at(-1);
        this.lastSelectedShape = this.shapes.at(-1);
        return;
      }

      if (e.target.id.includes("arrow")) {
        this.activeShape = "arrow";
        return;
      }
      if (e.target.id.includes("circle")) {
        this.activeShape = "circle";
        return;
      }
      if (e.target.id.includes("rect")) {
        this.activeShape = "rect";
        return;
      }

      if (e.target.id.includes("text")) {
        this.isTextMode = true;
        this.isWriting = true;
        this.showCaret = true;
        const lastShape = this.shapes.find((shape) => shape.id === e.target.id);
        if (lastShape && lastShape.textAlign) {
          this.textAlign = this.shapes.find(
            (shape) => shape.id === e.target.id
          ).textAlign;
        }
        return;
      }
    },
    copyPaste() {
      const shapeCopy = {
        ...this.lastSelectedShape,
        id: `${this.lastSelectedShape.id}_copy`,
        x: this.lastSelectedShape.x - 100 < 0 ? 1 : this.lastSelectedShape.x - 100,
        y: this.lastSelectedShape.y - 100 < 0 ? 1 : this.lastSelectedShape.y - 100,
      };
      this.shapes.push(shapeCopy);
    },
    includeDeleteButton(shape) {
      switch (true) {
        case shape.type === "circle":
          return `
              <g id="${shape.id}" style="display:${
            this.isDeleteMode ? "initial" : "none"
          };">
                <circle id="${shape.id}" cx="${shape.x}" cy="${
            shape.y
          }" r="12" fill="red"/>
                <line stroke="white" stroke-width="2" id="${shape.id}" x1="${
            shape.x - 4
          }" y1="${shape.y - 4}" x2="${shape.x + 4}" y2="${shape.y + 4}"/>
                <line stroke="white" stroke-width="2" id="${shape.id}" x1="${
            shape.x + 4
          }" y1="${shape.y - 4}" x2="${shape.x - 4}" y2="${shape.y + 4}"/>
              </g>
          `;

        case shape.type === "text":
          // determine position of delete button from textAlign property
          let offsetX;
          let offsetY = [-8, -12, -4, -12, -4];
          switch (true) {
            case shape.textAlign === "start":
              offsetX = [-16, -20, -12, -12, -20];
              break;

            case shape.textAlign === "middle":
              offsetX = [0, -4, 4, 4, -4];
              offsetY = [-32, -36, -28, -36, -28];
              break;

            case shape.textAlign === "end":
              offsetX = [16, 20, 12, 12, 20];
              break;

            default:
              offsetX = [0, 0, 0];
              break;
          }

          return `
              <g id="${shape.id}" style="display:${
            this.isDeleteMode ? "initial" : "none"
          };">
                <circle id="${shape.id}" cx="${shape.x + offsetX[0]}" cy="${
            shape.y + offsetY[0]
          }" r="12" fill="red"/>
                <line stroke="white" stroke-width="2" id="${shape.id}" x1="${
            shape.x + offsetX[1]
          }" y1="${shape.y + offsetY[1]}" x2="${shape.x + offsetX[2]}" y2="${
            shape.y + offsetY[2]
          }"/>
                <line stroke="white" stroke-width="2" id="${shape.id}" x1="${
            shape.x + offsetX[3]
          }" y1="${shape.y + offsetY[3]}" x2="${shape.x + offsetX[4]}" y2="${
            shape.y + offsetY[4]
          }"/>
              </g>
          `;

        default:
          return `
              <g id="${shape.id}" style="display:${
            this.isDeleteMode ? "initial" : "none"
          };">
                <circle id="${shape.id}" cx="${shape.x - 4}" cy="${
            shape.y - 4
          }" r="12" fill="red"/>
                <line stroke="white" stroke-width="2" id="${shape.id}" x1="${
            shape.x - 8
          }" y1="${shape.y - 8}" x2="${shape.x}" y2="${shape.y}"/>
                <line stroke="white" stroke-width="2" id="${shape.id}" x1="${
            shape.x
          }" y1="${shape.y - 8}" x2="${shape.x - 8}" y2="${shape.y}"/>
              </g>
          `;
      }
    },
    includeSelectionIndicator(shape) {
      if (!shape) {
        return;
      }

      switch (true) {
        case shape.type === "rect":
          return `
            <rect
              id="${shape.id}" 
              style="stroke-dasharray: 10; display:${
                this.hoveredShapeId && this.hoveredShapeId === shape.id
                  ? "initial"
                  : "none"
              }"
              x="${shape.x - 20}"
              y="${shape.y - 20}"
              height="${shape.rectHeight + 40}"
              width="${shape.rectWidth + 40}"
              fill="transparent"
              stroke="grey"
            />
          `;

        case shape.type === "circle":
          return `
            <rect
              id="${shape.id}" 
              style="stroke-dasharray: 10; display:${
                this.hoveredShapeId && this.hoveredShapeId === shape.id
                  ? "initial"
                  : "none"
              }"
              x="${shape.x - shape.circleRadius - 20}"
              y="${shape.y - shape.circleRadius - 20}"
              height="${shape.circleRadius * 2 + 40}"
              width="${shape.circleRadius * 2 + 40}"
              fill="transparent"
              stroke="grey"
            />
          `;

        case shape.type === "arrow":
          const isPositiveX = shape.endX - shape.x > 0;
          const isPositiveY = shape.endY - shape.y > 0;
          return `
            <rect
              id="${shape.id}" 
              style="stroke-dasharray: 10; display:${
                this.hoveredShapeId && this.hoveredShapeId === shape.id
                  ? "initial"
                  : "none"
              }"
              x="${isPositiveX ? shape.x - 20 : shape.endX - 20}"
              y="${isPositiveY ? shape.y - 20 : shape.endY - 20}"
              height="${
                isPositiveY ? shape.endY - shape.y + 40 : shape.y - shape.endY + 40
              }"
              width="${
                isPositiveX ? shape.endX - shape.x + 40 : shape.x - shape.endX + 40
              }"
              fill="transparent"
              stroke="grey"
            />
          `;

        case shape.type === "text":
          const selectedText = Array.from(
            document.getElementsByTagName("text")
          ).find((textElement) => textElement.id === shape.id);
          if (!selectedText) {
            return;
          }
          const { x, y, width, height } = selectedText.getBBox();
          return `
            <rect
              id="${shape.id}" 
              style="stroke-dasharray: 10; display:${
                this.hoveredShapeId && this.hoveredShapeId === shape.id
                  ? "initial"
                  : "none"
              }"
              x="${x - 20}"
              y="${y - 20}"
              height="${height + 40}"
              width="${width + 40}"
              fill="transparent"
              stroke="grey"
            />
          `;

        default:
          return ``;
      }
    },
    allowEditAndHoverShapes(e) {
      this.preventEdit = false;
      if (e.target && e.target.id) {
        this.hoveredShapeId = e.target.id;
      }
    },
    setSelectedTextAlignTo(position) {
      if (this.lastSelectedShape.type !== "text") {
        return;
      }
      this.lastSelectedShape.textAlign = position;
    },
    undoLastShape() {
      this.lastSelectedShape = undefined;
      this.shapes = this.shapes.slice(0, -1);
    },
    write(e) {
      if (this.preventEdit) {
        return;
      }
      e.preventDefault();
      const keyCode = e.keyCode;

      if (!this.isWriting) {
        return;
      }
      this.showCaret = true;
      let text;
      if (this.lastSelectedShape.type === "text") {
        text = this.shapes.find((shape) => shape.id === this.lastSelectedShape.id);
      } else {
        text = this.shapes.at(-1);
      }
      this.currentTarget = text;

      if (text.type !== "text") {
        return;
      }

      this.currentTarget.isBold = this.copy(this.isBold);
      this.currentTarget.isItalic = this.copy(this.isItalic);
      this.currentTarget.isUnderline = this.copy(this.isUnderline);

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

      switch (true) {
        case keyCode === 8:
          text.textContent = text.textContent.slice(0, -1);
          break;
        case keyCode === 9:
          text.textContent += "&nbsp; &nbsp; &nbsp; &nbsp;";
          break;
        case keyCode === 13:
          text.lines += 1;
          text.textContent += "‎"; // used to parse lines to create tspan elements when ENTER is pressed
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
    computeCaretPosition(shape) {
      switch (true) {
        case shape.textAlign === "middle":
          return `<path stroke="black" stroke-width="2" d="M${shape.x},${
            shape.y - shape.fontSize
          } ${shape.x},${
            shape.y - shape.fontSize - 15
          }" /> <path stroke="black" stroke-width="2" d="M${shape.x - 3},${
            shape.y - shape.fontSize - 5
          } ${shape.x},${shape.y - shape.fontSize} ${shape.x + 3},${
            shape.y - shape.fontSize - 5
          }"/>`;

        case shape.textAlign === "start":
          return `<path d="M${shape.x - 20},${shape.y - shape.fontSize / 6} ${
            shape.x - 5
          },${shape.y - shape.fontSize / 6}" stroke="black" stroke-width="2" />
                  <path  d="M${shape.x - 10},${shape.y - shape.fontSize / 3} ${
            shape.x - 5
          },${shape.y - shape.fontSize / 6} ${shape.x - 10},${
            shape.y
          }" stroke="black" stroke-width="2">`;

        case shape.textAlign === "end":
          return `<path d="M${shape.x + 20},${shape.y - shape.fontSize / 6} ${
            shape.x + 5
          },${shape.y - shape.fontSize / 6}" stroke="black" stroke-width="2" />
                  <path d="M${shape.x + 10},${shape.y - shape.fontSize / 3} ${
            shape.x + 5
          },${shape.y - shape.fontSize / 6} ${shape.x + 10},${
            shape.y
          }" stroke="black" stroke-width="2">`;

        default:
          return "";
      }
    },
    computeTextElement(shape, content) {
      switch (true) {
        case shape.textAlign === "start":
          return `
          <g id="${shape.id}">
            <rect 
                id="${shape.id}" 
                style="display:${
                  this.lastSelectedShape && this.lastSelectedShape.id === shape.id
                    ? "initial"
                    : "none"
                };" 
                x="${shape.x}" 
                y="${shape.y - 50}" 
                height="${
                  shape.lines === 0 || shape.lines === 1
                    ? shape.fontSize * 4
                    : shape.fontSize * 2 * shape.lines
                }"
                width="100" 
                fill="rgba(0,0,0,0)"
              />
            <text
              style="user-select:none; height:100px;"
              id="${shape.id}"
              x="${shape.x}"
              y="${shape.y}"
              text-anchor="${shape.textAlign}"
              font-size="${shape.fontSize}"
              fill="${shape.color}"
              font-weight="${shape.isBold ? "bold" : "normal"}"
              font-style="${shape.isItalic ? "italic" : "normal"}"
              text-decoration="${shape.isUnderline ? "underline" : "none"}"
              >
                ${content.join("")}
              </text>
              ${
                this.showCaret &&
                this.lastSelectedShape &&
                this.lastSelectedShape.id === shape.id
                  ? this.computeCaretPosition(shape)
                  : ""
              }
              ${this.includeDeleteButton(shape)}
          </g> 
          `;

        case shape.textAlign === "middle":
          return `
            <g id="${shape.id}">
              <rect 
                id="${shape.id}" 
                style="display:${
                  this.lastSelectedShape && this.lastSelectedShape.id === shape.id
                    ? "initial"
                    : "none"
                };" 
                x="${shape.x - 50}" 
                y="${shape.y - 50}" 
                height="${
                  shape.lines === 0 || shape.lines === 1
                    ? shape.fontSize * 4
                    : shape.fontSize * 2 * shape.lines
                }"
                width="100" 
                fill="rgba(0,0,0,0)"
              />
              <text
              style="user-select:none; height:100px;"
              id="${shape.id}"
              x="${shape.x}"
              y="${shape.y}"
              text-anchor="${shape.textAlign}"
              font-size="${shape.fontSize}"
              fill="${shape.color}"
              font-weight="${shape.isBold ? "bold" : "normal"}"
              font-style="${shape.isItalic ? "italic" : "normal"}"
              text-decoration="${shape.isUnderline ? "underline" : "none"}"
              >
                ${content.join("")}
              </text>
              ${
                this.showCaret &&
                this.lastSelectedShape &&
                this.lastSelectedShape.id === shape.id
                  ? this.computeCaretPosition(shape)
                  : ""
              }
              ${this.includeDeleteButton(shape)}
            </g>
          `;

        case shape.textAlign === "end":
          return `
          <g id="${shape.id}">
            <rect 
                id="${shape.id}" 
                style="display:${
                  this.lastSelectedShape && this.lastSelectedShape.id === shape.id
                    ? "initial"
                    : "none"
                };" 
                x="${shape.x - 100}" 
                y="${shape.y - 50}" 
                height="${
                  shape.lines === 0 || shape.lines === 1
                    ? shape.fontSize * 4
                    : shape.fontSize * 2 * shape.lines
                }"
                width="100" 
                fill="rgba(0,0,0,0)"
              />
            <text
              style="user-select:none; height:100px;"
              id="${shape.id}"
              x="${shape.x}"
              y="${shape.y}"
              text-anchor="${shape.textAlign}"
              font-size="${shape.fontSize}"
              fill="${shape.color}"
              font-weight="${shape.isBold ? "bold" : "normal"}"
              font-style="${shape.isItalic ? "italic" : "normal"}"
              text-decoration="${shape.isUnderline ? "underline" : "none"}"
              >
                ${content.join("")}
              </text>
              ${
                this.showCaret &&
                this.lastSelectedShape &&
                this.lastSelectedShape.id === shape.id
                  ? this.computeCaretPosition(shape)
                  : ""
              }
              ${this.includeDeleteButton(shape)}
          </g> 
          `;

        default:
          return "";
      }
    },
    copy(source) {
      return JSON.parse(JSON.stringify(source));
    },
    clickShape(e) {
      const shapeId = e.target.id;
      switch (true) {
        case this.isDeleteMode:
          this.shapes = [...this.shapes].filter((shape) => shape.id !== shapeId);
          this.lastSelectedShape = undefined;
          break;

        default:
          this.lastSelectedShape = this.shapes.find((shape) => shape.id === shapeId);
          break;
      }
    },
    deleteEmptyTextElement() {
      if (!this.lastSelectedShape || !this.lastSelectedShape.id.includes("text")) {
        return;
      }

      if (this.lastSelectedShape.textContent === "") {
        this.shapes = this.shapes.filter(
          (shape) => shape.id !== this.lastSelectedShape.id
        );
        this.lastSelectedShape = this.shapes.at(-1);
      }
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
            const offset = 20; // used to avoid shape shifting when resizing over another shape
            this.shapes.at(-1).circleRadius = this.isDrawingNewShape
              ? this.copy(Xmax - Xmin) + offset
              : distanceToPointer + offset;
            break;

          case this.activeShape === "rect":
            const minRectSize = 20;
            this.shapes.at(-1).rectWidth =
              this.copy(this.currentPointer.end.x - this.shapes.at(-1).x) > 0
                ? this.copy(this.currentPointer.end.x - this.shapes.at(-1).x)
                : minRectSize;
            this.shapes.at(-1).rectHeight =
              this.copy(this.currentPointer.end.y - this.shapes.at(-1).y) > 0
                ? this.copy(this.currentPointer.end.y - this.shapes.at(-1).y)
                : minRectSize;

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
      let id = `${this.activeShape}_${Math.random() * 10000}_${Date.now()}`;

      switch (true) {
        case this.activeShape === "arrow":
          this.shapes.push({
            id,
            x: this.pointerPosition.x,
            y: this.pointerPosition.y,
            endX: this.pointerPosition.x,
            endY: this.pointerPosition.y,
            type: this.activeShape,
            color: this.copy(this.selectedColor),
            strokeWidth: this.copy(Math.abs(this.strokeSize)),
            isDash: this.copy(this.isDash),
          });
          this.lastSelectedShape = this.shapes.at(-1);
          break;

        case this.activeShape === "circle":
          this.shapes.push({
            alpha: this.options.circle.filled ? this.colorTransparency : "",
            id,
            color: this.copy(this.selectedColor),
            isFilled: this.copy(this.options.circle.filled),
            circleRadius: this.copy(this.options.circle.radius),
            circleStrokeWidth: this.copy(this.options.circle.strokeWidth),
            type: this.activeShape,
            x: this.pointerPosition.x,
            y: this.pointerPosition.y,
            strokeWidth: this.copy(Math.abs(this.strokeSize)),
            isDash: this.copy(this.isDash),
          });
          this.lastSelectedShape = this.shapes.at(-1);
          break;

        case this.activeShape === "rect":
          this.shapes.push({
            alpha: this.options.rect.filled ? this.colorTransparency : "",
            id,
            color: this.copy(this.selectedColor),
            isFilled: this.copy(this.options.rect.filled),
            rectStrokeWidth: this.copy(this.options.rect.strokeWidth),
            rectHeight: this.copy(this.options.rect.height),
            rectWidth: this.copy(this.options.rect.width),
            type: this.activeShape,
            x: this.pointerPosition.x,
            y: this.pointerPosition.y,
            strokeWidth: this.copy(Math.abs(this.strokeSize)),
            isDash: this.copy(this.isDash),
          });
          this.lastSelectedShape = this.shapes.at(-1);
          break;

        default:
          break;
      }

      if (this.pointerDownId !== -1 || !this.isDrawing) {
        clearInterval(this.pointerDownId);
        this.pointerDownId = -1;
      }

      if (this.pointerDownId === -1 && this.isDrawing) {
        this.pointerDownId = setInterval(this.drawUp, 1);
        return;
      }
    },
    move(shape) {
      if (!shape || !shape.id) {
        return;
      }
      this.lastSelectedShape = shape;
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
          const selectedText = Array.from(
            document.getElementsByTagName("text")
          ).find((textElement) => textElement.id === shape.id);
          if (!selectedText) {
            return;
          }
          const { x, y, width, height } = selectedText.getBBox();
          if(shape.textAlign === "start") {
            shape.x = this.copy(this.pointerPosition.x - width / 2);
          }
          if(shape.textAlign === "middle") {
            shape.x = this.copy(this.pointerPosition.x);
          }
          if(shape.textAlign === "end") {
            shape.x = this.copy(this.pointerPosition.x + width / 2);
          }
          if(shape.lines > 1) {
            shape.y = this.copy(this.pointerPosition.y - height / 3);
          } else {
            shape.y = this.copy(this.pointerPosition.y + shape.fontSize / 2);
          }
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

      if (this.pointerDownId === -1 && shapeId) {
        this.move(shape);
      }
    },
    print() {
      const wrapper = this.$refs.drawSvgContainer;
      this.$emit("print", wrapper);
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
    setFillOfSelectedRect() {
      if (!this.lastSelectedShape || !this.lastSelectedShape.id.includes("rect")) {
        return;
      }
      this.lastSelectedShape.isFilled = !this.lastSelectedShape.isFilled;
    },
    setFillOfSelectedCircle() {
      if (!this.lastSelectedShape || !this.lastSelectedShape.id.includes("circle")) {
        return;
      }
      this.lastSelectedShape.isFilled = !this.lastSelectedShape.isFilled;
    },
    setColorOfSelectedShape() {
      if (!this.lastSelectedShape) {
        return;
      }

      this.lastSelectedShape.color = this.copy(this.selectedColor);

      if (["arrow", "text"].includes(this.lastSelectedShape.id)) {
        return;
      }

      this.lastSelectedShape.alpha = this.copy(this.colorTransparency);
    },
    setSelectedShapeToDash() {
      if (!this.lastSelectedShape || this.lastSelectedShape.type === "text") {
        return;
      }
      this.lastSelectedShape.isDash = this.copy(this.isDash);
    },
    setTransparencyOfSelectedShape() {
      if (
        !this.lastSelectedShape ||
        ["arrow", "text"].includes(this.lastSelectedShape.id)
      ) {
        return;
      }
      this.lastSelectedShape.alpha = this.copy(this.colorTransparency);
    },
    setStrokeWidthOfSelectedShape() {
      if (
        !this.lastSelectedShape ||
        !["arrow", "circle", "rect"].includes(this.lastSelectedShape.type)
      ) {
        return;
      }
      this.lastSelectedShape.strokeWidth = this.copy(Math.abs(this.strokeSize));
    },
    setCurrentStyleOfSelectedText() {
      if (!this.lastSelectedShape || this.lastSelectedShape.type !== "text") {
        return;
      }
      this.lastSelectedShape.isBold = this.copy(this.isBold);
      this.lastSelectedShape.isItalic = this.copy(this.isItalic);
      this.lastSelectedShape.isUnderline = this.copy(this.isUnderline);
      this.lastSelectedShape.fontSize = this.copy(this.textFont);
    },
    setPointer(e) {
      const mainSvg = this.$refs.mainSvg;
      const rect = mainSvg.getBoundingClientRect();
      this.pointerPosition.x = ((e.clientX - rect.left) / rect.width) * this.svgWidth;
      this.pointerPosition.y = ((e.clientY - rect.top) / rect.height) * this.svgHeight;
    },
    setShapeTo(shape) {
      this.showCaret = false;
      this.deleteEmptyTextElement();
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
    toggleSummary() {
      this.isSummaryOpen = !this.isSummaryOpen;
      if (!this.isSummaryOpen) {
        this.isMoveMode = false;
        this.isResizeMode = false;
        this.isTextMode = false;
        this.isWriting = false;
        this.activeShape = undefined;
        this.showCaret = false;
        this.isDeleteMode = false;
        this.isWriting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hide-shape {
  display: none;
}
button.button-tool {
  height: 28px;
  width: 28px;
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
summary {
  user-select: none;
  cursor: pointer;
}
</style>
