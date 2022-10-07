<template>
    <div :style="`width: 100%;`">
        <div v-if="showControls" class="donut-evolution__controls">
            <input id="donutEvolutionCheckbox" type="checkbox" v-model="showTooltip" name="donutEvolutionCheckbox" :checked="showTooltip">
            <!-- TODO: translation -->
            <label for="donutEvolutionCheckbox">Afficher les données au survol</label> 
        </div>
    
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

        <svg 
            width="100%" 
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`" 
            :style="`font-family:${fontFamily}; max-width:${maxWidth}px`">
            
            <!-- TITLE, GRID, XAXIS LABEL, TONALITY LEGEND -->
            <g>
                <g 
                v-for="(gridline,i) in maxDonuts" 
                :key="`gridline_${i}`"
                >
                <!-- Vertical grid lines -->
                <line 
                    :x1="calcXPosition(i)" 
                    :x2="calcXPosition(i)" 
                    :y1="-12" 
                    :y2="svgHeight - padding - legendMargin" class="gridline"
                />
                <!-- Vertical rect grid -->
                <rect
                    :class="{'x-segment--grey': i % 2 === 0, 'x-segment--white' : i % 2 !== 0, 'period-selected': i === hoverPeriodIndex && showTooltip}" 
                    :x="calcXPosition(i)" 
                    :y="-12" 
                    :height="svgHeight - legendMargin - 17" 
                    :width="columnSize"
                />

                <g v-if="title">
                  <text 
                      text-anchor="middle" 
                      fill="black" 
                      :x="svgWidth / 2" 
                      :y="-20" 
                      font-size="1em"
                      :style="selectedDonut.hasOwnProperty('x') ? 'opacity:0.3' : 'opacity: 1'"
                  >
                      {{ title }}
                  </text>
                </g>

                <!-- Period labels -->
                <foreignObject 
                    :x="calcXPosition(i)" 
                    :y="svgHeight - 24 - legendMargin" 
                    :width="columnSize" 
                    :height="30"
                >
                    <div class="x-label" :style="`font-weight:${selectedPeriodIndex === i ? '700' : '400'}`">
                    {{ xLabels[i] }}
                    </div>
                </foreignObject>
                </g>
        
                <!-- Tonality legend -->
                <g>
                <foreignObject :x="0" :y="svgHeight - legendMargin" :width="svgWidth" height="30">
                    <div class="tonality-legend">
                    <div 
                        class="tonality-legend__item" 
                        v-for="(tonality, i) in tonalities" 
                        :key="`tonality-legend_${i}`"
                        @click="selectLegend(i)"
                        :style="segregated.includes(i) ? 'opacity:0.2;' : 'opacity:1;'"
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
        
            <!-- DONUTS LAYOUT -->
            <g 
                v-for="(donutSerie,i) in datasetCopy" 
                :key="`donutSerie_${i}`"
            >
        
                <!-- Yaxis label -->
                <foreignObject style="overflow: visible;" :x="0" :y="calcYPosition(i + 1) - padding - (gap*2)" :height="maxDonutSize * 2 + padding / 2" :width="(svgWidth / (maxDonuts +2) *2) - padding / 3">
                <div class="y-label" :style="`font-size:${maxFontSize}px; font-weight:${selectedSerieIndex === i ? '700' : '400'};`">
                    {{ donutSerie.name }}
                </div>
                </foreignObject>
        
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
                <line 
                    :x1="selectedDonut.x" 
                    :x2="yMargin" 
                    :y1="selectedDonut.y" 
                    :y2="selectedDonut.y" 
                    class="donut-connector--dashed"
                />
                <line 
                    :x1="selectedDonut.x" 
                    :x2="selectedDonut.x" 
                    :y1="selectedDonut.y" 
                    :y2="svgHeight - padding - legendMargin" 
                    class="donut-connector--dashed"
                />
                <circle 
                    :cx="yMargin" 
                    :cy="selectedDonut.y" 
                    r="2" 
                    class="plot"
                />
                <circle 
                    :cx="selectedDonut.x" 
                    :cy="svgHeight - padding - legendMargin" 
                    r="2" 
                    class="plot"
                />
                </g>
                
                <!-- Donuts, markers, hollows, sum labels -->
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
        
                <!-- Donut hollow -->
                <!-- <defs>
                    <radialGradient id="hollowGradient">
                        <stop offset="10%" :stop-color="segregated.length === tonalities.length - 1 ? nonSegregatedTonality.color : 'white'" />
                        <stop offset="95%" :stop-color="segregated.length === tonalities.length - 1 ? nonSegregatedTonality.color : 'white'" />
                    </radialGradient>
                </defs> -->

                <!-- Proportional path between donuts -->
                <path 
                  v-if="j < buildSeries(donutSerie).length -1 && showInnerEvolutionPath && !selectedDonut.hasOwnProperty('x')"
                  :d="`M 
                    ${calcXPosition(j) + calcHalfDonutSize()},${calcYPosition(i+1) - calcDonutRadius(donut)} 
                    ${calcXPosition(j+1) + calcHalfDonutSize()},${calcYPosition(i+1) - calcDonutRadius(buildSeries(donutSerie)[j+1])} 
                    ${calcXPosition(j+1) + calcHalfDonutSize()},${calcYPosition(i+1) + calcDonutRadius(buildSeries(donutSerie)[j+1])} 
                    ${calcXPosition(j) + calcHalfDonutSize()},${calcYPosition(i+1) + calcDonutRadius(donut)}
                    Z`"
                  :style="`fill: ${i === hoverPeriodIndexBetween.i && j === hoverPeriodIndexBetween.j ? 'rgba(0,0,0,0.15);' : 'rgba(0,0,0,0.08);'}`"
                  :stroke="`${i === hoverPeriodIndexBetween.i && j === hoverPeriodIndexBetween.j ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0)'}`"
                  :stroke-width="`${i === hoverPeriodIndexBetween.i && j === hoverPeriodIndexBetween.j ? '1' : '0'}`"
                  @pointerover="hoverBetweenDonuts(i, j, donut, buildSeries(donutSerie)[j+1])"
                  @pointerout="isTooltip = false; hoverPeriodIndexBetween = {i:undefined, j: undefined}"
                />

                <g class="pointer" @click="selectDonut({donut, serieIndex: i, x:calcXPosition(j) + calcHalfDonutSize(), y:calcYPosition(i + 1), id:donut.donutId, periodIndex:j})"
                @pointerover="hoverDonut({periodIndex:j})"
                @pointerout="isTooltip = false; hoverPeriodIndex = undefined">
                  <!-- IF FULL CIRCLE, add :fill="segregated.length === tonalities.length - 1 ? 'url(#hollowGradient)' : 'white'"  -->
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
                <!-- IF FULL CIRCLE WHEN SEGREGATE = 1 add :style="segregated.length === tonalities.length - 1 ? 'opacity:0;' : 'opacity:1;'" -->
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
        
            <!-- DONUT SELECTED STATE -->
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
                @click="selectDonut({selectedDonut, x:selectedDonut.x, y:selectedDonut.y, id:selectedDonut.donutId})"
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
                    
                <!-- MARKERS DONUT SELECTED STATE -->
            <template 
                v-if="selectedDonut.hasOwnProperty('x')"
            >
                <foreignObject
                @click="selectDonut({selectedDonut, x:selectedDonut.x, y:selectedDonut.y, id:selectedDonut.donutId})"
                id="markers"
                v-for="(arc, k) in makeDonut(
                    selectedDonut,
                    selectedDonut.x - 18,
                    selectedDonut.y - 18,
                    50,
                    50
                )"
                :key="`arc_select_${k}`"
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
        type: Number,
        default: undefined,
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
                  values: [32, 12, 25, 32, 47, 52, 61, 17, 9, 18, 45, 115, 15],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [18, 12, 20, 4, 16, 26, 32, 7, 8, 9, 16, 11, 54],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [25, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 12],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [6, 10, 20, 30, 40, 50, 60, 70, 80, 90, 10, 11, 12],
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
                  values: [3, 25, 12, 47, 32, 61, 52, 29, 19, 28, 25, 15, 15],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [40, 1, 20, 4, 16, 26, 3, 71, 8, 92, 16, 11, 54],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [25, 10, 20, 30, 40, 50, 60, 70, 80, 9, 10, 11, 12],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [68, 65, 20, 3, 4, 50, 60, 70, 80, 90, 10, 11, 12],
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
                  values: [32, 12, 39, 32, 47, 52, 61, 17, 9, 1, 45, 54, 15],
                  color: "#15B300",
                },
                {
                  name: "Neutral",
                  values: [18, 12, 76, 4, 16, 26, 32, 7, 8, 9, 16, 11, 54],
                  color: "#ccc",
                },
                {
                  name: "Negative",
                  values: [25, 10, 20, 30, 25, 50, 60, 70, 80, 43, 65, 110, 12],
                  color: "#F17171",
                },
                {
                  name: "Mixed",
                  values: [6, 10, 20, 30, 40, 50, 60, 70, 8, 90, 10, 11, 12],
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
        type: Boolean,
        default: false,
      },
      height: {
        type: Number,
        default: 400,
      },
      minPercentToDisplayMarker: {
        type: Number,
        default: 5,
      },
      maxWidth: {
        type: Number,
        default: 1200,
      },
      overlay: {
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
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: "",
      },
      useSegregation: {
        type: Boolean,
        default: true,
      },
      width: {
        type: Number,
        default: 800,
      },
      xLabels: {
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
        hoverPeriodIndex: undefined,
        hoverPeriodIndexBetween: {
          i: undefined,
          j: undefined,
        },
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
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      };
    },
    computed: {
        nonSegregatedTonalities(){
            return this.tonalities.filter((t,i) => {
                return !this.segregated.includes(i)
            });
        },
        nonSegregatedTonality(){
            return this.tonalities.find((t,i) => {
                return !this.segregated.includes(i)
            })
        },
        datasetCopy(){
            return this.dataset.map((datapoint) => {
                return {
                    ...datapoint,
                    series: datapoint.series.map((serie, i) => {
                        if(this.segregated.includes(i)){
                            return {
                                ...serie,
                                values: serie.values.map((el) => null)
                            }
                        }
                        return {...serie};
                    })
                }
            });
        },
        columnSize(){
            return (this.svgWidth - this.yMargin) / this.maxDonuts;
        },
        tonalities() {
            const allItems = this.dataset.flatMap((item) => {
            return item.series.map(({name, color}) => {
                return {
                name,
                color,
                };
            });
            });
            return [...new Map(allItems.map(obj => [JSON.stringify(obj), obj])).values()];
        },
        maxSerie() {
            const arr = [...this.datasetCopy]
            .map((dataset) => {
                return this.buildSeries(dataset);
            })
            .map((dataset) => {
                return dataset.flatMap((el) => el.base);
            });
            return Math.max(...arr.flat());
        },
        maxDonuts() {
            const arr = [];
            this.datasetCopy.forEach((item) => {
            item.series.forEach((serie) => {
                arr.push(serie.values.length);
            });
            });
            return Math.max(...arr);
        },
        maxDonutSize() {
            let size = (100 * (this.svgHeight / this.svgWidth) / this.dataset.length) + ((this.dataset.length - 2) * this.gap) + (this.legendMargin / this.dataset.length);
            size = size > this.columnSize / 2 ? this.columnSize / 2 : size;
            return size > 30 ? 30 : size;

        },
        seriesBases() {
            const arr = [];
            this.datasetCopy.forEach((el) => {
            let arr2 = [];
            for (let i = 0; i < this.maxDonuts; i += 1) {
                arr2.push(
                el.series
                    .map((serie) => {
                    return serie.values[i] ? serie.values[i] : 0;
                    })
                    .reduce((a, b) => a + b, 0)
                );
            }
            arr.push(arr2);
            });
            return arr;
        },
        tooltipGrid(){
            if(this.datasetCopy.length <= 10) return 1;
            return Math.round(this.datasetCopy.length / 10) > 3 ? 3 : Math.round(this.datasetCopy.length / 10);
        },
        tooltipSmartPlacement(){
            const tooltipOverflowsBottom = this.mousePosition.clientY + this.tooltipHeight + this.tooltipPadding * 2 > this.windowHeight;
            const tooltipOverflowsRight = this.mousePosition.clientX + this.tooltipWidth > this.windowWidth;
            let x,y;

            if(tooltipOverflowsBottom){
                y = - this.tooltipHeight - this.tooltipPadding * 2;
            }else{
                y = this.tooltipPadding;
            }

            if(tooltipOverflowsRight){
                x = - this.tooltipWidth;
            }else{
                x = - this.tooltipWidth / 2 - this.tooltipPadding;
            }

            return { x, y };
        },
    },
    methods: {
        hoverBetweenDonuts(topicIndex, periodIndex, donut1, donut2){
          let html = "";
          const monthPrevious = this.xLabels[periodIndex];
          const monthNext = this.xLabels[periodIndex + 1];

          html += `<b>${monthNext} / ${monthPrevious}</b>`;
          html += "<hr/>";

          if(donut1.series.filter((serie,i) => !this.segregated.includes(i)).length > 1){
            html += `<b>${(((donut2.base / donut1.base) - 1) * 100) > 0 ? '+' : ''}`;
            html += `${(((donut2.base / donut1.base) - 1) * 100).toFixed(1)}%</b>`;
          }

          const donut1Serie = donut1.series.map(({color, name, value}) => {
            return {color, name, value}
          }).filter((_serie, i) => !this.segregated.includes(i));

          const donut2Serie = donut2.series.map(({color, name, value}) => {
            return {color, name, value}
          }).filter((_serie, i) => !this.segregated.includes(i));
          
          donut1Serie.forEach((serie,i) => {
            html += `
              <div style="display: flex; flex-direction: row; gap: 6px;">
                <span style="color:${serie.color}">⬤</span>
                <span>${this.tonalities[i].name}</span>
                <span>
                ${(((donut2Serie[i].value / serie.value)-1)*100) > 0 ? '+' : '-'}
                ${(Math.abs(((donut2Serie[i].value / serie.value)-1))*100).toFixed(1)}%
                </span>
              </div>
            `;
          })

          console.log(donut1Serie, donut2Serie);
          this.hoverPeriodIndexBetween = {
            i: topicIndex,
            j: periodIndex
          };
          this.tooltipContent = html;
          this.isTooltip = true;
        },
      // EVENTS
        hoverDonut({periodIndex}){
            // TOOLTIP CONTENT TBD, this is a first proposal
            const selectedPeriodData = this.datasetCopy.flatMap((item) => {
                return {
                    name: item.name,
                    value: item.series.map((serie) => {
                        return serie.values[periodIndex] || 0
                }).reduce((a,b) => a+b,0)
                }
            });
            
            const selectedPeriodCountTonalities = this.datasetCopy.map((item) => {
                return item.series.map((el) => el.values[periodIndex]);
            });

            const sumArray = (array) => {
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
            }

            const sumCountTonalities = sumArray(selectedPeriodCountTonalities).map((sum) => {
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
                markers += `
                    <rect x="${acc}" y="0" width="${sumCountTonalities[i] / sumOfAllAtPeriod * 100}" height="10" fill="${this.nonSegregatedTonalities[i].color}" stroke="white" stroke-width="1"></rect>
                `;
                acc += isNaN(sumCountTonalities[i] / sumOfAllAtPeriod * 100) ? 0 : sumCountTonalities[i] / sumOfAllAtPeriod * 100;
            }

            html += `
                <div style="grid-column: 1/span${this.tooltipGrid}; width: 100%;">
                    <b>${this.xLabels[periodIndex]}</b>
                    <svg width="90px" viewBox="0 0 100 10" style="border-radius: 6px; margin-left: 6px;">${markers}</svg>
                    <hr style="margin: 6px 0;"/>
                </div>
            `;
            selectedPeriodData.forEach(serie => {
                html += `
                    <div>
                        <span>${serie.name} : </span>
                        <b>${serie.value ? serie.value.toFixed(0).toLocaleString() : 0}</b>
                        <span>(${isNaN(serie.value / sumOfAllAtPeriod * 100) ? '-' : (serie.value / sumOfAllAtPeriod * 100).toFixed(1)}%)</span>
                    </div>
                `
            });
            this.tooltipContent = html;
            this.hoverPeriodIndex = periodIndex;
            this.isTooltip = true;
        },

        selectLegend(index) {
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
            this.selectedSerieIndex = serieIndex;
            this.selectedPeriodIndex = periodIndex;
            if(donut && donut.base > 0){
              this.$emit("selectDonut", {donut, periodIndex});
            }else{
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
            return this.yMargin + xIndex * this.columnSize + this.columnSize/2;
        },
        getSum(serie) {
            return serie.map((el) => el.value).reduce((a, b) => a + b, 0);
        },
        // DONUT GENERATION METHODS
        buildSeries(dataset) {
            const arr = [];
            for (let i = 0; i < this.maxDonuts; i += 1) {
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
    padding: 48px;
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
        align-items:center;
        display: flex;
        gap: 6px;
        user-select: none;
        label, input{
            cursor: pointer;
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
  </style>