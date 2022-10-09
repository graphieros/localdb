<template>
    <div style="width: 100%">
        <!-- CONTROLS -->
        <div 
            v-if="showControls" 
            class="donut-evolution__controls"
        >
            <div>
              <input 
                id="donutEvolutionCheckbox" 
                type="checkbox" 
                v-model="showTooltip" 
                name="donutEvolutionCheckbox" 
                :checked="showTooltip"
              >
              <label for="donutEvolutionCheckbox">{{ controlTranslations.showTooltip }}</label> 
            </div>
        </div>

        <!-- TOOLTIP -->
        <div 
            v-show="showTooltip && isTooltip" 
            class="donut-evolution__tooltip"
            ref="deTooltip"
            :style="`
                z-index:1;
                position: fixed;
                left:${mousePosition.clientX + tooltipSmartPlacement.x}px;
                top:${mousePosition.clientY + tooltipSmartPlacement.y}px;
                display: grid;
                grid-template-columns: repeat(${tooltipGrid - 1}, 1fr);
            `"
            v-html="tooltipContent"
        >
        </div>

        <!-- CHART -->
        <svg 
            width="100%" 
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`" 
            :style="`font-family:${fontFamily}; max-width:${maxWidth}px`">
            
            <!-- TITLE, GRID, XAXIS LABEL, TONALITY LEGEND -->
            <g>
                <g v-if="title">
                <text 
                    text-anchor="middle" 
                    fill="black" 
                    :x="svgWidth / 2" 
                    :y="padding / 2" 
                    font-weight="bold" 
                    font-size="1.3em"
                    :style="selectedDonut.hasOwnProperty('x') ? 'opacity:0.3' : 'opacity: 1'"
                >
                    {{ title }}
                </text>
                </g>

                <g 
                  v-for="(gridline,i) in maxColumns" 
                  :key="`gridline_${i}`"
                >
                <!-- Vertical grid lines -->
                <line 
                    :x1="calcXPosition(i)" 
                    :x2="calcXPosition(i)" 
                    :y1="-12" 
                    :y2="svgHeight - padding - legendMargin" class="gridline"
                />
                <!-- Time period columns -->
                <rect
                    :class="{'x-segment--grey': i % 2 === 0, 'x-segment--white' : i % 2 !== 0, 'period-selected': i === hoverPeriodIndex && showTooltip}" 
                    :x="calcXPosition(i)" 
                    :y="-12" 
                    :height="svgHeight - legendMargin - 17" 
                    :width="columnSize"
                />
                <!-- Time period labels -->
                <foreignObject 
                    :x="calcXPosition(i)" 
                    :y="svgHeight - 24 - legendMargin" 
                    :width="columnSize" 
                    :height="30"
                >
                    <div 
                        class="x-label" 
                        :style="`font-weight:${selectedPeriodIndex === i || (hoverPeriodIndex === i && showTooltip) ? '700' : '400'}`"
                    >
                        {{ xLabels[i] }}
                    </div>
                </foreignObject>
                </g>
        
                <!-- Tonality legend -->
                <g>
                <foreignObject 
                    :x="0" 
                    :y="svgHeight - legendMargin" 
                    :width="svgWidth" height="30"
                >
                    <div class="tonality-legend">
                        <div 
                            class="tonality-legend__item" 
                            v-for="(tonality, i) in tonalities" 
                            :key="`tonality-legend_${i}`"
                            :style="segregated.includes(i) ? 'opacity:0.2;' : 'opacity:1;'"
                            @click="selectLegend(i)"
                        >
                            <div 
                                class="legend-marker" 
                                :style="`background:${tonality.color};`"
                            />
                            <span :style="`font-size:${maxFontSize}px;`">
                                {{ tonality.name }}
                            </span>
                        </div>
                    </div>
                </foreignObject>
                </g>
            </g>

            <!-- LINES LAYOUT -->
            <g v-if="showLineToggle">
               <g 
                v-for="(topic,i) in datasetCopy" 
                :key="`topic_${i}`" 
                :style="selectedDonut.hasOwnProperty('x') ? 'opacity: 0.2' : 'opacity:1'" 
              >
                <!-- Yaxis checkboxes for line toggles -->
                    <foreignObject 
                        style="overflow: visible;" 
                        :x="0" 
                        :y="calcYPosition(i + 1) - padding - (gap) + 2" 
                        :height="rowHeight" 
                        :width="yMargin"
                    >
                        <input 
                          type="checkbox" 
                          name="donutEvolutionCheckboxLine" 
                          style="position: absolute; right:0; top: 50%; transform: translateY(-50%);"
                          @input="checkLine(i)"
                        >
                    </foreignObject>

                <foreignObject 
                  :x="yMargin" 
                  :y="calcYPosition(i + 1) - padding*1.5" 
                  :height="rowHeight" 
                  :width="svgWidth - yMargin"
                  style="overflow: visible;"
                >
                  <svg 
                    v-if="visibleLines.includes(i)"
                    width="100%" 
                    :viewBox="`0 0 ${svgWidth - yMargin} ${rowHeight}`" 
                    class="line-chart"
                    :style="`background: rgba(0,0,0,0); padding: ${padding / 2}px 0;`"
                  >
                    <g 
                      v-for="(line,j) in buildSeries(topic)" 
                      :key="`topic_line_${i}_${j}`"
                    >
                      <!-- visible line -->
                      <path v-if="j < buildSeries(topic).length - 1 && line.base !== null"
                        :d="createLine(j, line, topic)"
                        :stroke="nonSegregatedTonalities.length === 1 ? nonSegregatedTonality.color : 'grey'"
                        :stroke-width="hoverPeriodIndexBetween.j === j && hoverPeriodIndexBetween.i === i ? 10 : 4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="visible-line"
                      />
                      <!-- hoverable thicker line, transparent -->
                      <path v-if="j < buildSeries(topic).length - 1 && line.base !== null"
                        :d="createLine(j, line, topic)"
                        stroke="transparent"
                        stroke-width="20"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        @pointerover="hoverBetweenDonuts(i, j, line, buildSeries(topic)[j+1])"
                        @pointerout="isTooltip = false; hoverPeriodIndexBetween = {i:undefined, j: undefined}"
                      />
                      <!-- visible plot -->
                      <circle
                          v-if="line.base !== null"
                          :cx="createPlotLinePosition(j, line, topic).x" 
                          :cy="createPlotLinePosition(j, line, topic).y" 
                          r="3"
                          :stroke="nonSegregatedTonalities.length === 1 ? nonSegregatedTonality.color : 'grey'"
                          fill="white"
                      />
                      <!-- hoverable larger plot, transparent -->
                      <circle
                          v-if="line.base !== null"
                          :cx="createPlotLinePosition(j, line, topic).x" 
                          :cy="createPlotLinePosition(j, line, topic).y" 
                          r="10"
                          stroke="transparent"
                          fill="transparent"
                          @pointerover="hoverDonut({periodIndex:j})"
                          @pointerout="isTooltip = false; hoverPeriodIndex = undefined"
                      />
                      <!-- Sum label above line plot -->
                        <text 
                            text-anchor="middle" 
                            :font-size="`${maxFontSize * 0.8}px`" 
                            fill="black" 
                            :font-weight="hoverPeriodIndexBetween.i === i && (hoverPeriodIndexBetween.j === j || hoverPeriodIndexBetween.j === j-1) ? 'bold' : '400'"
                            :x="createPlotLinePosition(j, line, topic).x" 
                            :y="createPlotLinePosition(j, line, topic).y - 8"
                        >
                            {{ 
                                line.base.toFixed(0).toLocaleString()
                            }}
                        </text>
                    </g>
                  </svg>
                </foreignObject>
              </g>
            </g>

            <!-- Y LABELS -->
            <g v-for="(donutSerie, i) in datasetCopy" :key="`yLabel_${i}`">
              <foreignObject 
                        style="overflow: visible;" 
                        :x="0" :y="calcYPosition(i + 1) - padding - (gap)" 
                        :height="rowHeight" 
                        :width="(svgWidth / (maxColumns +2) *2) - padding / 3"
                    >
                        <div 
                            class="y-label" 
                            :style="`font-size:${maxFontSize}px; font-weight:${selectedSerieIndex === i ? '700' : '400'};`"
                        >
                            {{ donutSerie.name }}
                        </div>
                  </foreignObject>
            </g>
        
            <!-- DONUTS LAYOUT -->
            <g class="donuts-chart">
                <g 
                v-for="(donutSerie,i) in datasetCopy" 
                :key="`donutSerie_${i}`"
                >
                  <g v-if="!visibleLines.includes(i)">
                    <!-- Horizontal line passing through all donuts of a serie -->
                    <line 
                        v-if="!selectedDonut.hasOwnProperty('x') && !showInnerEvolutionPath" 
                        :x1="calcLineCoordinatesX().x1" 
                        :x2="calcLineCoordinatesX().x2" 
                        :y1="calcYPosition(i + 1)" 
                        :y2="calcYPosition(i + 1)"
                        class="donut-connector"
                    />
            
                    <!-- Dotted line indicators (selected state) -->
                    <g 
                      v-if="selectedDonut.hasOwnProperty('x')"
                    >
                      <!-- horizontal dotted line -->
                      <line 
                          :x1="selectedDonut.x" 
                          :x2="yMargin" 
                          :y1="selectedDonut.y" 
                          :y2="selectedDonut.y" 
                          class="donut-connector--dashed"
                      />
                      <!-- vertical dotted line -->
                      <line 
                          :x1="selectedDonut.x" 
                          :x2="selectedDonut.x" 
                          :y1="selectedDonut.y" 
                          :y2="svgHeight - padding - legendMargin" 
                          class="donut-connector--dashed"
                      />
                      <!-- plot on left of horizontal dotted line -->
                      <circle 
                          :cx="yMargin" 
                          :cy="selectedDonut.y" 
                          r="2" 
                          class="plot"
                      />
                      <!-- plot on bottom of vertical dotted line -->
                      <circle 
                          :cx="selectedDonut.x" 
                          :cy="svgHeight - padding - legendMargin" 
                          r="2" 
                          class="plot"
                      />
                    </g>
                    
                    <!-- PLOT MARKERS, EVOLUTION PATHS, DONUTS, HOLLOWS, SUM LABELS -->
                    <g 
                      v-for="(donut,j) in buildSeries(donutSerie)" 
                      :key="`donut_${i}_${j}`" 
                      :style="selectedDonut.hasOwnProperty('x') ? selectedDonut.donutId === donut.donutId ? 'opacity: 1' : 'opacity:0.2' : 'opacity:1'" 
                    >
            
                      <!-- Plot marker (specifically visible if the sum of a serie = 0) -->
                      <circle 
                          :cx="calcXPosition(j) + calcHalfDonutSize()" 
                          :cy="calcYPosition(i + 1)" 
                          r="2" 
                          class="plot"
                      />

                    <!-- Evolution path between donuts, with hover event -->
                    <!-- HOVER EVENT: show tooltip with month to month evolution for specific topic & non-segregated tonalities -->
                      <path 
                          v-if="j < buildSeries(donutSerie).length -1 && showInnerEvolutionPath && !selectedDonut.hasOwnProperty('x')"
                          :d="createPathBetween(i, j, donut, buildSeries(donutSerie)[j+1])"
                          :style="`fill: ${i === hoverPeriodIndexBetween.i && j === hoverPeriodIndexBetween.j ? 'rgba(0,0,0,0.2);' : 'rgba(0,0,0,0.08);'}`"
                          :stroke="`${i === hoverPeriodIndexBetween.i && j === hoverPeriodIndexBetween.j ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0)'}`"
                          :stroke-width="`${i === hoverPeriodIndexBetween.i && j === hoverPeriodIndexBetween.j ? '1' : '0'}`"
                          @pointerover="hoverBetweenDonuts(i, j, donut, buildSeries(donutSerie)[j+1])"
                          @pointerout="isTooltip = false; hoverPeriodIndexBetween = {i:undefined, j: undefined}"
                      />

                      <!-- DONUTS with click & hover events (hollows, sum labels, donut generation) -->
                      <!-- CLICK EVENT: set donut as selected and show the zoom state -->
                      <!-- HOVER EVENT: show tooltip with all topics data of selected period -->
                      <g 
                        class="pointer" 
                        @click="selectDonut({donut, serieIndex: i, x:calcXPosition(j) + calcHalfDonutSize(), y:calcYPosition(i + 1), id:donut.donutId, periodIndex:j})" 
                        @pointerover="hoverDonut({periodIndex:j})"
                        @pointerout="isTooltip = false; hoverPeriodIndex = undefined"
                      >
                        <!-- Hollow -->
                        <circle 
                            :cx="calcXPosition(j) + calcHalfDonutSize()" 
                            :cy="calcYPosition(i + 1)" 
                            :r="donut.base / maxSerie * maxDonutSize"
                            fill="white" 
                        />
                
                        <!-- Sum label above donut -->
                        <text 
                            text-anchor="middle" 
                            :font-size="`${maxFontSize * 0.8}px`" 
                            fill="black" 
                            :x="calcXPosition(j) + calcHalfDonutSize()" 
                            :y="calcYPosition(i + 1) - donut.base / maxSerie * maxDonutSize - 5"
                        >
                            {{ 
                                getSum(donut.series).toFixed(0).toLocaleString()
                            }}
                        </text>
                
                        <!-- Donut generation -->
                        <path
                            class="mini-donut"
                            v-for="(arc,k) in makeDonut(donut, calcXPositionDonut(j), calcYPosition(i + 1), calcDonutRadius(donut), calcDonutRadius(donut))" 
                            :key="`arc_${i}_${j}_${k}`" 
                            :d="arc.path" 
                            :stroke="arc.color" 
                            :stroke-width="donut.base / maxSerie * 6 < 3 ? 3 : donut.base / maxSerie * 6"
                        />
                      </g>
                    </g>
                  </g>
                   
                </g>
            </g>
          
        
            <!-- DONUT SELECTED STATE ZOOM -->
            <template 
                v-if="selectedDonut.hasOwnProperty('x')"
            >
                <g 
                    @click="selectDonut({selectedDonut, x:selectedDonut.x, y: selectedDonut.y, id: selectedDonut.donutId, periodIndex: selectedPeriodIndex})"
                >
                    <circle
                        :cx="selectedDonut.x"
                        :cy="selectedDonut.y"
                        :r="50"
                        fill="white"
                    />
                    <path
                        v-for="(arc, i) in makeDonut(
                            selectedDonut,
                            selectedDonut.x,
                            selectedDonut.y,
                            50,
                            50
                        )"
                        :key="`arc_selected_${i}`"
                        :d="arc.path"
                        :stroke="arc.color"
                        :stroke-width="24"
                        fill="none"
                    />
                </g>
            </template>
        
            <!-- DONUT HOLLOW (SELECTED STATE) -->
            <template 
                v-if="selectedDonut.hasOwnProperty('x')"
            >
                <foreignObject 
                    @click="selectDonut({
                        selectedDonut, 
                        x:selectedDonut.x, 
                        y:selectedDonut.y, 
                        id:selectedDonut.donutId
                    })"
                    :x="selectedDonut.x - 60"
                    :y="selectedDonut.y - 60"
                    height="120"
                    width="120"
                    :style="'overflow: visible;'"
                    id="selected"
                    class="donut__segments--selected pointer"
                >
                    <div
                        :class="{ 'donut-gradient': gradient, 'donut-overlay': overlay }"
                        :style="`
                        align-items: center;
                        border-radius: 50%; 
                        font-weight: bold;
                        color: black;
                        display: flex;
                        font-size:0.7rem;
                        height: 100%;
                        justify-content: center;
                        overflow: visible;
                        text-align: center;
                        width:100%;
                        `"
                    >
                        <span class="zoomed-verbatim">
                        <span style="color: black; font-size: 1.3em;">
                            {{ xLabels[selectedPeriodIndex] }}
                            <br/>
                            {{ getSum(selectedDonut.series).toFixed(0).toLocaleString() }}
                        </span>
                        </span>
                    </div>
                </foreignObject>
            </template>
                    
                <!-- % MARKERS DONUT SELECTED STATE -->
            <template 
                v-if="selectedDonut.hasOwnProperty('x')"
            >
                <foreignObject
                    id="markers"
                    v-for="(arc, k) in makeDonut(
                        selectedDonut,
                        selectedDonut.x - 18,
                        selectedDonut.y - 18,
                        50,
                        50
                    )"
                    :key="`arc_select_${k}`"
                    @click="selectDonut({
                        selectedDonut, 
                        x:selectedDonut.x, 
                        y:selectedDonut.y, 
                        id:selectedDonut.donutId
                    })"
                    :x="arc.center.endX"
                    :y="arc.center.endY"
                    :height="35"
                    :width="35"
                    style="overflow: visible"
                    class="donut__segments--selected pointer"
                >
                  <div 
                    v-if="arc.proportion * 100 > minPercentToDisplayMarker"
                    :style="`
                    align-items:center; 
                    background:white; 
                    border-radius: 50%; 
                    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
                    color: black; 
                    display: block; 
                    display: flex; 
                    font-size:${maxFontSize * 0.85}px; 
                    font-weight: bold; 
                    height: 40px !important; 
                    justify-content:center; 
                    padding: 12px;
                    text-align:center;
                    width: 40px !important; 
                    z-index:100;
                `"
                >
                    <span style="line-height: 14px;">
                        {{ (arc.proportion * 100).toFixed(0) }}%
                        <br>
                        <span style="font-size:0.9em; color:#aaa">
                        {{ Math.round(arc.value) }}
                        </span>
                    </span>  
                  </div>
              </foreignObject>
          </template>
        </svg>
    </div>
</template>

<script>
export default {
   name: "DonutEvolution",
    props: {
      containerWidth: {
        // pass dynamic size of parent component based on a ResizeObserver
        type: Number,
        default: undefined,
      },
      controlTranslations: {
        type: Object,
        default(){
            return {
                showTooltip: "Afficher les données au survol",
                isLine: "Mode ligne"
            }
        }
      },
      dataset: {
        type: Array,
        default() {
          /** Dataset must respect this format:
           * 
           * [
           *    {
           *      id: String,
           *      name: String,
           *      series: [
           *        {
           *          name: String,
           *          values: Number[],
           *          color: String (hex format)
           *        }
           *      ]
           *      // Empty data in series.values must be replaced with 0 or null !
           *      // if not, unwanted offset will occur on incomplete sets
           *    }
           * ]
           *
           */
          return [
            {
              id: "01",
              name: "topic_1",
              series: [
                {
                  name: "Positive",
                  values: [15, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 20, 0],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [1, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [0, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [0, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#ebc034",
                },
              ],
            },
            {
              id: "02",
              name: "topic_2",
              series: [
                {
                  name: "Positive",
                  values: [30, 90, 12, 8, 4, 1, 12, 36, 10, 9, 10, 11, 1],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [16, 10, 22, 8, 24, 6, 2, 3, 25, 19, 12, 19, 12],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#ebc034",
                },
              ],
            },
            {
              id: "03",
              name: "topic_3",
              series: [
                {
                  name: "Positive",
                  values: [30, 10, 12, 18, 4, 16, 12, 10, 15, 9, 10, 45, 1],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [3, 14, 12, 8, 4, 16, 25, 0, 15, 9, 10, 1, 1],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [30, 10, 12, 8, 4, 16, 40, 30, 15, 19, 10, 11, 1],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [3, 10, 12, 8, 4, 16, 12, 20, 15, 9, 10, 11, 1],
                  color: "#ebc034",
                },
              ],
            },
            {
              id: "04",
              name: "topic_4",
              series: [
                {
                  name: "Positive",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#ebc034",
                },
              ],
            },
            {
              id: "05",
              name: "topic_5",
              series: [
                {
                  name: "Positive",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [3, 10, 12, 8, 4, 16, 12, 30, 15, 9, 10, 11, 1],
                  color: "#ebc034",
                },
              ],
            },
          ];
        },
      },
      fontFamily: {
        type: String,
        default: "Product Sans",
      },
      gradient: {
        // apply a gradient on donut's selected state
        type: Boolean,
        default: false,
      },
      height: {
        type: Number,
        default: 400,
      },
      minPercentToDisplayMarker: {
        type: Number,
        default: 5, // will hide by default any marker for a proportion of <5%
      },
      maxWidth: {
        type: Number,
        default: 1200,
      },
      overlay: {
        // apply a shadow under donut's selected state
        type: Boolean,
        default: false,
      },
      rounding: {
        type: Number,
        default: 1,
      },
      showControls: {
        type: Boolean,
        default: true,
      },
      showInnerEvolutionPath: {
        // show evolution between donuts as a filled path
        type: Boolean,
        default: false,
      },
      showLineToggle: {
        // show individual checkboxes to toggle line mode
        type: Boolean,
        default: true,
      },
      showTooltipEvolutionBetween: {
        // show tooltip on hover of the evolution paths
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: "",
      },
      useSegregation: {
        // activate segregation events on legend
        type: Boolean,
        default: true,
      },
      width: {
        type: Number,
        default: 800,
      },
      xLabels: {
        // time labels on x axis
        type: Array,
        default() {
          return [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
            "JAN",
          ];
        },
      },
    },
    data() {
      return {
        gap: 2,
        hoverPeriodIndex: undefined, // period index of a selected column
        hoverPeriodIndexBetween: { // period index of a selected evolution path (i: topic; j: start period)
          i: undefined,
          j: undefined,
        },
        isLine: true,
        isTooltip: false,
        legendMargin: 24,
        maxFontSize: this.containerWidth ? this.containerWidth * 0.02 : 15,
        mousePosition: {
            clientX: 0,
            clientY: 0,
        },
        padding: 30,
        parentElementWidth: this.containerWidth ? this.containerWidth : this.width,
        segregated: [],
        selectedDonut: {},
        selectedPeriodIndex: null,
        selectedSerieIndex: null,
        showPercentageLabels: true,
        showTooltip: true,
        svgHeight: this.height,
        svgWidth: this.width,
        tooltipContent: "",
        tooltipHeight: 0,
        tooltipPadding: 24,
        tooltipWidth: 0,
        yMargin: 120,
        visibleLines: [],
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      };
    },
    computed: {
        columnSize(){
            return (this.svgWidth - this.yMargin) / this.maxColumns;
        },
        datasetCopy(){
            // using a copy of props.dataset to apply local segregation mutations
            return this.dataset.map((datapoint) => {
                return {
                    ...datapoint,
                    series: datapoint.series.map((serie, i) => {
                        if(this.segregated.includes(i)){
                            return {
                                ...serie,
                                values: serie.values.map((_val) => null)
                            }
                        }
                        return {...serie};
                    })
                }
            });
        },
        maxColumns() {
            const columns = [];
            this.datasetCopy.forEach((datapoint) => {
                datapoint.series.forEach((serie) => {
                    columns.push(serie.values.length);
                });
            });
            return Math.max(...columns);
        },
        maxDonutSize() {
            let size = (100 * (this.svgHeight / this.svgWidth) / this.dataset.length) + ((this.dataset.length - 2) * this.gap) + (this.legendMargin / this.dataset.length);
            size = size > this.columnSize / 2 ? this.columnSize / 2 : size;
            return size > 30 ? 30 : size;
        },
        maxSerie() {
            const maxSerie = [...this.datasetCopy]
                .map((datapoint) => {
                    return this.buildSeries(datapoint);
                })
                .map((datapoint) => {
                    return datapoint.flatMap((serie) => serie.base);
                });
            return Math.max(...maxSerie.flat());
        },
        nonSegregatedTonalities(){
            return this.tonalities.filter((_t,i) => {
                return !this.segregated.includes(i)
            });
        },
        nonSegregatedTonality(){
            return this.tonalities.find((_t,i) => {
                return !this.segregated.includes(i)
            })
        },
        rowHeight(){
          return this.maxDonutSize * 2 + this.padding / 2;
        },
        tonalities() {
            const allSeriesNamesAndColors = this.dataset.flatMap((datapoint) => {
                return datapoint.series.map(({name, color}) => {
                    return { name, color };
                    });
                });
            return [...new Map(allSeriesNamesAndColors.map(obj => [JSON.stringify(obj), obj])).values()];
        },
        seriesBases() {
            const seriesBases = [];
            this.datasetCopy.forEach((datapoint) => {
                let datapointBases = [];
                for (let i = 0; i < this.maxColumns; i += 1) {
                    datapointBases.push(datapoint.series
                        .map((serie) => {
                            return serie.values[i] ? serie.values[i] : 0;
                        })
                        .reduce((a, b) => a + b, 0)
                    );
                }
                seriesBases.push(datapointBases);
                });
            return seriesBases;
        },
        tooltipGrid(){
            // adapts the grid layout of the tooltip depending on the number of topics
            if(this.datasetCopy.length <= 10) return 1;
            return Math.round(this.datasetCopy.length / 10) > 3 ? 3 : Math.round(this.datasetCopy.length / 10);
        },
        tooltipSmartPlacement(){
            // avoids tooltip screen overflow
            const tooltipOverflowsBottom = this.mousePosition.clientY + this.tooltipHeight + this.tooltipPadding * 2 > this.windowHeight;
            const tooltipOverflowsRight = this.mousePosition.clientX + this.tooltipWidth > this.windowWidth;
            let x,y;
            if(tooltipOverflowsBottom){
                // place tooltip on top
                y = - this.tooltipHeight - this.tooltipPadding * 2;
            }else{
                // place tooltip below
                y = this.tooltipPadding;
            }

            if(tooltipOverflowsRight){
                // place tooltip on the left
                x = - this.tooltipWidth;
            }else{
                // place tooltip centered mouseX
                x = - this.tooltipWidth / 2 - this.tooltipPadding;
            }
            return { x, y };
        },
    },
    methods: {
        // GENERIC UTILS
        calcEvolPercent(after, before){
            return ((after / before) - 1) * 100;
        },
        calcProportionPercent(num1, num2){
            return num1 / num2 * 100;
        },
        sumArray(array){
            const newArray = [];
            array.forEach(sub => {
                sub.forEach((num, index) => {
                    if(newArray[index]){
                        newArray[index] += num || 0;
                    }else{
                        newArray[index] = num || 0;
                    }
                });
            });
            return newArray;
        },
        // LINE & PATH UTILS
        checkLine(index){
          if(this.visibleLines.includes(index)){
            this.visibleLines = this.visibleLines.filter((line) => line !== index);
          }else{
            this.visibleLines.push(index);
          }
        },
        createLinePlot(line, topic){
          const max = Math.max(...topic.map((t) => t.base));
          const proportion = line.base / max;
          return {
            proportion,
            base: line.base
          }
        },
        createLine(j, line, topic){
          return `M
            ${(this.svgWidth - this.yMargin) * (j / this.maxColumns) + this.columnSize / 2},
            ${(this.maxDonutSize * 2 + this.padding / 3) - ((this.maxDonutSize * 2)  * this.createLinePlot(line, this.buildSeries(topic)).proportion)} 
            ${(this.svgWidth - this.yMargin) * ((j+1) / this.maxColumns) + this.columnSize / 2},
            ${(this.maxDonutSize * 2 + this.padding / 3) - ((this.maxDonutSize * 2)  * this.createLinePlot(this.buildSeries(topic)[j+1], this.buildSeries(topic)).proportion)}
          `;
        },
        createPathBetween(i, j, donut1, donut2){
          return `M 
            ${this.calcXPosition(j) + this.calcHalfDonutSize()},${this.calcYPosition(i + 1) - this.calcDonutRadius(donut1)} 
            ${this.calcXPosition(j+1) + this.calcHalfDonutSize()},${this.calcYPosition(i + 1) - this.calcDonutRadius(donut2)} 
            ${this.calcXPosition(j+1) + this.calcHalfDonutSize()},${this.calcYPosition(i + 1) + this.calcDonutRadius(donut2)} 
            ${this.calcXPosition(j) + this.calcHalfDonutSize()},${this.calcYPosition(i + 1) + this.calcDonutRadius(donut1)}
            Z`;
        },
        createPlotLinePosition(j, line, topic){
          return {
            x: (this.svgWidth - this.yMargin) * (j / this.maxColumns) + this.columnSize / 2,
            y: (this.maxDonutSize * 2 + this.padding / 3) - ((this.maxDonutSize * 2)  * this.createLinePlot(line, this.buildSeries(topic)).proportion)
          };
        },
        selectAllLines(){
          if(this.visibleLines.length === this.dataset.length){
            this.visibleLines = [];
          }else{
            for(let i = 0; i < this.datasetCopy.length; i += 1){
              this.visibleLines.push(i);
              this.visibleLines = [...new Set(this.visibleLines)]
            }
          }
        },
        // EVENTS
        hoverBetweenDonuts(topicIndex, periodIndex, donut1, donut2){
            // when hovering on the evolution path between 2 donuts, show a tooltip with evolution data pertaining to the related topic
            if(!this.showTooltipEvolutionBetween){
                return;
            }
            let html = "";
            const monthPrevious = this.xLabels[periodIndex];
            const monthNext = this.xLabels[periodIndex + 1];
            html += `<b>${donut1.name}</b>`
            html += `<b>${monthNext} / ${monthPrevious}</b>`;

            const isMultipleTonalities = donut1.series.filter((_serie,i) => !this.segregated.includes(i)).length > 1;

            // show cumulated evolution for multiple tonalities only
            if(isMultipleTonalities){
                html += `<b>${this.calcEvolPercent(donut2.base, donut1.base) > 0 ? '+' : ''}`;
                html += `${this.calcEvolPercent(donut2.base, donut1.base).toFixed(1)}%</b>`;
            }

            html += "<hr style='margin: 6px 0;'/>";

            const visibleSeries = (donut) => {
                return donut.series
                    .map(({color, name, value}) => {
                        return {color, name, value}
                    })
                    .filter((_s,i) => !this.segregated.includes(i));
            }
            const donut1Serie = visibleSeries(donut1);
            const donut2Serie = visibleSeries(donut2);

            donut1Serie.forEach((serie,i) => {
                html += `
                <div style="display: flex; flex-direction: row; gap: 6px;">
                    <span style="color:${serie.color}">⬤</span>
                    <span>${this.tonalities.filter((_t,k) => !this.segregated.includes(k))[i].name} : </span>
                    <span>
                    ${this.calcEvolPercent(donut2Serie[i].value, serie.value) > 0 ? '+' : '-'}
                    ${isNaN(this.calcEvolPercent(donut2Serie[i].value, serie.value)) ? '' : (Math.abs(this.calcEvolPercent(donut2Serie[i].value, serie.value))).toFixed(1)}%
                    </span>
                </div>
                `;
            })
            // set i & j indices to highlight the path between donut 1 & donut 2
            this.hoverPeriodIndexBetween = {
                i: topicIndex,
                j: periodIndex
            };
            this.tooltipContent = html;
            this.isTooltip = true;
        },
        hoverDonut({periodIndex}){
            // when hovering on a donut, show a tooltip with all topics data pertaining to the related period
            const selectedPeriodData = this.datasetCopy.flatMap((datapoint) => {
                return {
                    name: datapoint.name,
                    value: datapoint.series
                        .map((serie) => {
                            return serie.values[periodIndex] || 0
                        })
                        .reduce((a,b) => a + b, 0)
                }
            });
            
            const selectedPeriodCountTonalities = this.datasetCopy.map((datapoint) => {
                return datapoint.series.map((serie) => serie.values[periodIndex]);
            });

            const sumCountTonalities = this.sumArray(selectedPeriodCountTonalities).map((sum) => {
                return sum;
            }).filter((_sum,i) => {
                return !this.segregated.includes(i)
            });

            const sumOfAllAtPeriod = selectedPeriodData.map((periodData) => {
                return periodData.value;
            }).reduce((a,b) => a + b, 0);

            let html = "";
            let markers = "";
            let acc = 0;
  
            for(let i = 0; i < this.nonSegregatedTonalities.length; i += 1){
                const proportion = this.calcProportionPercent(sumCountTonalities[i], sumOfAllAtPeriod);
                markers += `
                    <rect x="${acc}" y="0" width="${proportion}" height="10" fill="${this.nonSegregatedTonalities[i].color}" stroke="white" stroke-width="1"></rect>
                `;
                acc += isNaN(proportion) ? 0 : proportion;
            }

            html += `
                <div style="grid-column: 1/span${this.tooltipGrid}; width: 100%;">
                    <b>${this.xLabels[periodIndex]}</b>
                    <svg width="90px" viewBox="0 0 100 10" style="border-radius: 6px; margin-left: 6px;">${markers}</svg>
                    <br>
                    <b>Total: ${sumOfAllAtPeriod.toFixed(0).toLocaleString()}</b>
                </div>
                <div style="grid-column: 1/span${this.tooltipGrid}; width: 100%;">
                  <hr style="margin: 6px 0;"/>
                </div>
                
            `;
            selectedPeriodData.forEach(serie => {
                const proportion = this.calcProportionPercent(serie.value, sumOfAllAtPeriod);
                html += `
                    <div>
                        <span>${serie.name} : </span>
                        <b>${serie.value ? serie.value.toFixed(0).toLocaleString() : 0}</b>
                        <span>(${isNaN(proportion) ? '-' : proportion.toFixed(1)}%)</span>
                    </div>
                `
            });
            this.tooltipContent = html;
            this.hoverPeriodIndex = periodIndex;
            this.isTooltip = true;
        },
        selectLegend(index) {
            // Select / unselect legend items to recalculate the chart
            if(!this.useSegregation) return;
            this.selectedDonut = {};
            this.selectedPeriodIndex = undefined;

            if(this.segregated.includes(index)){
                this.segregated = this.segregated.filter((el) => el !== index);
            }else{
                this.segregated.push(index);
            }

            if(this.segregated.length === this.tonalities.length){
                this.segregated = [];
            }
            
            const visibleTonalities = this.tonalities.filter((_tonality,i) => {
              return !this.segregated.includes(i);
            });
            this.$emit("selectLegend", visibleTonalities);
        },
        selectDonut({ donut, x, y, id, serieIndex = null, periodIndex = null }) {
            // Select / unselect a donut:
            // 1. trigger an $emit to parent
            // 2. activate zoom state
            this.selectedSerieIndex = serieIndex;
            this.selectedPeriodIndex = periodIndex;
            if(donut && donut.base > 0){
                this.$emit("selectDonut", {donut, periodIndex});
            }else{
                // emit false values to help detect deselection
                this.$emit("selectDonut", {donut: false, periodIndex: false});
            }
            if(this.selectedDonut.hasOwnProperty("x") && id === this.selectedDonut.donutId) {
                this.selectedDonut = {};
            } else {
            if(donut.base > 0){
                this.selectedDonut = { ...donut, x, y, donutId: id };
            }
            }
        },
      // CONDITIONAL STYLING
        normalizeFontSize(containerSize){
            switch (true) {
                case containerSize > 900:
                    this.maxFontSize = 13;
                    break;

                case containerSize < 700:
                    this.maxFontSize = 18;
                    break;
        
                default:
                    this.maxFontSize = 15;
                    break;
            }
        },
      // GETTERS
        calcDonutRadius(donut){
            return donut.base / this.maxSerie * (this.maxDonutSize - this.gap * 2);
        },
        calcHalfDonutSize(){
            return this.columnSize / 2;
        },
        calcLineCoordinatesX(){
            return {
                x1: this.yMargin + this.columnSize / 2,
                x2: this.svgWidth - (this.columnSize / 2)
            }
        },
        calcYPosition(yIndex){
            return yIndex * ((this.svgHeight - this.legendMargin) / this.dataset.length) - this.padding * 2;
        },
        calcXPosition(xIndex){
            return this.yMargin + xIndex * this.columnSize;
        },
        calcXPositionDonut(xIndex){
            return this.calcXPosition(xIndex) + this.columnSize/2;
        },
        getSum(serie) {
            return serie.map((el) => el.value).reduce((a, b) => a + b, 0);
        },
        // DONUT GENERATION METHODS
        buildSeries(dataset) {
            const arr = [];
            for (let i = 0; i < this.maxColumns; i += 1) {
                arr.push({
                    ...dataset,
                    donutId: `${dataset.id}_${i}`,
                    base: dataset.series
                    .map((serie) => {
                        return serie.values[i] ? serie.values[i] : 0;
                    })
                    .reduce((a, b) => a + b, 0),
                    series: dataset.series.map((serie) => {
                    return {
                        ...serie,
                        value: serie.values[i] ? serie.values[i] : 0,
                    };
                    }),
                });
            }
            return arr;
        },
        addVector([a1, a2], [b1, b2]) {
            return [a1 + b1, a2 + b2];
        },
        createArc([cx, cy], [rx, ry], [position, ratio], phi) {
            ratio = ratio % (2 * Math.PI);
            const rotMatrix = this.rotateMatrix(phi);
            const [sX, sY] = this.addVector(
            this.matrixTimes(rotMatrix, [
                rx * Math.cos(position),
                ry * Math.sin(position),
            ]),
            [cx, cy]
            );
            const [eX, eY] = this.addVector(
            this.matrixTimes(rotMatrix, [
                rx * Math.cos(position + ratio),
                ry * Math.sin(position + ratio),
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
        makeDonut(item, cx, cy, rx, ry) {
            let { series } = item;
            if (!series || item.base === 0)
                return {
                    ...series,
                    proportion: 0,
                    ratio: 0,
                    path: "",
                    startX: 0,
                    startY: 0,
                    endX: 0,
                    center: {},
                };
                const sum = [...series]
                .map((serie) => serie.value)
                .reduce((a, b) => a + b, 0);
                const ratios = [];
                let acc = 0;
                for (let i = 0; i < series.length; i += 1) {
                let proportion = series[i].value / sum;
                const ratio = proportion * (Math.PI * 1.9999); // (Math.PI * 2) fails to display a donut with only one value > 0 as it goes full circle again
                // midProportion & midRatio are used to find the midpoint of the arc to display markers
                const midProportion = series[i].value / 2 / sum;
                const midRatio = midProportion * (Math.PI * 2);
                const { startX, startY, endX, endY, path } = this.createArc(
                    [cx, cy],
                    [rx, ry],
                    [acc, ratio],
                    110
                );
                ratios.push({
                    ...series[i],
                    proportion,
                    ratio: ratio,
                    path,
                    startX,
                    startY,
                    endX,
                    endY,
                    center: this.createArc(
                    [cx, cy],
                    [rx * 1.45, ry * 1.45],
                    [acc, midRatio],
                    110
                    ), // center of the arc, to display the marker. rx & ry are larger to be displayed with a slight offset
                });
                acc += ratio;
                }
            return ratios;
        },
        matrixTimes([[a, b], [c, d]], [x, y]) {
            return [a * x + b * y, c * x + d * y];
        },
        rotateMatrix(x) {
            return [
            [Math.cos(x), -Math.sin(x)],
            [Math.sin(x), Math.cos(x)],
            ];
        },
    },
    watch: {
        containerWidth: {
            handler(val){
                this.normalizeFontSize(val);
            }
        }
    },
    mounted(){
        this.normalizeFontSize(this.containerWidth);
        const size = (this.dataset.length * 80) + this.legendMargin + (this.dataset.length * this.gap * 2);
        this.svgHeight = size + this.padding;

        const deTooltip = this.$refs.deTooltip;
        // observe tooltip size to determine its critical placement when overflowing right &| bottom
        const widthObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                this.tooltipHeight = entry.contentRect.height;
                this.tooltipWidth = entry.contentRect.width;
            });
        });
        widthObserver.observe(deTooltip);
    },
    created(){
        window.addEventListener("pointermove", (e) => {
            this.mousePosition.clientX = e.clientX;
            this.mousePosition.clientY = e.clientY;
        });
        window.addEventListener("resize", () => {
            this.windowHeight = window.innerHeight;
            this.windowWidth = window.innerWidth;
        })
    },
    destroyed(){
        window.removeEventListener("pointermove", (e) => {
            this.mousePosition.clientX = e.clientX;
            this.mousePosition.clientY = e.clientY;
        });
        window.removeEventListener("resize", () => {
            this.windowHeight = window.innerHeight;
        })
    }
}
</script>

<style lang="scss" scoped>
  * {
    transition: all 0.2s ease-in-out;
  }
  svg {
    background: white;
    overflow: visible;
    padding: 24px 0;
    user-select: none;
  }
  path {
    fill: none;
  }
  line.gridline {
    stroke: #ddd;
    stroke-width: 1;
  }
  line.donut-connector {
    stroke: #252525;
    stroke-width: 0.3;
  }
  line.donut-connector--dashed {
    stroke-dasharray: 4;
    stroke-width: 1;
    stroke: #464646;
  }
  rect.x-segment--white {
    fill: white;
  }
  rect.x-segment--grey {
    fill: #fafafa;
  }
  rect.period-selected {
    fill: #e7e7e7;
  }
  circle.plot {
    fill: #252525;
  }
  .donut-gradient {
    background: radial-gradient(
      rgba(255, 255, 255, 0.4),
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      rgba(255, 255, 255, 0.6),
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.8),
      transparent
    );
  }
  .donut-overlay {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  .pointer {
    cursor: pointer;
  }
  .horizontal {
    stroke-width: 0.5px;
    stroke: #ddd;
  }
  .x-label {
    color: black;
    font-size: 0.7rem;
    text-align:center;
  }
  .y-label {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: start;
    line-height: 18px;
    text-align: left;
    width: 100%;
  }
  .tonality-legend {
    align-items: center;
    color: black;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    text-align: center;
    width: 100%;
    &__item {
      align-items: center;
      cursor: pointer;
      display: flex;
      gap: 3px;
      justify-content: center;
    }
  }
  .legend-marker {
    border-radius: 50%;
    display: block;
    height: 12px;
    width: 12px;
  }
  .donut-evolution{
    &__controls {
        align-items:start;
        display: flex;
        flex-direction: column;
        gap: 6px;
        user-select: none;
        label, input{
            cursor: pointer;
        }
        label{
          margin-left: 6px;
        }
        input[type=checkbox] {
            -webkit-appearance: none;
            -moz-appearance: none;
            -ms-appearance: none;
        }
        input[type=checkbox] {
            background: #fff;
            border-radius: 2px;
            border: 1px solid #ccc;
            height: 15px;
            width: 15px;
        }
        input[type="checkbox"]:checked {
            background: #6376DD;
            border: 1px solid #6376DD;
            margin:0px;
            position: relative;
          &:before {
              color: white;
              content: '\f00c';
              display: block;
              font-family: FontAwesome;
              font-size: 13px;
              position: absolute;
          }
        }
    }
    &__tooltip{
        background: white;
        border-radius: 8px;
        box-shadow: 0 6px 12px -6px rgba(0,0,0,0.2);
        font-size: 14px;
        padding: 12px 24px;
        transition: unset !important;
        min-width: 200px;
        column-gap: 12px;
    }
  }
  path.mini-donut {
    transition: initial;
  }
  svg.line-chart{
    // padding: 0px;
    background: transparent;
    overflow: visible;
    animation: showLine 0.3s ease-in-out forwards;
    opacity: 0;
    transform: scale(0.9,1);
  }
  @keyframes showLine {
    to {
      opacity:1;
      transform: scale(1,1);
    }
  }
  </style>