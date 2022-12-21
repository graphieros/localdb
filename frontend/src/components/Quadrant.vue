<template>
  <!-- IMPORTANT: to be responsive, this component must be placed in a parent with a width:100% prop-->
  <div ref="quadrantWrapper" style="position: relative">
    <svg
      :height="40"
      width="80"
      viewBox="0 0 100 50"
      class="quadrant__minimap"
      v-if="selectedSide && showMinimap"
    >
      <polygon
        v-for="(side, i) in quadrantLabels"
        :key="`minimap_side_${i}`"
        :points="side.minimapPoints"
        :class="{
          quadrant__minimap__side: true,
          'quadrant__minimap__side--unselected': selectedSide.id !== side.id,
        }"
        @click="selectQuadrantSide(side)"
        :fill="selectedSide.id === side.id ? side.color : 'transparent'"
      ></polygon>
      <line x1="50" x2="50" y1="0" y2="50"></line>
      <line x1="0" x2="100" y1="25" y2="25"></line>
    </svg>
    <!-- CONTROLS -->
    <div v-if="showControls" class="quadrant__controls" data-html2canvas-ignore>
      <details>
        <summary style="text-align: left">
          {{ controlTranslations.summary }}
        </summary>
        <fieldset style="padding: 12px" v-if="controlPermissions.fontSizes">
          <legend>
            {{ controlTranslations.legendFontSizes }}
          </legend>
          <div class="quadrant__controls__item" v-if="controlPermissions.fontPlotLabels">
            <input
              type="range"
              id="rangeFontPlotLabels"
              name="rangeFontPlotLabels"
              v-model="fonts.plotLabels"
              min="3"
              max="28"
            />
            <label for="rangeFontPlotLabels">
              <span>
                {{ controlTranslations.fontPlotLabels }} :
                <b>{{ fonts.plotLabels }}px</b>
              </span>
            </label>
          </div>

          <div class="quadrant__controls__item" v-if="controlPermissions.fontAxisLabels">
            <input
              type="range"
              id="rangeFontAxisLabels"
              name="rangeFontAxisLabels"
              v-model="fonts.axisLabels"
              min="8"
              max="28"
            />
            <label for="rangeFontAxisLabels">
              <span>
                {{ controlTranslations.fontAxisLabels }} :
                <b>{{ fonts.axisLabels }}px</b>
              </span>
            </label>
          </div>

          <div
            class="quadrant__controls__item"
            v-if="controlPermissions.fontQuadrantLabels"
          >
            <input
              type="range"
              id="rangeFontQuadrantLabels"
              name="rangeFontQuadrantLabels"
              v-model="fonts.quadrantLabels"
              min="8"
              max="28"
            />
            <label for="rangeFontQuadrantLabels">
              <span>
                {{ controlTranslations.fontQuadrantLabels }} :
                <b>{{ fonts.quadrantLabels }}px</b>
              </span>
            </label>
          </div>

          <button @click="resetFontSizes">
            {{ controlTranslations.resetButton }}
          </button>
        </fieldset>
        <fieldset style="padding: 12px" v-if="controlPermissions.chartParameters">
          <legend>
            {{ controlTranslations.legendChartParameters }}
          </legend>
          <div class="quadrant__controls__item" v-if="controlPermissions.showBackground">
            <input
              type="checkbox"
              id="checkboxBackground"
              name="checkboxBackground"
              :checked="useBackground"
              v-model="useBackground"
            />
            <label for="checkboxBackground">
              {{ controlTranslations.showBackground }}
            </label>
          </div>

          <div class="quadrant__controls__item" v-if="controlPermissions.showAreas">
            <input
              type="checkbox"
              id="checkboxAreas"
              name="checkboxAreas"
              :checked="displayAreas"
              v-model="displayAreas"
            />
            <label for="checkboxAreas">
              {{ controlTranslations.showAreas }}
            </label>
          </div>

          <div class="quadrant__controls__item" v-if="controlPermissions.showAverages">
            <input
              type="checkbox"
              id="checkboxAverages"
              name="checkboxAverages"
              :checked="displayAverages"
              v-model="displayAverages"
            />
            <label for="checkboxAverages">
              {{ controlTranslations.showAverages }}
            </label>
          </div>

          <div
            class="quadrant__controls__item"
            v-if="controlPermissions.showPlotLabelNames"
          >
            <input
              type="checkbox"
              id="checkboxLabelNames"
              name="checkboxLabelNames"
              :checked="displayNames"
              v-model="displayNames"
            />
            <label for="checkboxLabelNames">
              {{ controlTranslations.showPlotLabelNames }}
            </label>
          </div>

          <div class="quadrant__controls__item" v-if="controlPermissions.height">
            <input
              type="range"
              id="rangeHeight"
              name="rangeHeight"
              v-model="svgHeight"
              min="300"
              max="900"
            />
            <label for="rangeHeight">
              <span>
                {{ controlTranslations.height }} :
                <b>{{ svgHeight }}px</b>
              </span>
            </label>
          </div>

          <div class="quadrant__controls__item" v-if="controlPermissions.width">
            <input
              type="range"
              id="rangeWidth"
              name="rangeWidth"
              v-model="svgWidth"
              min="500"
              max="1500"
            />
            <label for="rangeWidth">
              <span>
                {{ controlTranslations.width }} :
                <b>{{ svgWidth }}px</b>
              </span>
            </label>
          </div>

          <div class="quadrant__controls__item" v-if="controlPermissions.shapeRadius">
            <input
              type="range"
              id="rangeShapeRadius"
              name="rangeShapeRadius"
              v-model="shapeRadius"
              min="2"
              max="24"
            />
            <label for="rangeShapeRadius">
              <span>
                {{ controlTranslations.shapeRadius }} :
                <b>{{ shapeRadius }}px</b>
              </span>
            </label>
          </div>
          <button @click="resetSVG">
            {{ controlTranslations.resetButton }}
          </button>
        </fieldset>
      </details>
    </div>
    <!-- TOOLTIPS -->
    <div
      class="quadrant__tooltip"
      ref="tooltip"
      v-if="showTooltip && isSelected"
      :style="tooltipStyle"
      v-html="tooltipContent"
    ></div>

    <div
      class="quadrant__tooltip-magnify"
      ref="tooltipMagnify"
      v-if="magnifySelected"
      :style="tooltipMagnifyStyle"
      v-html="tooltipContent"
    ></div>

    <svg class="quadrant" :viewBox="viewBox" :style="quadrantStyle">
      <!-- QUADRANT BACKGROUND COLORS -->
      <g v-if="useBackground">
        <polygon
          :points="`${svgWidth - svgWidth * 0.97},${svgHeight - svgHeight * 0.9} ${
            svgWidth / 2
          },${svgHeight - svgHeight * 0.9} ${svgWidth / 2},${svgHeight / 2} ${
            svgWidth - svgWidth * 0.97
          },${svgHeight / 2}`"
          :fill="hexToRgb(labels.TL.color)"
        />
        <polygon
          :points="`${svgWidth / 2},${svgHeight - svgHeight * 0.9} ${
            svgWidth - svgWidth * 0.037
          },${svgHeight - svgHeight * 0.9} ${svgWidth - svgWidth * 0.037},${
            svgHeight / 2
          } ${svgWidth / 2}, ${svgHeight / 2}`"
          :fill="hexToRgb(labels.TR.color)"
        />
        <polygon
          :points="`${svgWidth / 2},${svgHeight / 2} ${svgWidth - svgWidth * 0.037},${
            svgHeight / 2
          } ${svgWidth - svgWidth * 0.037},${svgHeight - svgHeight * 0.08} ${
            svgWidth / 2
          },${svgHeight - svgHeight * 0.08}`"
          :fill="hexToRgb(labels.BR.color)"
        />
        <polygon
          :points="`${svgWidth / 2},${svgHeight / 2} ${svgWidth / 2},${
            svgHeight - svgHeight * 0.08
          } ${svgWidth - svgWidth * 0.97},${svgHeight - svgHeight * 0.08} ${
            svgWidth - svgWidth * 0.97
          },${svgHeight / 2}`"
          :fill="hexToRgb(labels.BL.color)"
        />
      </g>
      <!-- QUADRANT LABELS -->
      <g v-if="!hideLabels" class="quadrant__labels">
        <text
          v-for="(label, i) in quadrantLabels"
          :key="`quadrant_label_${i}`"
          :x="svgWidth - svgWidth * label.xAdjust"
          :y="svgHeight - svgHeight * label.yAdjust"
          :fill="label.color"
          :font-size="fonts.quadrantLabels"
          :font-family="fontFamily"
          :font-weight="900"
          :text-anchor="label.textAnchor"
          @click="selectQuadrantSide(label)"
          :style="
            selectedSide
              ? selectedSide.id === label.id
                ? 'opacity:1'
                : 'opacity:0.2'
              : 'opacity: 1'
          "
          @pointerover="showTooltipMagnify(label.id)"
          @pointerout="
            magnifySelected = false;
            magnifiedSideId = undefined;
          "
        >
          {{ label.name }}
        </text>
      </g>

      <!-- AXIS LINES -->
      <g class="quadrant__axis">
        <line
          :x1="svgWidth / 2"
          :y1="svgHeight - svgHeight * 0.92"
          :x2="svgWidth / 2"
          :y2="svgHeight - svgHeight * 0.08"
        />
        <line
          :x1="svgWidth - svgWidth * 0.97"
          :y1="svgHeight / 2"
          :x2="svgWidth - svgWidth * 0.03"
          :y2="svgHeight / 2"
        />
      </g>

      <!-- GIFT WRAPPED POINTS (draw convex outline of a series using 'Gift wrap' algo) -->
      <g v-for="(category, k) in dataset" :key="`dataset_gift_wrap_${k}`">
        <polygon
          v-if="category.series.length > 2 && displayAreas"
          :fill="category.color"
          :points="giftWrap(category)"
          :style="`z-index:1; ${datasetSelectionStyle({
            type: 'area',
            datasetName: category.name,
          })};`"
        />
      </g>

      <!-- WHITE SHADE ON ZOOMED IN UNFOCUSED AREAS -->
      <g v-if="selectedSide" class="quadrant__shader">
        <polygon
          :points="shaderPoints"
          fill="white"
          style="opacity: 0.8 !important"
        ></polygon>
      </g>

      <!-- AXIS NAMES -->
      <g class="quadrant__axis__names">
        <text
          :x="svgWidth / 2"
          :y="svgHeight - svgHeight * 0.97"
          dominant-baseline="middle"
          text-anchor="middle"
          :font-size="axisNamesFontSize"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          <tspan
            :x="svgWidth / 2"
            :y="
              selectedSide ? svgHeight - svgHeight * 0.97 : svgHeight - svgHeight * 0.99
            "
          >
            {{ yTitle }}
          </tspan>
          <tspan :x="svgWidth / 2" :y="svgHeight - svgHeight * 0.95">
            med: {{ medians.y.toFixed(2) }}
          </tspan>
        </text>
        <text
          :y="svgHeight / 2"
          :x="svgWidth"
          :font-size="axisNamesFontSize"
          dominant-baseline="middle"
          text-anchor="middle"
          :transform="`rotate(90, ${svgWidth}, ${svgHeight / 2})`"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          <tspan
            :x="svgWidth"
            :y="selectedSide ? svgHeight / 2 + svgWidth * 0.01 : svgHeight / 2"
          >
            {{ xTitle }}
          </tspan>
          <tspan :x="svgWidth" :y="svgHeight / 2 + svgWidth * 0.02">
            med: {{ medians.x.toFixed(2) }}
          </tspan>
        </text>
      </g>

      <!-- AXIS ARROWS -->
      <g v-if="displayAxisArrows" class="quadrant__axis__arrows">
        <path
          :d="`M${svgWidth / 2} ${svgHeight - svgHeight * 0.92}, ${svgWidth / 2 - 4} ${
            svgHeight - svgHeight * 0.9
          }, ${svgWidth / 2 + 4} ${svgHeight - svgHeight * 0.9}Z`"
          class="axis-arrow"
        />
        <path
          :d="`M${svgWidth - svgWidth * 0.03} ${svgHeight / 2}, ${
            svgWidth - svgWidth * 0.04
          } ${svgHeight / 2 - 4}, ${svgWidth - svgWidth * 0.04} ${svgHeight / 2 + 4}Z`"
          class="axis-arrow"
        />
      </g>

      <!-- PLOTS -->
      <!-- Plot labels painted first to allow shapes pointerover events -->
      <g
        v-for="(category, k) in dataset"
        :key="`dataset_text_${k}`"
        class="quadrant__dataset__texts"
      >
        <g
          v-for="(item, i) in category.series"
          :key="`plot_text_${i}`"
          class="quadrant__plots__texts"
        >
          <text
            v-if="displayNames"
            :x="calcPlotTextPosition(item, category).x"
            :y="calcPlotTextPosition(item, category).y"
            :font-size="fonts.plotLabels"
            :font-weight="400"
            :font-family="fontFamily"
            :fill="dark ? (isPlotSelected(plot(item)) ? 'white' : 'grey') : 'black'"
            :style="`z-index:0; ${datasetSelectionStyle({
              datasetName: category.name,
            })}; ${sideSelectionStyle(item, category.name)};`"
            text-anchor="middle"
          >
            {{ item.category ? item.category : category.name }}
          </text>
        </g>
      </g>

      <circle
        v-if="isSelected"
        :cx="selectedPlot.x"
        :cy="selectedPlot.y"
        r="20"
        fill="rgba(0,0,0,0.05)"
      ></circle>

      <!-- Plots shapes painted last to allow pointerover events in case of text overlapping -->
      <g
        v-for="(category, k) in dataset"
        :key="`dataset_shape_${k}`"
        class="quadrant__dataset__shapes"
      >
        <g
          v-for="(item, i) in category.series"
          :key="`plot_shape_${i}`"
          class="quadrant__plots__shapes"
          @click="selectDatapoint(item)"
        >
          <circle
            v-if="!category.shape || category.shape === 'circle'"
            :cx="plot(item).x"
            :cy="plot(item).y"
            :r="getRadius(category, plot(item))"
            :fill="category.color"
            stroke="white"
            :stroke-width="getShapeStrokeWidth(item)"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, category.name, category.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :class="{ circle: true }"
            :style="`z-index:1; ${datasetSelectionStyle({
              datasetName: category.name,
            })}; ${sideSelectionStyle(item, category.name)};`"
          />
          <polygon
            v-if="category.shape === 'triangle'"
            :points="createPolygon(plot(item), getRadius(category, plot(item)), 3, 2.6)"
            :fill="category.color"
            stroke="white"
            :stroke-width="getShapeStrokeWidth(item)"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, category.name, category.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :class="{ triangle: true }"
            :style="`z-index:1; ${datasetSelectionStyle({
              datasetName: category.name,
            })}; ${sideSelectionStyle(item, category.name)};`"
          />
          <polygon
            v-if="category.shape === 'square'"
            :points="createPolygon(plot(item), getRadius(category, plot(item)), 4, 2.35)"
            :class="{ square: true }"
            :fill="category.color"
            stroke="white"
            :stroke-width="getShapeStrokeWidth(item)"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, category.name, category.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :style="`z-index:1;  ${datasetSelectionStyle({
              datasetName: category.name,
            })}; ${sideSelectionStyle(item, category.name)};`"
          />
          <polygon
            v-if="category.shape === 'pentagon'"
            :points="createPolygon(plot(item), getRadius(category, plot(item)), 5, 60)"
            :class="{ pentagon: true }"
            :fill="category.color"
            stroke="white"
            :stroke-width="getShapeStrokeWidth(item)"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, category.name, category.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :style="`z-index:1; ${datasetSelectionStyle({
              datasetName: category.name,
            })}; ${sideSelectionStyle(item, category.name)};`"
          />
          <polygon
            v-if="category.shape === 'hexagon'"
            :points="createPolygon(plot(item), getRadius(category, plot(item)), 6)"
            :fill="category.color"
            stroke="white"
            :stroke-width="getShapeStrokeWidth(item)"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, category.name, category.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :class="{ hexagon: true }"
            :style="`z-index:1; ${datasetSelectionStyle({
              datasetName: category.name,
            })}; ${sideSelectionStyle(item, category.name)}; fill-rule: nonzero`"
          />
          <polygon
            v-if="category.shape === 'star'"
            :points="createStar(plot(item), getRadius(category, plot(item)))"
            :fill="category.color"
            stroke="white"
            :stroke-width="getShapeStrokeWidth(item)"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, category.name, category.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :class="{ star: true }"
            :style="`z-index:1; ${datasetSelectionStyle({
              datasetName: category.name,
            })}; ${sideSelectionStyle(item, category.name)}; fill-rule: nonzero`"
          />
          <!-- PINNED ITEM LOCATION RADAR -->
          <circle
            v-if="isPinned(item)"
            :cx="plot(item).x"
            :cy="plot(item).y"
            stroke="white"
            class="pinned-outline"
          />
          <circle
            v-if="isPinned(item)"
            :cx="plot(item).x"
            :cy="plot(item).y"
            :stroke="category.color"
            class="pinned"
          />
        </g>
      </g>
      <!-- Averages -->
      <template v-if="displayAverages">
        <g v-for="(category, i) in dataset" :key="`dataset_cluster_${i}`">
          <circle
            v-if="category.series.length > minToShowAverage"
            :cx="averages[i].x"
            :cy="averages[i].y"
            :r="category.radius ? category.radius * 15 : shapeRadius * 15"
            :stroke="category.color"
            fill="none"
            stroke-dasharray="4 2"
            class="circle"
            :style="`opacity: ${isSelected ? '0.05' : '1'}; ${datasetSelectionStyle({
              datasetName: category.name,
            })}`"
          />
        </g>
      </template>
      <!-- TOOLTIP FOCUS ON POINT FROM PARENT EVENT -->
      <foreignObject
        style="overflow: visible"
        v-if="currentPinnedPlot"
        :x="calcPinnedTooltipPosition().x"
        :y="calcPinnedTooltipPosition().y"
        :width="svgWidth / 6"
        :height="svgHeight / 6"
      >
        <div
          :class="{
            quadrant__tooltip: true,
            'quadrant__tooltip--pin': true,
            'quadrant__tooltip--zoom': !!selectedSide,
            'quadrant__tooltip--top':
              ['BL', 'BR'].includes(currentPinnedPlot.quadrantSide) && !selectedSide,
            'quadrant__tooltip--zoom__top':
              !!selectedSide &&
              (selectedSide.id === this.sides.TL || selectedSide.id === this.sides.TR),
            'quadrant__tooltip--zoom__bottom':
              !!selectedSide &&
              (selectedSide.id === this.sides.BL || selectedSide.id === this.sides.BR),
          }"
          ref="tooltip"
          :style="`font-size:${maxFontSize}px !important;`"
        >
          <div v-html="getPinnedPointContent()"></div>
          <span
            @click="closePin"
            :style="`position: absolute; top: 4px; right: ${
              selectedSide ? 4 : 6
            }px; cursor: pointer;`"
            class="close-pin"
          >
            <svg
              :style="`width: ${selectedSide ? 10 : 24}px;height:${
                selectedSide ? 10 : 24
              }px;border:${
                selectedSide ? 0.5 : 1
              }px solid #ccc; border-radius:50%; padding:1px`"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </span>
        </div>
      </foreignObject>

      <g v-if="noData">
        <rect
          :x="0"
          :y="0"
          :height="svgHeight"
          :width="svgWidth"
          fill="rgba(255,255,255,0.9)"
        />
        <foreignObject :x="0" :y="0" :height="svgHeight" :width="svgWidth">
          <div class="quadrant__no-data">
            <svg style="width: 18px; height: 18px" viewBox="0 0 24 24">
              <path
                fill="orange"
                d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
              />
            </svg>
            <span>
              {{ warningNoData }}
            </span>
          </div>
        </foreignObject>
      </g>
    </svg>
    <!-- LEGEND -->
    <div
      class="quadrant__legend"
      v-if="showLegend"
      :style="`background:${dark ? 'transparent' : 'white'}`"
    >
      <div
        class="quadrant__legend__item"
        v-for="(category, i) in dataset"
        :key="`dataset_legend_${i}`"
        @click="showDataset(category.name)"
        :style="`${datasetSelectionStyle({
          datasetName: category.name,
          isLegend: true,
        })}`"
      >
        <svg
          :style="`width:20px; height:20px`"
          :viewBox="`0 0 ${category.radius ? category.radius * 4 : radius * 4} ${
            category.radius ? category.radius * 4 : radius * 4
          }`"
        >
          <g>
            <circle
              v-if="!category.shape || category.shape === 'circle'"
              :cx="category.radius ? category.radius * 2 : radius * 2"
              :cy="category.radius ? category.radius * 2 : radius * 2"
              :r="category.radius ? category.radius : radius"
              :fill="category.color"
              pointer-events="visiblePainted"
              class="circle"
            />
            <polygon
              v-if="category.shape === 'triangle'"
              :points="
                createPolygon(
                  {
                    x: category.radius ? category.radius * 2 : radius * 2,
                    y: category.radius ? category.radius * 2 : radius * 2,
                  },
                  category.radius ? category.radius : radius,
                  3,
                  2.6
                )
              "
              :fill="category.color"
              pointer-events="visiblePainted"
            />
            <polygon
              v-if="category.shape === 'square'"
              :points="
                createPolygon(
                  {
                    x: category.radius ? category.radius * 2 : radius * 2,
                    y: category.radius ? category.radius * 2 : radius * 2,
                  },
                  category.radius ? category.radius : radius,
                  4,
                  2.35
                )
              "
              class="square"
              :fill="category.color"
              pointer-events="visiblePainted"
            />
            <polygon
              v-if="category.shape === 'pentagon'"
              :points="
                createPolygon(
                  {
                    x: category.radius ? category.radius * 2 : radius * 2,
                    y: category.radius ? category.radius * 2 : radius * 2,
                  },
                  category.radius ? category.radius : radius,
                  5,
                  60
                )
              "
              class="pentagon"
              :fill="category.color"
              pointer-events="visiblePainted"
            />
            <polygon
              v-if="category.shape === 'hexagon'"
              :points="
                createPolygon(
                  {
                    x: category.radius ? category.radius * 2 : radius * 2,
                    y: category.radius ? category.radius * 2 : radius * 2,
                  },
                  category.radius ? category.radius : radius,
                  6
                )
              "
              :fill="category.color"
              pointer-events="visiblePainted"
            />
            <polygon
              v-if="category.shape === 'star'"
              :points="
                createStar(
                  {
                    x: category.radius ? category.radius * 2 : radius * 2,
                    y: category.radius ? category.radius * 2 : radius * 2,
                  },
                  category.radius ? category.radius : radius
                )
              "
              :fill="category.color"
              pointer-events="visiblePainted"
            />
          </g>
        </svg>
        <div :style="`color:${dark ? 'white' : '#2D353C'}`">
          {{ category.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Quadrant",
  props: {
    axisArrows: {
      type: Boolean,
      default: true,
    },
    currentPinnedDatapoint: {
      type: Object,
      default() {
        return {};
      },
    },
    // Dark mode support
    dark: {
      type: Boolean,
      default: false,
    },
    // This example datasets shows all available shape options
    dataset: {
      type: Array,
      default() {
        return [
          {
            name: "Series 1",
            series: [
              {
                x: 1,
                y: 2,
                category: "category 1",
                displayX: 1,
                displayY: 2,
                family: "Series 1",
                id: "cat_1",
              },
            ],
            color: "blue",
            radius: 4,
            shape: "circle",
          },
          {
            name: "Series 2",
            series: [
              {
                x: -5,
                y: 7,
                category: "category 2",
                displayX: -5,
                displayY: 7,
                family: "Series 2",
                id: "cat_2",
              },
            ],
            color: "red",
            radius: 4,
            shape: "triangle",
          },
          {
            name: "Series 3",
            series: [
              {
                x: -10,
                y: -5,
                category: "category 3",
                displayX: -10,
                displayY: -5,
                family: "Series 3",
                id: "cat_3",
              },
            ],
            color: "green",
            radius: 4,
            shape: "square",
          },
          {
            name: "Series 4",
            series: [
              {
                x: 5,
                y: 2,
                category: "category 4",
                displayX: -5,
                displayY: 7,
                family: "Series 4",
                id: "cat_4",
              },
            ],
            color: "purple",
            radius: 4,
            shape: "pentagon",
          },
          {
            name: "Series 5",
            series: [
              {
                x: 10,
                y: -10,
                category: "category 5",
                displayX: 10,
                displayY: -10,
                family: "Series 5",
                id: "cat_5",
              },
            ],
            color: "turquoise",
            radius: 4,
            shape: "hexagon",
          },
          {
            name: "Series 6",
            series: [
              {
                x: 11,
                y: 5,
                category: "category 6",
                displayX: 11,
                displayY: 5,
                family: "Series 6",
                id: "cat_6",
              },
            ],
            color: "orange",
            radius: 4,
            shape: "star",
          },
        ];
      },
    },
    fontColor: {
      type: String,
      default: "#000000",
    },
    fontFamily: {
      type: String,
      default: "Product Sans",
    },
    fontSizes: {
      type: Object,
      default() {
        return {
          axisLabels: 12,
          plotLabels: 6,
          quadrantLabels: 12,
          plotCoordinates: 12,
        };
      },
    },
    height: {
      type: Number,
      default: 300,
    },
    hideLabels: {
      type: Boolean,
      default: false,
    },
    // Labels for all 4 quadrant sides
    // Important: use HEX colors
    // Important: keep same ids
    // Important: keep same order !
    labels: {
      type: Object,
      default() {
        return {
          TL: {
            id: "TL",
            name: "Top left",
            color: "#F17171",
          },
          TR: {
            id: "TR",
            name: "Top right",
            color: "#15B300",
          },
          BR: {
            id: "BR",
            name: "Bottom right",
            color: "#6376DD",
          },
          BL: {
            id: "BL",
            name: "Bottom left",
            color: "#616772",
          },
        };
      },
    },
    medians: {
      type: Object,
      default() {
        return {
          x: 1,
          y: 1,
        };
      },
    },
    // Dataset length threshold to display average circles. Needs the prop showAverages to be set to true
    minToShowAverage: {
      type: Number,
      default: 5,
    },
    radius: {
      type: Number,
      default: 3,
    },
    // Display a dotted circle which coordinates are the mean of each dataset
    showAverages: {
      type: Boolean,
      default: false,
    },
    showAreas: {
      type: Boolean,
      default: false,
    },
    showControls: {
      type: Boolean,
      default: true,
    },
    controlPermissions: {
      type: Object,
      default() {
        return {
          chartParameters: true,
          fontAxisLabels: true,
          fontPlotLabels: true,
          fontQuadrantLabels: true,
          fontSizes: true,
          height: true,
          shapeRadius: true,
          showAreas: true,
          showAverages: true,
          showBackground: true,
          showPlotLabelNames: true,
          width: true,
        };
      },
    },
    controlTranslations: {
      type: Object,
      default() {
        return {
          fontAxisLabels: "Axis labels",
          showBackground: "Quadrant background",
          showAreas: "Surfaces",
          showAverages: "Averages",
          showPlotLabelNames: "Show plot labels",
          height: "Height",
          fontPlotLabels: "Plot labels",
          fontQuadrantLabels: "Quadrand labels",
          shapeRadius: "Shapes radius",
          width: "Width",
          legendChartParameters: "Chart parameters",
          legendFontSizes: "Font sizes",
          resetButton: "RESET",
          summary: "Controls",
        };
      },
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
    showMinimap: {
      type: Boolean,
      default: true,
    },
    // Show text next to plots
    showNames: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
    useQuadrantBackground: {
      type: Boolean,
      default: false,
    },
    warningNoData: {
      type: String,
      default: "no data to display",
    },
    width: {
      type: Number,
      default: 500,
    },
    xTitle: {
      type: String,
      default: "X axis",
    },
    yTitle: {
      type: String,
      default: "Y axis",
    },
  },
  data() {
    let SVG_HEIGHT = this.height;
    let SVG_WIDTH = this.width;
    return {
      mousePosition: {
        clientX: 0,
        clientY: 0,
      },
      displayAreas: this.showAreas,
      displayAverages: this.showAverages,
      displayAxisArrows: this.axisArrows,
      displayNames: this.showNames,
      fonts: this.fontSizes,
      isSelected: false,
      magnifiedSideId: undefined,
      magnifySelected: false,
      pinnedPointContent: "",
      quadrantWrapperHeight: 0,
      quadrantWrapperWidth: 0,
      selectedDatasets: this.dataset.map((item) => item.name),
      selectedPlot: [0, 0],
      selectedSide: undefined,
      shaderPoints: "",
      shapeRadius: this.radius,
      sides: {
        TL: "TL",
        TR: "TR",
        BR: "BR",
        BL: "BL",
      },
      svgHeight: this.height,
      svgWidth: this.width,
      tooltipContent: "",
      useBackground: this.useQuadrantBackground,
      viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    };
  },
  computed: {
    averages() {
      return this.dataset.map((category) => {
        const meanX = [];
        const meanY = [];
        category.series.forEach((serie) => {
          meanX.push(serie.x);
          meanY.push(serie.y);
        });
        const x = meanX.reduce((a, b) => a + b, 0) / meanX.length;
        const y = meanY.reduce((a, b) => a + b, 0) / meanY.length;

        return this.plot({ x, y });
      });
    },
    axisNamesFontSize() {
      if (this.selectedSide) {
        return this.fonts.axisLabels / 1.4 > 24
          ? 24
          : Math.round(this.fonts.axisLabels / 1.4);
      }
      return this.fonts.axisLabels > 24 ? 24 : this.fonts.axisLabels;
    },
    currentPinnedPlot() {
      if (!this.currentPinnedDatapoint.hasOwnProperty("id")) {
        return null;
      }
      const flatSeries = this.dataset.flatMap((ds) => ds.series);
      const pinnedPlot = flatSeries.find((el) => {
        return el.id === this.currentPinnedDatapoint.id;
      });
      return this.plot({ x: pinnedPlot.x, y: pinnedPlot.y });
    },
    extremes() {
      // Retrieve max value on which will be based all plots x and y relative coordinates
      const allX = [];
      const allY = [];
      this.dataset.forEach((category) => {
        category.series.forEach((item) => {
          allX.push(Math.abs(item.x));
          allY.push(Math.abs(item.y));
        });
      });
      const x = Math.max(...allX);
      const y = Math.max(...allY);
      return { x, y };
    },
    quadrantLabels() {
      const keys = Object.keys(this.labels);
      const adjustments = [
        { x: 0.97, y: 0.94 },
        { x: 0.037, y: 0.94 },
        { x: 0.037, y: 0.02 },
        { x: 0.97, y: 0.02 },
      ];
      const minimapCoordinates = [
        "0,0 50,0 50,25 0,25",
        "50,0 100,0 100,25 50,25",
        "50,25 100,25, 100,50 50,50",
        "0,25 50,25 50,50 0,50",
      ];
      const textAnchors = ["", "end", "end", ""];
      const arr = [];
      keys.forEach((key, i) => {
        arr.push({
          id: this.labels[key].id,
          xAdjust: adjustments[i].x,
          yAdjust: adjustments[i].y,
          color: this.labels[key].color,
          textAnchor: textAnchors[i],
          name: this.labels[key].name,
          minimapPoints: minimapCoordinates[i],
        });
      });
      return arr;
    },
    quadrantStyle() {
      return `
              background: "transparent";
              overflow: ${this.selectedSide ? "hidden" : "visible"};
          `;
    },
    maxFontSize() {
      switch (true) {
        case this.quadrantWrapperWidth > 800:
          return this.selectedSide ? 5 : 10;

        case this.quadrantWrapperWidth > 600 && this.quadrantWrapperWidth < 800:
          return this.selectedSide ? 6 : 12;

        default:
          return this.selectedSide ? 7 : 14;
      }
    },
    minimapSelectedSide() {
      switch (true) {
        case this.selectedSide.id === this.sides.TL:
          return "0,0 50,0 50,25 0,25";

        case this.selectedSide.id === this.sides.TR:
          return "50,0 100,0 100,25 50,25";

        case this.selectedSide.id === this.sides.BR:
          return "50,25 100,25, 100,50 50,50";

        case this.selectedSide.id === this.sides.BL:
          return "0,25 50,25 50,50 0,50";

        default:
          return "";
      }
    },
    noData() {
      return this.dataset.length === 0;
    },
    tooltipStyle() {
      return `
              font-family: ${this.fontFamily};
              top: ${this.mousePosition.clientY + 24}px;
              left: ${this.mousePosition.clientX - 124}px;
          `;
    },
    tooltipMagnifyStyle() {
      let top = 0;
      switch (true) {
        case this.magnifiedSideId === this.sides.TL ||
          this.magnifiedSideId === this.sides.TR:
          top = 24;
          break;

        case this.magnifiedSideId === this.sides.BL ||
          this.magnifiedSideId === this.sides.BR:
          top = -38;
          break;

        default:
          top = 24;
          break;
      }

      return `
              width: 200px;
              font-family: ${this.fontFamily};
              top: ${this.mousePosition.clientY + top}px;
              left: ${this.mousePosition.clientX - 12}px;
          `;
    },
  },
  methods: {
    calcStarPoints(centerX, centerY, innerCirclePoints, innerRadius, outerRadius) {
      const angle = Math.PI / innerCirclePoints;
      const angleOffsetToCenterStar = 60;
      const totalPoints = innerCirclePoints * 2;
      let points = "";
      for (let i = 0; i < totalPoints; i += 1) {
        let isEvenIndex = i % 2 == 0;
        let r = isEvenIndex ? outerRadius : innerRadius;
        let currX = centerX + Math.cos(i * angle + angleOffsetToCenterStar) * r;
        let currY = centerY + Math.sin(i * angle + angleOffsetToCenterStar) * r;
        points += `${currX},${currY} `;
      }
      return points;
    },
    closePin() {
      this.$emit("pinDatapoint", {});
    },
    createPolygon(plot, radius, sides, rotation = 0) {
      const centerX = plot.x;
      const centerY = plot.y;
      const outerPoints = sides / 2;
      return this.calcPolygonPoints(centerX, centerY, outerPoints, radius + 1, rotation);
    },
    calcPolygonPoints(centerX, centerY, outerPoints, radius, rotation) {
      const angle = Math.PI / outerPoints;
      const angleOffsetToCenter = rotation;
      let points = "";
      for (let i = 0; i < outerPoints * 2; i += 1) {
        let currX = centerX + Math.cos(i * angle + angleOffsetToCenter) * radius;
        let currY = centerY + Math.sin(i * angle + angleOffsetToCenter) * radius;
        points += `${currX},${currY} `;
      }
      return points;
    },
    createStar(plot, radius) {
      const centerX = plot.x;
      const centerY = plot.y;
      const innerCirclePoints = 5;
      const innerRadius = (radius * 3.5) / innerCirclePoints;
      const innerOuterRadiusRatio = 2;
      const outerRadius = innerRadius * innerOuterRadiusRatio;
      return this.calcStarPoints(
        centerX,
        centerY,
        innerCirclePoints,
        innerRadius,
        outerRadius
      );
    },
    datasetSelectionStyle({ type = "default", datasetName, isLegend = false }) {
      if (this.selectedDatasets.length === 0) {
        return "";
      }
      if (this.selectedDatasets.includes(datasetName)) {
        return type === "default" ? "opacity: 1" : "opacity:0.5";
      } else {
        if (isLegend && type === "default") {
          return "opacity: 0.3";
        }
        return type === "default" ? "display:none;" : "opacity:0.01";
      }
    },
    sideSelectionStyle(item, datasetName) {
      if (!this.selectedSide) {
        return "";
      }
      if (this.selectedSide.id === this.plot(item).quadrantSide) {
        if (this.selectedDatasets.includes(datasetName)) {
          return "opacity: 1";
        } else {
          return "display:none;";
        }
      } else {
        return "display:none;";
      }
    },
    getPlotSide(plot) {
      if (!plot) {
        return "";
      }
      const { x, y } = plot;
      switch (true) {
        case x >= 0 && y >= 0:
          return this.sides.TR;

        case x < 0 && y >= 0:
          return this.sides.TL;

        case x < 0 && y < 0:
          return this.sides.BL;

        case x >= 0 && y < 0:
          return this.sides.BR;

        default:
          return "";
      }
    },
    calcPlotTextPosition(plot, category) {
      const { x, y } = this.plot(plot);
      const radius = this.getRadius(category, this.plot(plot)) * 2;
      let posX = x;
      let posY = y - radius;
      return { x: posX, y: posY };
    },
    calcPinnedTooltipPosition() {
      const { x, y, quadrantSide } = this.currentPinnedPlot;

      if (this.selectedSide) {
        switch (true) {
          case quadrantSide === this.sides.TL || quadrantSide === this.sides.TR:
            return { x: x - 62, y: y - 48 };

          case quadrantSide === this.sides.BR || quadrantSide === this.sides.BL:
            return { x: x - 62, y: y + 12 };

          default:
            return { x, y };
        }
      } else {
        switch (true) {
          case quadrantSide === this.sides.TL || quadrantSide === this.sides.TR:
            return { x: x - 124, y: y + 12 };

          case quadrantSide === this.sides.BR || quadrantSide === this.sides.BL:
            return { x: x - 124, y: y - 72 };

          default:
            return { x, y };
        }
      }
    },
    getPinnedPointContent() {
      // TODO: final content TBD; adjust x & y tooltip positions accordingly
      const { question, average, correlation, family } = this.currentPinnedDatapoint;
      const maxChar = 45;
      const labelX = `${
        this.xTitle.length > maxChar ? `${this.xTitle.slice(0, maxChar)}...` : this.xTitle
      } : <strong>${average.toFixed(1)}</strong>`;
      const labelY = `${
        this.yTitle.length > maxChar ? `${this.yTitle.slice(0, maxChar)}...` : this.yTitle
      } : <strong>${correlation.toFixed(2)}</strong>`;
      return `
              <div style="align-items:center; justify-content:center">
                  <div style="display: flex; flex-direction: column; align-items:start;text-align:left; width:100%; padding-right: 24px;">
                      <span style="text-align:left;">${labelX}</span>
                      <span>${labelY}</span>
                  </div>
              </div>
          `;
    },
    getRadius(category, plot) {
      let increase = 1;
      if (this.isPlotSelected(plot)) {
        increase *= 1.8;
      }
      if (category.radius) {
        return category.radius * increase;
      }
      return this.shapeRadius * increase;
    },
    getShapeStrokeWidth(shape) {
      if (
        this.isSelected &&
        this.selectedPlot.x === this.plot(shape).x &&
        this.selectedPlot.y === this.plot(shape).y
      ) {
        return 1;
      }
      return 0.5;
    },
    giftWrap({ series }) {
      // https://en.wikipedia.org/wiki/Gift_wrapping_algorithm
      series = series.map((el) => this.plot(el)).sort((a, b) => a.x - b.x);
      function polarAngle(a, b, c) {
        const x = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);
        const y = (a.x - b.x) * (c.y - b.y) - (c.x - b.x) * (a.y - b.y);
        return Math.atan2(y, x);
      }
      const perimeter = [];
      let currentPoint;
      currentPoint = series[0];
      for (const p of series) {
        if (p.x < currentPoint.x) {
          currentPoint = p;
        }
      }
      perimeter[0] = currentPoint;
      let endpoint, secondlast;
      let minAngle, newEnd;
      endpoint = perimeter[0];
      secondlast = { x: endpoint.x, y: endpoint.y + 1 };
      do {
        minAngle = Math.PI;
        for (const p of series) {
          currentPoint = polarAngle(secondlast, endpoint, p);
          if (currentPoint <= minAngle) {
            newEnd = p;
            minAngle = currentPoint;
          }
        }
        if (newEnd !== perimeter[0]) {
          perimeter.push(newEnd);
          secondlast = endpoint;
          endpoint = newEnd;
        }
      } while (newEnd !== perimeter[0]);
      let result;
      perimeter.forEach((res) => {
        if (res && res.x && res.y) {
          result += `${Math.round(res.x)},${Math.round(res.y)} `;
        }
      });
      result = result.replaceAll("undefined", ""); // clearly a hack
      return result;
    },
    hexToRgb(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
            result[3],
            16
          )},0.1)`
        : hex;
    },
    isPinned(item) {
      return item.id === this.currentPinnedDatapoint.id;
    },
    isPlotSelected(plot) {
      return this.selectedPlot.x === plot.x && this.selectedPlot.y === plot.y;
    },
    plot(tuple) {
      const quadrantSide = this.getPlotSide(tuple);
      const x = ((tuple.x / this.extremes.x) * this.svgWidth) / 2.8 + this.svgWidth / 2;
      const y =
        (-(tuple.y / this.extremes.y) * this.svgHeight) / 2.6 + this.svgHeight / 2;
      return { x, y, quadrantSide };
    },
    resetFontSizes() {
      this.fonts = {
        axisLabels: 12,
        plotLabels: 6,
        quadrantLabels: 12,
        plotCoordinates: 12,
      };
    },
    resetSVG() {
      this.svgHeight = this.height;
      this.svgWidth = this.width;
      this.useBackground = this.useQuadrantBackground;
      this.displayAverages = this.showAverages;
      this.shapeRadius = this.radius;
      this.displayNames = this.showNames;
      this.displayAreas = this.showAreas;
    },
    showAverage(plot) {
      this.selectedPlot = plot;
      this.isSelected = true;
    },
    showDataset(categoryName) {
      if (this.selectedDatasets.includes(categoryName)) {
        this.selectedDatasets = this.selectedDatasets.filter((el) => el !== categoryName);
        if (this.selectedDatasets.length === 0) {
          this.selectedDatasets = this.dataset.map((item) => item.name);
        }
      } else {
        this.selectedDatasets.push(categoryName);
      }
      const plots = this.dataset
        .flatMap((dataset) => {
          return dataset.series
            .filter((datapoint) => {
              if (this.selectedSide) {
                return this.plot(datapoint).quadrantSide === this.selectedSide.id;
              }
              return datapoint;
            })
            .map((datapoint) => {
              const { id, category, displayX, displayY, family } = datapoint;
              return {
                id,
                label: category,
                category: family,
                satisfaction: displayX,
                correlation: displayY,
              };
            });
        })
        .filter((datapoint) => {
          return this.selectedDatasets.includes(datapoint.category);
        });
      this.$emit("selectLegend", plots);
    },
    showPlot(plot, name) {
      if (!this.selectedDatasets.includes(name) && this.selectedDatasets.length) {
        return;
      }
      const { category, displayX, displayY, family } = plot;

      this.selectedPlot = this.plot(plot);
      this.isSelected = true;
      const labelX = `${this.xTitle} : <strong>${displayX.toFixed(1)}</strong>`;
      const labelY = `${this.yTitle} : <strong>${displayY.toFixed(2)}</strong>`;
      this.tooltipContent = `
              <div style="align-items:center; justify-content:center">
                  <b style="color:${this.labels[this.selectedPlot.quadrantSide].color}">${
        this.labels[this.selectedPlot.quadrantSide].name
      }</b>
                  <br>
                  <b>${family} : </b>
                  <b>${category}</b>
                  <hr style="margin:6px 0;">
                  <div style="display: flex; flex-direction: column; align-items:start;text-align:left; width:100%">
                      <span style="text-align:left;">${labelX}</span>
                      <span>${labelY}</span>
                  </div>
              </div>
          `;
    },
    showTooltipMagnify(sideId) {
      this.magnifySelected = true;
      this.magnifiedSideId = sideId;
      if (!this.selectedSide) {
        this.tooltipContent = `
              <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z" />
              </svg>
              `;
      } else {
        this.tooltipContent = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z" />
              </svg>`;
      }
    },
    selectDatapoint({ id }) {
      this.$emit("selectDatapoint", id);
    },
    selectQuadrantSide(side) {
      this.magnifySelected = false;
      if (this.selectedSide && this.selectedSide.id === side.id) {
        this.selectedSide = undefined;
        this.resetFontSizes();
        this.viewBox = `0 0 ${this.svgWidth} ${this.svgHeight}`;
        this.$emit("selectQuadrantSide", {
          name: false,
          id: false,
        });
      } else {
        this.fonts = {
          axisLabels: 8,
          plotLabels: 4,
          quadrantLabels: 8,
          plotCoordinates: 8,
        };
        this.selectedSide = side;
        const margin = this.svgWidth * 0.1;
        const halfHeightPlusMargin =
          this.svgHeight / 2 + margin / (this.svgWidth / this.svgHeight);
        const halfWidthPlusMargin = this.svgWidth / 2 + margin;
        const halfWidthLessMargin = this.svgWidth / 2 - margin;
        const halfHeightLessMargin =
          this.svgHeight / 2 - margin / (this.svgWidth / this.svgHeight);
        switch (true) {
          case side.id === this.sides.TL:
            this.viewBox = `0 0 ${halfWidthPlusMargin} ${halfHeightPlusMargin}`;
            this.shaderPoints = `0,${this.svgHeight / 2} ${this.svgWidth / 2},${
              this.svgHeight / 2
            } ${
              this.svgWidth / 2
            },0 ${halfWidthPlusMargin},0 ${halfWidthPlusMargin},${halfHeightPlusMargin} 0,${halfHeightPlusMargin}`;
            break;

          case side.id === this.sides.TR:
            this.viewBox = `${halfWidthLessMargin} 0 ${halfWidthPlusMargin} ${halfHeightPlusMargin}`;
            this.shaderPoints = `0,0 ${this.svgWidth / 2},0 ${this.svgWidth / 2},${
              this.svgHeight / 2
            } ${this.svgWidth},${this.svgHeight / 2} ${this.svgWidth},${
              this.svgHeight
            } 0,${this.svgHeight}`;
            break;

          case side.id === this.sides.BR:
            this.viewBox = `${halfWidthLessMargin} ${halfHeightLessMargin} ${halfWidthPlusMargin} ${halfHeightPlusMargin}`;
            this.shaderPoints = `0,0 ${this.svgWidth},0 ${this.svgWidth},${
              this.svgHeight / 2
            } ${this.svgWidth / 2},${this.svgHeight / 2}, ${this.svgWidth / 2},${
              this.svgHeight
            } 0,${this.svgHeight}`;
            break;

          case side.id === this.sides.BL:
            this.viewBox = `0 ${halfHeightLessMargin} ${halfWidthPlusMargin} ${halfHeightPlusMargin}`;
            this.shaderPoints = `0,0 ${this.svgWidth},0 ${this.svgWidth},${
              this.svgHeight
            } ${this.svgWidth / 2},${this.svgHeight} ${this.svgWidth / 2},${
              this.svgHeight / 2
            } 0,${this.svgHeight / 2}`;
            break;

          default:
            this.viewBox = `0 0 ${this.svgWidth} ${this.svgHeight}`;
            this.shaderPoints = "";
            break;
        }
        const plots = this.dataset.flatMap((dataset) => {
          return dataset.series
            .filter((el) => {
              return this.plot(el).quadrantSide === side.id;
            })
            .map((el) => {
              const { code, id, category, displayX, displayY, family } = el;
              return {
                code,
                id,
                label: category,
                category: family,
                satisfaction: displayX,
                correlation: displayY,
              };
            });
        });

        this.$emit("selectQuadrantSide", {
          name: side.name,
          id: side.id,
          datapoints: plots,
        });
      }
    },
  },
  mounted() {
    // Throw exceptions in case of bad dataset format
    if (this.dataset.length === 1 && this.dataset[0].series.length === 1) {
      throw `Quadrant dataset requires at least 2 items. You only provided 1 item: '${this.dataset[0].series[0].category}' with the id '${this.dataset[0].series[0].id}'`;
    }

    const quadrantWrapper = this.$refs.quadrantWrapper;
    const widthObserver = new ResizeObserver((entries) => {
      this.isNavbarExpanded = app.classList.contains("expand-nav");
      entries.forEach((entry) => {
        this.quadrantWrapperWidth = entry.contentRect.width;
        this.quadrantWrapperHeight = entry.contentRect.height;
      });
    });
    widthObserver.observe(quadrantWrapper);
  },
  created() {
    window.addEventListener("pointermove", (e) => {
      this.mousePosition.clientX = e.clientX;
      this.mousePosition.clientY = e.clientY;
    });
  },
  destroyed() {
    window.removeEventListener("pointermove", (e) => {
      this.mousePosition.clientX = e.clientX;
      this.mousePosition.clientY = e.clientY;
    });
  },
};
</script>

<style lang="scss" scoped>
svg {
  * {
    transition: all 0.2s ease;
  }
}
line,
path {
  stroke-width: 1px;
  stroke: rgba(100, 100, 100, 0.3);
}
fieldset {
  border: 1px solid #e1e5e8;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  transition: top 0.5s ease;
  background: white;
  margin: 12px 0;
  button {
    background-color: white;
    padding: 3px 12px;
    border-radius: 4px;
    border: 1px solid #6376dd;
    color: #6376dd;
    font-family: "Product Sans";
    cursor: pointer;
    align-self: flex-start;
    box-shadow: 0 3px 6px -3px rgba(0, 0, 0, 0.1);
    transition: background-color 0.1s ease-in-out;
    &:hover {
      background-color: #6376dd;
      color: white;
    }
  }
  label {
    color: #2d353c;
  }
  legend {
    color: #4e5d78;
  }
}
input {
  accent-color: #6376dd;
}
summary {
  display: flex;
  align-items: center;
  color: #2d353c;
  cursor: pointer;
  &::marker {
    color: #6376dd;
  }
}
summary::before {
  display: block;
  transition: 0.2s;
  font-size: 2em;
  margin-bottom: 5px;
  margin-right: 6px;
  color: #6376dd;
  content: "\203A";
}
details[open] summary::before {
  transform: rotate(90deg);
}
path.axis-arrow {
  fill: rgb(224, 224, 224);
  stroke-linecap: round;
  stroke-linejoin: round;
}
path.triangle,
path.square {
  stroke: none;
}
.circle,
polygon {
  z-index: 100;
  opacity: 0.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
text {
  cursor: default;
}
.quadrant_wrapper {
  width: 100%;
  position: relative;
}
.quadrant__legend {
  width: 100%;
  max-width: 1000px;
}
.quadrant {
  position: relative;
  user-select: none;
  &__axis {
    line {
      stroke: rgb(182, 182, 182);
      stroke-linecap: round;
    }
    &__names {
      text {
        fill: #2d353c;
      }
    }
  }
  &__border {
    path {
      fill: none;
    }
  }
  &__controls {
    display: flex;
    flex-direction: column;
    user-select: none;
    gap: 12px;
    padding-bottom: 12px;
    fieldset {
      display: flex;
      flex-wrap: wrap;
      user-select: none;
      gap: 12px;
      padding: 12px 0;
    }
    &__item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
  &__legend {
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    column-gap: 12px;
    user-select: none;
    margin-top: -7px;
    padding: 12px 0;
    &__item {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }
  &__labels {
    text {
      cursor: pointer;
    }
  }
  &__minimap {
    border-radius: 2px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    position: absolute;
    right: 0;
    top: 0;
    &__side {
      cursor: pointer;
      &--unselected {
        &:hover {
          fill: rgba(0, 0, 0, 0.06);
        }
      }
    }
  }
  &__no-data {
    width: 100%;
    height: 100%;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
    justify-content: center;
  }
  &__plots {
    &__shapes {
      cursor: pointer;
    }
    &__texts {
      text {
        fill: #2d353c;
      }
    }
  }
  &__tooltip {
    transition: none;
    font-size: 14px;
    position: fixed;
    display: block;
    z-index: 1;
    padding: 12px 24px 18px 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.11);
    width: 248px;
    color: black !important;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      bottom: 98%;
      left: 50%;
      transform: translateX(-50%);
      border: 0.57rem solid transparent;
      border-top: none;
      border-bottom-color: #fff;
      filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
    }
    &--pin {
      background: rgba(255, 255, 255, 0.9);
      padding: 6px 0 6px 12px;
    }
    &--zoom {
      font-size: 7px;
      width: 124px;
      padding: 6px 0 6px 12px;
      border-radius: 6px;
      &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        bottom: 98%;
        left: 50%;
        transform: translateX(-50%);
        border: 0.32rem solid transparent;
        border-top: none;
        border-bottom-color: rgba(255, 255, 255, 0.9);
        filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
      }
      &__top {
        &::before {
          content: "";
          position: absolute;
          top: 98%;
          left: 50%;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 5px 0 5px;
          border-color: white transparent transparent transparent;
          filter: drop-shadow(0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
        }
      }
    }
    &--top {
      &::before {
        content: "";
        position: absolute;
        top: 98%;
        left: 50%;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 10px 0 10px;
        border-color: white transparent transparent transparent;
        filter: drop-shadow(0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
      }
    }
  }
  &__tooltip-magnify {
    position: fixed;
    z-index: 1;
    height: 24px;
    width: 24px;
  }
  &__wrapper {
    width: 200px !important;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.close-pin {
  &:hover {
    svg {
      background: #ddd;
    }
  }
}
.pinned {
  fill: none;
  stroke-width: 2px;
  animation: flash 1s infinite alternate;
}
.pinned-outline {
  fill: none;
  stroke-width: 2px;
  animation: flash-outline 1s infinite alternate;
}
@keyframes flash {
  0% {
    opacity: 0.3;
    r: 3px;
  }
  100% {
    opacity: 1;
    r: 10px;
  }
}
@keyframes flash-outline {
  0% {
    opacity: 0.3;
    r: 3.5px;
  }
  100% {
    opacity: 1;
    r: 10.5px;
  }
}
</style>
