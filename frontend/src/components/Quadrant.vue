<template>
  <!-- IMPORTANT: to be responsive, this component must be placed in a parent with a width:100% prop-->
  <div
    class="quadrant_wrapper"
    @mousemove="getClientPosition($event)"
    @pointerleave="isSelected = false"
  >
    <div v-if="showControls" class="quadrant__controls">
      <details>
        <summary style="text-align:left;">
          {{ controlTranslations.summary }}
        </summary>
          <fieldset style="padding: 12px;">
          <legend>
            {{ controlTranslations.legendChartParameters }}
          </legend>
          <div class="quadrant__controls__item">
            <input type="checkbox" id="checkboxBackground" name="checkboxBackground" :checked="useBackground" v-model="useBackground">
            <label for="checkboxBackground">
              {{ controlTranslations.labelBackground }}
            </label>
          </div>

          <div class="quadrant__controls__item">
            <input type="checkbox" id="checkboxAverages" name="checkboxAverages" :checked="displayAverages" v-model="displayAverages">
            <label for="checkboxAverages">
              {{ controlTranslations.labelDisplayAverages }}
            </label>
          </div>

          <div class="quadrant__controls__item">
            <input type="checkbox" id="checkboxAxisArrows" name="checkboxAxisArrows" :checked="displayAxisArrows" v-model="displayAxisArrows">
            <label for="checkboxAxisArrows">
              {{ controlTranslations.labelDisplayAxisArrows }}
            </label>
          </div>

          <div class="quadrant__controls__item">
            <input type="range" id="rangeHeight" name="rangeHeight" v-model="svgHeight" min="300" max="900">
            <label for="rangeHeight">
              <span>
                {{ controlTranslations.labelHeight }} : <b>{{ svgHeight }}px</b>
              </span>
            </label>
          </div>

          <div class="quadrant__controls__item">
            <input type="range" id="rangeWidth" name="rangeWidth" v-model="svgWidth" min="500" max="1500">
            <label for="rangeWidth">
              <span>
                {{ controlTranslations.labelWidth }} : <b>{{ svgWidth }}px</b>
              </span>
            </label>
          </div>

          <div class="quadrant__controls__item">
            <input type="range" id="rangeShapeRadius" name="rangeShapeRadius" v-model="shapeRadius" min="2" max="24">
            <label for="rangeShapeRadius">
              <span>
                {{ controlTranslations.labelShapeRadius }} : <b>{{ shapeRadius }}px</b>
              </span>
            </label>
          </div>
          <button @click="resetSVG">
            {{ controlTranslations.resetButton }}
          </button>
        </fieldset>
        
        <fieldset style="padding: 12px;">
          <legend>
            {{ controlTranslations.legendFontSizes }}
          </legend>
          <div class="quadrant__controls__item">
            <input type="range" id="rangeFontPlotLabels" name="rangeFontPlotLabels" v-model="fonts.plotLabels" min="8" max="48">
            <label for="rangeFontPlotLabels">
              <span>
               {{ controlTranslations.labelPlotLabels }} : <b>{{ fonts.plotLabels }}px</b>
              </span>
            </label>
          </div>
          <div class="quadrant__controls__item">
            <input type="range" id="rangeFontAxisLabels" name="rangeFontAxisLabels" v-model="fonts.axisLabels" min="8" max="48">
            <label for="rangeFontAxisLabels">
              <span>
                {{ controlTranslations.labelAxisLabels }} : <b>{{ fonts.axisLabels }}px</b>
              </span>
            </label>
          </div>
          <div class="quadrant__controls__item">
            <input type="range" id="rangeFontQuadrantLabels" name="rangeFontQuadrantLabels" v-model="fonts.quadrantLabels" min="8" max="48">
            <label for="rangeFontQuadrantLabels">
              <span>
                {{ controlTranslations.labelQuadrantLabels }} : <b>{{ fonts.quadrantLabels }}px</b>
              </span>
            </label>
          </div>
          <button @click="resetFontSizes">
            {{ controlTranslations.resetButton }}
          </button>
        </fieldset>
      </details>


    </div>
    <!-- TOOLTIP -->
    <transition name="fade">
      <div
        class="quadrant__tooltip"
        ref="tooltip"
        v-if="showTooltip && isSelected"
        :style="tooltipStyle"
        v-html="tooltipContent"
      ></div>
    </transition>

    <svg
      class="quadrant"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      :style="quadrantStyle"
    >
      <!-- QUADRANT BACKGROUND COLORS (inactive if the positive prop is enabled) -->
      <g v-if="useBackground && !isPositive">
        <polygon
          :points="`${svgWidth - svgWidth * 0.97},${svgHeight - svgHeight * 0.90} ${svgWidth / 2},${svgHeight - svgHeight * 0.9} ${svgWidth / 2},${svgHeight / 2} ${svgWidth - svgWidth * 0.97},${
            svgHeight / 2
          }`"
          :fill="hexToRgb(labels.TL.color)"
        />
        <polygon
          :points="`${svgWidth / 2},${svgHeight - svgHeight * 0.90} ${svgWidth - svgWidth * 0.037},${svgHeight - svgHeight * 0.90} ${svgWidth - svgWidth *0.037},${svgHeight / 2} ${
            svgWidth / 2
          }, ${svgHeight / 2}`"
          :fill="hexToRgb(labels.TR.color)"
        />
        <polygon
          :points="`${svgWidth / 2},${svgHeight / 2} ${svgWidth - svgWidth * 0.037},${
            svgHeight / 2
          } ${svgWidth - svgWidth * 0.037},${svgHeight - svgHeight * 0.08} ${svgWidth / 2},${svgHeight - svgHeight * 0.08}`"
          :fill="hexToRgb(labels.BR.color)"
        />
        <polygon
          :points="`${svgWidth / 2},${svgHeight / 2} ${
            svgWidth / 2
          },${svgHeight - svgHeight * 0.08} ${svgWidth - svgWidth * 0.97},${svgHeight - svgHeight * 0.08} ${svgWidth - svgWidth * 0.97},${svgHeight / 2}`"
          :fill="hexToRgb(labels.BL.color)"
        />
      </g>
      <!-- QUADRANT LABELS -->
      <g v-if="!hideLabels && !isPositive" class="quadrant__labels">
        <text v-for="(label, i) in quadrantLabels" :key="`quadrant_label_${i}`"
          :x="svgWidth - svgWidth * label.xAdjust"
          :y="svgHeight - svgHeight * label.yAdjust"
          :fill="label.color"
          :font-size="fonts.quadrantLabels"
          :font-family="fontFamily"
          :font-weight="900"
          :text-anchor="label.textAnchor"
        >
          {{ label.name }}
        </text>
      </g>

      <!-- AXIS NAMES -->
      <g class="quadrant__axis__names" v-if="!isPositive">
        <text
          x="50%"
          :y="svgHeight - svgHeight * 0.95"
          dominant-baseline="middle"
          text-anchor="middle"
          :font-size="fonts.axisLabels > 24 ? 24 : fonts.axisLabels"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          {{ yTitle }}
        </text>
        <text
          :y="svgHeight / 2"
          :x="svgWidth - svgWidth * 0.02"
          :font-size="fonts.axisLabels > 24 ? 24 : fonts.axisLabels"
          dominant-baseline="middle"
          text-anchor="middle"
          :transform="`rotate(90, ${svgWidth - svgWidth * 0.02}, ${svgHeight / 2})`"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          {{ xTitle }}
        </text>
      </g>
      <g class="quadrant__axis__names" v-else>
        <text
          :x="svgWidth * 0.1"
          :y="svgHeight - svgHeight * 0.97"
          dominant-baseline="middle"
          text-anchor="middle"
          :font-size="fonts.axisLabels > 24 ? 24 : fonts.axisLabels"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          {{ yTitle }}
        </text>
        <text
          :y="svgHeight - svgHeight * 0.06"
          :x="svgWidth - svgWidth * 0.05"
          :font-size="fonts.axisLabels > 24 ? 24 : fonts.axisLabels"
          dominant-baseline="middle"
          text-anchor="end"
          :font-family="fontFamily"
          :fill="dark ? 'grey' : fontColor"
        >
          {{ xTitle }}
        </text>
      </g>

      <!-- AXIS LINES -->
      <g class="quadrant__axis" v-if="isPositive">
        <line
          :x1="svgWidth - svgWidth * 0.9"
          :y1="svgHeight - svgHeight * 0.935"
          :x2="svgWidth - svgWidth * 0.9"
          :y2="svgHeight - svgHeight * 0.13"
        />
        <line
          :x1="svgWidth - svgWidth * 0.9"
          :y1="svgHeight - svgHeight * 0.13"
          :x2="svgWidth - svgWidth * 0.05"
          :y2="svgHeight - svgHeight * 0.13"
        />
      </g>
      <g class="quadrant__axis" v-else>
        <line :x1="svgWidth / 2" :y1="svgHeight - svgHeight * 0.92" :x2="svgWidth / 2" :y2="svgHeight - svgHeight * 0.08" />
        <line :x1="svgWidth - svgWidth * 0.97" :y1="svgHeight / 2" :x2="svgWidth - svgWidth * 0.03" :y2="svgHeight / 2" />
      </g>

      <!-- AXIS ARROWS -->
      <g v-if="isPositive" class="quadrant__axis__arrows">
        <path
          :d="`M${svgWidth - svgWidth * 0.9} ${svgHeight - svgHeight * 0.935}, ${svgWidth - svgWidth * 0.9 - 4} ${svgHeight - svgHeight * 0.915}, ${
            svgWidth -svgWidth * 0.9 + 4
          } ${svgHeight - svgHeight * 0.915}Z`"
          class="axis-arrow"
        />
        <path
          :d="`M${svgWidth - svgWidth * 0.05} ${svgHeight - svgHeight * 0.13}, ${
            svgWidth - svgWidth * 0.05 - 7
          } ${svgHeight - svgHeight * 0.13 - 4}, ${svgWidth - svgWidth * 0.05 - 7} ${
            svgHeight - svgHeight * 0.13 + 4
          }Z`"
          class="axis-arrow"
        />
      </g>
      <g v-if="displayAxisArrows && !isPositive" class="quadrant__axis__arrows">
        <path
          :d="`M${svgWidth / 2} ${svgHeight - svgHeight * 0.92}, ${svgWidth / 2 - 4} ${svgHeight - svgHeight * 0.9}, ${svgWidth / 2 + 4} ${svgHeight - svgHeight * 0.9}Z`"
          class="axis-arrow"
        />
        <path
          :d="`M${svgWidth - svgWidth * 0.03} ${svgHeight / 2}, ${svgWidth - svgWidth * 0.038} ${svgHeight / 2 - 4}, ${
            svgWidth - svgWidth * 0.038
          } ${svgHeight / 2 + 4}Z`"
          class="axis-arrow"
        />
      </g>

      <!-- CHART BORDER -->
      <g v-if="!displayAxisArrows && !isPositive" class="quadrant__border">
        <path
          :d="`M24 24, ${svgWidth - 24} 24, ${svgWidth - 24} ${svgHeight - 24}, 24 ${
            svgHeight - 24
          }Z`"
        />
      </g>

      <!-- PLOTS -->
      <!-- Plots texts painted first to allow circle pointerover events -->
      <g
        v-for="(dataset, k) in datasets"
        :key="`dataset_text_${k}`"
        class="quadrant__dataset__texts"
      >
        <g
          v-for="(item, i) in dataset.series"
          :key="`plot_text_${i}`"
          class="quadrant__plots__texts"
        >
          <text
            v-if="!isPositive && (showNames || isPlotSelected(plot(item)))"
            :x="calcPlotTextPosition(item, dataset).x"
            :y="calcPlotTextPosition(item, dataset).y"
            :font-size="fonts.plotLabels"
            :font-weight="isPlotSelected(plot(item)) ? '900' : '400'"
            :font-family="fontFamily"
            :fill="
              dark ? (isPlotSelected(plot(item)) ? 'white' : 'grey') : 'black'
            "
            :style="`z-index:0; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}`"
            text-anchor="middle"
          >
            {{ item[2] ? item[2] : dataset.name }}
          </text>
          <text
            v-if="isPositive && (showNames || isPlotSelected(plot(item)))"
            :x="plot(item).x"
            :y="plot(item).y - getRadius(dataset, plot(item)) - 4"
            :font-size="fonts.plotLabels"
            text-anchor="middle"
            :font-weight="isPlotSelected(plot(item)) ? '900' : '400'"
            :font-family="fontFamily"
            :fill="
              dark ? (isPlotSelected(plot(item)) ? 'white' : 'grey') : 'black'
            "
            :style="`z-index:0; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}`"
          >
            {{ dataset.name }}
          </text>
          <!-- PLOT INFO SHOWN ON PLOT HOVER -->
          <transition name="fade" v-if="!showTooltip">
            <g
              v-if="isPlotSelected(plot(item)) && !isPositive"
              class="quadrant__plot__information"
            >
              <!-- X value displayed on Y axis -->
              <text
                :x="plot(item).x"
                :y="svgHeight / 2 + (item[1] > 0 ? fonts.plotCoordinates * 1.5 : -fonts.plotCoordinates / 2)"
                :font-size="fonts.plotLabels"
                font-weight="900"
                text-anchor="middle"
                :fill="dark ? 'white' : 'black'"
                :font-family="fontFamily"
              >
                {{ item[0] }}
              </text>
              <!-- Y value displayed on X axis -->
              <text
                :x="svgWidth / 2 + (item[0] > 0 ? -fonts.plotCoordinates : fonts.plotCoordinates)"
                :y="plot(item).y + 3"
                :font-size="fonts.plotLabels"
                font-weight="900"
                text-anchor="middle"
                :fill="dark ? 'white' : 'black'"
                :font-family="fontFamily"
              >
                {{ item[1] }}
              </text>
              <!-- Dotted line connecting plot to X axis -->
              <line
                :x1="plot(item).x"
                :y1="plot(item).y"
                :x2="svgWidth / 2"
                :y2="plot(item).y"
                stroke-dasharray="4 2"
                class="dashed-line"
              />
              <!-- Dotted line connecting plot to Y axis -->
              <line
                :x1="plot(item).x"
                :y1="plot(item).y"
                :x2="plot(item).x"
                :y2="svgHeight / 2"
                stroke-dasharray="4 2"
                class="dashed-line"
              />
              <!-- Axis markers -->
              <circle
                :cx="svgWidth / 2"
                :cy="plot(item).y"
                r="1"
                :fill="dark ? 'white' : 'black'"
                class="plot-info"
              />
              <circle
                :cx="plot(item).x"
                :cy="svgHeight / 2"
                r="1"
                :fill="dark ? 'white' : 'black'"
                class="plot-info"
              />
              <!-- Plot X information displayed on bottom middle -->
              <text
                :x="svgWidth / 2"
                :y="svgHeight - 12"
                font-size="9"
                text-anchor="middle"
                :fill="dataset.color"
                :font-family="fontFamily"
              >
                {{ xTitle }} : {{ item[0] }}
              </text>
              <!-- Plot Y information displayed on bottom middle -->
              <text
                :x="svgWidth / 2"
                :y="svgHeight - 2"
                font-size="9"
                text-anchor="middle"
                :fill="dataset.color"
                :font-family="fontFamily"
              >
                {{ yTitle }} : {{ item[1] }}
              </text>
            </g>

            <g
              v-if="isPlotSelected(plot(item)) && isPositive"
              class="quadrant__plot__information"
            >
              <!-- X value displayed on X axis -->
              <text
                :x="plot(item).x"
                :y="svgHeight - svgHeight * 0.095"
                font-size="9"
                font-weight="900"
                text-anchor="middle"
                :fill="dark ? 'white' : 'black'"
                :font-family="fontFamily"
              >
                {{ item[0] }}
              </text>
              <!-- Y value displayed on X axis -->
              <text
                :x="svgWidth - svgWidth * 0.92"
                :y="plot(item).y + 3"
                font-size="9"
                font-weight="900"
                text-anchor="middle"
                :fill="dark ? 'white' : 'black'"
                :font-family="fontFamily"
              >
                {{ item[1] }}
              </text>
              <!-- Dotted line connecting plot to X axis -->
              <line
                :x1="plot(item).x"
                :y1="plot(item).y"
                :x2="svgWidth - svgWidth * 0.9"
                :y2="plot(item).y"
                stroke-dasharray="4 1"
              />
              <!-- Dotted line connecting plot to Y axis -->
              <line
                :x1="plot(item).x"
                :y1="plot(item).y"
                :x2="plot(item).x"
                :y2="svgHeight - svgHeight * 0.13"
                stroke-dasharray="4 1"
              />
              <!-- Axis markers -->
              <circle
                :cx="svgWidth - svgWidth * 0.9"
                :cy="plot(item).y"
                r="1"
                :fill="dark ? 'white' : 'black'"
                class="plot-info"
              />
              <circle
                :cx="plot(item).x"
                :cy="svgHeight - svgHeight * 0.13"
                r="1"
                :fill="dark ? 'white' : 'black'"
                class="plot-info"
              />
              <!-- Plot X information displayed on bottom middle -->
              <text
                :x="svgWidth - svgWidth * 0.95"
                :y="svgHeight - svgHeight * 0.05"
                font-size="9"
                text-anchor="start"
                :fill="dataset.color"
                :font-family="fontFamily"
              >
                {{ xTitle }} : {{ item[0] }}
              </text>
              <!-- Plot Y information displayed on bottom middle -->
              <text
                :x="svgWidth - svgWidth * 0.95"
                :y="svgHeight - svgHeight * 0.02"
                font-size="9"
                text-anchor="start"
                :fill="dataset.color"
                :font-family="fontFamily"
              >
                {{ yTitle }} : {{ item[1] }}
              </text>
            </g>
          </transition>
        </g>
      </g>
      <!-- Plots shapes painted last to allow pointerover events in case of text overlapping -->
      <g
        v-for="(dataset, k) in datasets"
        :key="`dataset_shape_${k}`"
        class="quadrant__dataset__shapes"
      >
        <g
          v-for="(item, i) in dataset.series"
          :key="`plot_shape_${i}`"
          class="quadrant__plots__shapes"
        >
          <circle
            v-if="!dataset.shape || dataset.shape === 'circle'"
            :cx="plot(item).x"
            :cy="plot(item).y"
            :r="getRadius(dataset, plot(item))"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="circle"
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )} `"
          />
          <!-- REFACTOR as a loop pass dataset to the createPolygon func --->
          <polygon
            v-if="dataset.shape === 'triangle'"
            :points="
              createPolygon(plot(item), getRadius(dataset, plot(item)), 3, 2.6)
            "
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="triangle"
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}`"
          />

          <polygon
            v-if="dataset.shape === 'square'"
            :points="
              createPolygon(plot(item), getRadius(dataset, plot(item)), 4, 2.35)
            "
            class="square"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :style="`z-index:1;  ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}`"
          />

          <polygon
            v-if="dataset.shape === 'pentagon'"
            :points="
              createPolygon(plot(item), getRadius(dataset, plot(item)), 5, 60)
            "
            class="pentagon"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )} `"
          />

          <polygon
            v-if="dataset.shape === 'hexagon'"
            :points="
              createPolygon(plot(item), getRadius(dataset, plot(item)), 6)
            "
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="hexagon"
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name, false, plot(item))}; ${plotSelectionStyle(
              plot(item)
            )} ; fill-rule: nonzero`"
          />

          <polygon
            v-if="dataset.shape === 'star'"
            :points="createStar(plot(item), getRadius(dataset, plot(item)))"
            :fill="dataset.color"
            pointer-events="visiblePainted"
            @pointerover="showPlot(item, dataset.name, dataset.color)"
            @pointerleave="
              isSelected = false;
              selectedPlot = [Infinity, Infinity];
            "
            class="star"
            :style="`z-index:1; ${datasetSelectionStyle(dataset.name)}; ${plotSelectionStyle(
              plot(item)
            )}; fill-rule: nonzero`"
          />
        </g>
      </g>
      <!-- Averages -->
      <template v-if="displayAverages">
        <g v-for="(dataset, i) in datasets" :key="`dataset_cluster_${i}`">
          <circle
            v-if="dataset.series.length > minToShowAverage"
            :cx="averages[i].x"
            :cy="averages[i].y"
            :r="dataset.radius ? dataset.radius * 15 : shapeRadius * 15"
            :stroke="dataset.color"
            fill="none"
            stroke-dasharray="4 1"
            class="circle"
            :style="`opacity: ${
              isSelected ? '0.05' : '1'
            }; ${datasetSelectionStyle(dataset.name)}`"
          />
        </g>
      </template>
    </svg>
    <!-- LEGEND -->
    <div
      class="quadrant__legend"
      v-if="showLegend"
      :style="`background:${dark ? 'transparent' : 'white'}`"
    >
      <div
        class="quadrant__legend__item"
        v-for="(dataset, i) in datasets"
        :key="`dataset_legend_${i}`"
        @click="showDataset(dataset.name)"
        :style="`${datasetSelectionStyle(dataset.name, true)}`"
      >
        <svg
          :style="`width:20px; height:20px`"
          :viewBox="`0 0 ${dataset.radius ? dataset.radius * 4 : radius * 4} ${
            dataset.radius ? dataset.radius * 4 : radius * 4
          }`"
        >
          <g>
            <circle
              v-if="!dataset.shape || dataset.shape === 'circle'"
              :cx="dataset.radius ? dataset.radius * 2 : radius * 2"
              :cy="dataset.radius ? dataset.radius * 2 : radius * 2"
              :r="dataset.radius ? dataset.radius : radius"
              :fill="dataset.color"
              pointer-events="visiblePainted"
              class="circle"
            />

            <polygon
              v-if="dataset.shape === 'triangle'"
              :points="
                createPolygon(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius,
                  3,
                  2.6
                )
              "
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />

            <polygon
              v-if="dataset.shape === 'square'"
              :points="
                createPolygon(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius,
                  4,
                  2.35
                )
              "
              class="square"
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />

            <polygon
              v-if="dataset.shape === 'pentagon'"
              :points="
                createPolygon(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius,
                  5,
                  60
                )
              "
              class="pentagon"
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />

            <polygon
              v-if="dataset.shape === 'hexagon'"
              :points="
                createPolygon(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius,
                  6
                )
              "
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />

            <polygon
              v-if="dataset.shape === 'star'"
              :points="
                createStar(
                  {
                    x: dataset.radius ? dataset.radius * 2 : radius * 2,
                    y: dataset.radius ? dataset.radius * 2 : radius * 2,
                  },
                  dataset.radius ? dataset.radius : radius
                )
              "
              :fill="dataset.color"
              pointer-events="visiblePainted"
            />
          </g>
        </svg>
        <div :style="`color:${dark ? 'white' : 'black'}`">
          {{ dataset.name }}
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
    // Dark mode support
    dark: {
      type: Boolean,
      default: false,
    },
    // This example datasets shows all available shape options
    datasets: {
      type: Array,
      default() {
        return [
          {
            name: "Series 1",
            series: [[2, 4, "item1"],[3,6, "item2"]], // individual plots can display unique names
            color: "blue",
            radius: 4,
            shape: "circle",
          },
          {
            name: "Series 2",
            series: [[-5, 7]],
            color: "red",
            radius: 4,
            shape: "triangle",
          },
          {
            name: "Series 3",
            series: [[-10, -5]],
            color: "green",
            radius: 4,
            shape: "square",
          },
          {
            name: "Series 4",
            series: [[5, 2]],
            color: "purple",
            radius: 4,
            shape: "pentagon",
          },
          {
            name: "Series 5",
            series: [[10, -10]],
            color: "turquoise",
            radius: 4,
            shape: "hexagon",
          },
          {
            name: "Series 6",
            series: [[11, 5]],
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
          plotLabels: 10,
          quadrantLabels: 12,
          plotCoordinates: 12
        }
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
    // Important: keep same order 
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
          BL:{
            id: "BL",
            name: "Bottom left",
            color: "#616772",
          },
        }
      },
    },
    // Dataset length threshold to display average circles. Needs the prop showAverages to be set to true
    minToShowAverage: {
      type: Number,
      default: 5,
    },
    positive: {
      type: Boolean,
      default: false,
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
    showControls: {
      type: Boolean,
      default: true,
    },
    controlTranslations: {
      type: Object,
      default(){
        return {
          summary: "Controls",
          legendChartParameters: "Chart parameters",
          labelBackground: "Quadrant background",
          labelDisplayAverages: "Averages",
          labelDisplayAxisArrows: "Axis arrows",
          labelHeight: "Height",
          labelWidth: "Width",
          labelShapeRadius: "Shapes radius",
          resetButton: "RESET",
          legendFontSizes: "Font sizes",
          labelPlotLabels: "Plot labels",
          labelAxisLabels: "Axis labels",
          labelQuadrantLabels: "Quadrand labels"
        }
      }
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
    // Show text next to plots
    showNames: {
      type: Boolean,
      default: true,
    },
    // Tooltip can have unexpected behaviour if a parent container has padding or margin
    // It is recommended to use the default plot information system
    showTooltip: {
      type: Boolean,
      default: false,
    },
    useQuadrantBackground: {
      type: Boolean,
      default: false,
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
    return {
      clientX: 0,
      clientY: 0,
      isSelected: false,
      selectedDatasets: this.datasets.map((item) => item.name),
      selectedPlot: [0, 0],
      selectedSideId: undefined,
      tooltipContent: "",
      isPositive: this.positive,
      useBackground: this.useQuadrantBackground,
      svgHeight: this.height,
      svgWidth: this.width,
      fonts: this.fontSizes,
      displayAverages: this.showAverages,
      displayAxisArrows: this.axisArrows,
      shapeRadius: this.radius,
    };
  },
  computed: {
    averages() {
      return this.datasets.map((dataset) => {
        const meanX = [];
        const meanY = [];
        dataset.series.forEach((serie) => {
          meanX.push(serie[0]);
          meanY.push(serie[1]);
        });
        const x = meanX.reduce((a, b) => a + b, 0) / meanX.length;
        const y = meanY.reduce((a, b) => a + b, 0) / meanY.length;
        return this.plot([x, y]);
      });
    },
    extremes() {
      // Retrieve max value on which will be based all plots x and y relative coordinates
      const allX = [];
      const allY = [];
      this.datasets.forEach((serie) => {
        serie.series.forEach((item) => {
          allX.push(Math.abs(item[0]));
          allY.push(Math.abs(item[1]));
        });
      });
      const x = Math.max(...allX);
      const y = Math.max(...allY);
      return { x, y };
    },
    quadrantLabels(){
      const keys = Object.keys(this.labels);
      const adjustments = [
        { x: 0.97, y: 0.94 },
        { x: 0.037, y: 0.94 },
        { x: 0.037, y: 0.02 },
        { x: 0.97, y: 0.02 }
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
          name: this.labels[key].name
        })
      });
      return arr;
    },
    quadrantStyle() {
      return `
        background: ${this.dark ? "transparent" : "white"};
      `;
    },
    tooltipStyle() {
      return `
        font-family: ${this.fontFamily};
        top: ${this.clientY + 20}px;
        left: ${this.clientX - 100}px;
      `;
    },
  },
  methods: {
    calcStarPoints(
      centerX,
      centerY,
      innerCirclePoints,
      innerRadius,
      outerRadius
    ) {
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
    createPolygon(plot, radius, sides, rotation = 0) {
      const centerX = plot.x;
      const centerY = plot.y;
      const outerPoints = sides / 2;
      return this.calcPolygonPoints(
        centerX,
        centerY,
        outerPoints,
        radius + 1,
        rotation
      );
    },
    calcPolygonPoints(centerX, centerY, outerPoints, radius, rotation) {
      const angle = Math.PI / outerPoints;
      const angleOffsetToCenter = rotation;
      let points = "";
      for (let i = 0; i < outerPoints * 2; i += 1) {
        let currX =
          centerX + Math.cos(i * angle + angleOffsetToCenter) * radius;
        let currY =
          centerY + Math.sin(i * angle + angleOffsetToCenter) * radius;
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
    datasetSelectionStyle(datasetName, isLegend = false) {
      if (this.selectedDatasets.length === 0) {
        return "";
      }
      if (this.selectedDatasets.includes(datasetName)) {
        return "opacity: 1";
      } else {
        if(isLegend){
          return "opacity: 0.3";
        }
        return "opacity: 0.05";
      }
    },
    getClientPosition(e) {
      this.clientX = e.offsetX;
      this.clientY = e.offsetY;
    },
    getPlotSide(plot){
      const x = plot[0];
      const y = plot[1];

      switch (true) {
        case x >= 0 && y >= 0:
          return "TR";
        
        case x < 0 && y >= 0:
          return "TL";

        case x < 0 && y < 0:
          return "BL";

        case x >= 0 && y < 0:
          return "BR";
      
        default:
          return "";
      }
    },
    calcPlotTextPosition(plot, dataset){
      const {x, y, quadrantSide } = this.plot(plot);
      const radius = this.getRadius(dataset, this.plot(plot)) * 2;
      let posX = x;
      let posY;
      switch (true) {
        case quadrantSide === "TL":
          posY = y - radius * 1.2;
          break;
        
        case quadrantSide === "TR":
          posY = y - radius * 1.2;
          break;
        
        case quadrantSide === "BL":
          posY = y + radius * 2;
          break;
        
        case quadrantSide === "BR":
          posY = y + radius * 2;
          break;

        default:
          posY = y;
          break;
      }
      return {x: posX, y: posY};
    },
    getRadius(dataset, plot) {
      let increase = 1;
      if (this.isPlotSelected(plot)) {
        increase *= 1.5;
      }
      if (dataset.radius) {
        return dataset.radius * increase;
      }
      return this.shapeRadius * increase;
    },
    hexToRgb(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `rgba(${parseInt(result[1], 16)},${parseInt(
            result[2],
            16
          )},${parseInt(result[3], 16)},0.1)`
        : hex;
    },
    isPlotSelected(plot) {
      return this.selectedPlot.x === plot.x && this.selectedPlot.y === plot.y;
    },
    plot(tuple) {
      const quadrantSide = this.getPlotSide(tuple);
      let x, y;
      if (!this.isPositive) {
        x = ((tuple[0] / this.extremes.x) * this.svgWidth) / 2.8 + this.svgWidth / 2;
        y =
          (-(tuple[1] / this.extremes.y) * this.svgHeight) / 2.6 + this.svgHeight / 2;
      } else {
        x =
          ((tuple[0] / this.extremes.x) * this.svgWidth) / 1.25 + this.svgWidth / 10;
        y =
          (this.svgHeight - (tuple[1] / this.extremes.y) * this.svgHeight) / 1.3 +
          this.svgHeight / 10;
      }
      return { x, y, quadrantSide };
    },
    plotSelectionStyle(plot) {
      if (!this.isSelected) {
        return "";
      }
      if (this.isPlotSelected(plot)) {
        // Highlight selected plot & text
        if (this.showTooltip) {
          return "opacity: 0.05 !important";
        }
        return "opacity: 1";
      } else {
        // Dim down all other plots & texts
        return "opacity: 0.05 !important";
      }
    },
    resetFontSizes(){
      this.fonts = {
          axisLabels: 12,
          plotLabels: 10,
          quadrantLabels: 12,
          plotCoordinates: 12
        }
    },
    resetSVG(){
      this.svgHeight = this.height;
      this.svgWidth = this.width;
      this.useBackground = this.useQuadrantBackground;
      this.displayAverages = this.showAverages;
      this.shapeRadius = this.radius;
    },
    showAverage(plot) {
      this.selectedPlot = plot;
      this.isSelected = true;
    },
    showDataset(datasetName) {
      if(this.selectedDatasets.includes(datasetName)){
        this.selectedDatasets = this.selectedDatasets.filter((el) => el !== datasetName);
        if(this.selectedDatasets.length === 0){
          this.selectedDatasets = this.datasets.map((item) => item.name)
        }
      }else{
        this.selectedDatasets.push(datasetName);
      }
    },
    showPlot(plot, name, color) {
      if(!this.selectedDatasets.includes(name) && this.selectedDatasets.length){
        return;
      }
      this.selectedPlot = this.plot(plot);
      this.isSelected = true;
      const labelX = `${this.xTitle} : <strong>${plot[0]}</strong>`;
      const labelY = `${this.yTitle} : <strong>${plot[1]}</strong>`;
      this.tooltipContent = `
        <div style="align-items:center; justify-content:center">
            <div style="display:flex;align-items:center;justify-content:center; margin-bottom:6px"> <div class="quadrant__tooltip__dot" style="background:${color}; display: block; height:12px; width:12px; border-radius:50%; margin-right: 6px;"></div>${name}</div>
        
            <div style="display: flex; flex-direction: column; align-items:start;text-align:left; width:100%">
                <span style="text-align:left;">${labelX}</span>
                <span>${labelY}</span>
            </div>
        </div>
      `;
    },
  },
  mounted() {
    if (this.datasets.length === 1 && this.datasets[0].series.length <= 1) {
      throw `Your datasets must contain at least 2 tuples. You only provided series: [[${this.datasets[0].series}]]`;
    }
    if (!this.datasets) {
      throw "You have not provided a dataset or its format is wrong";
    }
  },
};
</script>

<style lang="scss" scoped>
line,
path {
  stroke-width: 1px;
  stroke: rgba(100, 100, 100, 0.3);
}
fieldset{
  border: 1px solid #ccc;
  border-radius: 2px;
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
  transition:top 0.5s ease;
  background: white;
  button{
    background-color: rgb(230, 230, 230); padding: 3px 12px;
    border-radius: 3px;
    align-self: flex-start;
    box-shadow: 0 3px 6px -3px rgba(0,0,0,0.1);
    transition: background-color 0.1s ease-in-out;
    &:hover{
      background-color: rgb(223, 223, 223);
    }
  }
}
.dashed-line{
  animation: dashed 30s linear infinite;
}
@keyframes dashed {
  to {
    stroke-dashoffset: 1000;
  }
}
path.axis-arrow {
  fill: rgb(224, 224, 224);
}
path.triangle,
path.square {
  stroke: none;
}
.circle,
polygon {
  z-index: 100;
  opacity: 0.75;
  transition: all 0.1s ease-in-out;
}
text {
  cursor: default;
  transition:  all 0.2s ease-in-out;
}
.quadrant_wrapper {
  width: 100%;
  position: relative;
}
.quadrant,
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
    padding: 12px 0;
    &__item {
      display: flex;
      align-items:center;
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
    padding: 12px;
    &__item {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }
  &__tooltip {
    position: absolute;
    display: block;
    z-index: 1;
    padding: 12px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.11);
    width: 200px;
    color: black !important;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 0.75rem solid transparent;
      border-top: none;
      border-bottom-color: #fff;
      filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
    }
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
</style>