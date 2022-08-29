<template>
  <svg 
    class="rootbar" 
    width="100%" 
    :style="`max-width:${maxWidth}px; font-family:${fontFamily};`" 
    :viewBox="`0 0 ${width} ${height}`"
>
    <!-- CONNECTING PATHS BETWEEN CIRCLES & BARS -->
    <g class="rootbar__connexions">
        <g v-for="(path,i) in bars" 
            :key="`path_${i}`" 
            :style="styleBarOpacity(path, i, 0.05)"
        >
            <path v-for="(el,k) in Math.round(barWidth)" 
            :key="`el_${k}`"
            :d="`M
                ${path.x1},${path.y1 - barWidth / 2 + k}
                C${path.x1 - width / 20},${path.y1 - barWidth / 2 + k} 
                ${path.x1 - width / 10},${path.y1 - barWidth / 2 + k} 
                ${width / 6}, ${getParent(path).optY}
            `"
            :stroke="k === 0 || k === Math.round(barWidth) ? 'white' : path.color"
            :stroke-width="2"
            fill="none"
            :shape-rendering="k === 0 || k === Math.round(barWidth) - 1 ? 'auto' : 'crispEdges'"
            :opacity="0.15"
            />
             <!-- DONUT (SELECTED STATE) LEGEND -->
            <foreignObject v-if="showTonality && path.hasOwnProperty('series') && path.series.length && selectedBarIndex !== undefined"
                class="bar-label" 
                @click="selectBar(path, i)"  
                :x="path.x2 + 150" 
                :y="path.y1 + 80" 
                :height="64"
                :width="width / 3"
            >
                <div class="rootbar__donut__legend" 
                    :style="`opacity:${path.id === selectedBar.id ? 1 : 0}`"
                >
                    <div v-for="(tonality,k) in path.series" 
                        :key="`tonality_legend_${k}`" 
                        :style="`display:flex; flex-direction: column;`"
                        class="rootbar__donut__legend__item"
                    >
                        <strong 
                            :style="`color:${tonality.color}; font-size: 1.2em;`"
                        >
                            {{ tonality.value.toLocaleString() }}
                        </strong>
                        <span style="max-width:100px; line-height:18px;">
                            {{ tonality.name }}
                        </span>
                    </div>
                </div>
            </foreignObject>
            <!-- BAR LABEL & DONUT (if showTonality is set to true) -->
            <foreignObject 
                class="bar-label" 
                @click="selectBar(path, i)"  
                :x="path.x2 + 10" 
                :y="path.y1 - (height / (bars.length) / 2)" 
                :height="height / (bars.length)"
                :width="width / 3"
            >
                <div style="width: fit-content; display: flex; flex-direction: row; align-items:center;
                jsutify-content:start">
                    <!-- BAR LABEL -->
                    <div :style="styleBarLabelEllipsis(i, 200)">
                        <template v-if="selectedParent.hasOwnProperty('data')">
                            <span 
                                :style="`color:${getParent(path).color}; margin-right: 3px;`"
                            >
                                <b>{{ (path.data / getParent(path).data * 100).toFixed(1) }}%</b>
                            </span>
                            ( {{ path.data }} )&nbsp;{{ path.name }} 
                        </template>
                        <template v-else>
                            <span 
                                style="margin-right:3px;"
                            >
                                <b>{{ (path.data / totalOccurences * 100).toFixed(1) }}%</b>
                                   ( {{ path.data }} )&nbsp;{{ path.name }} 
                            </span>
                         
                        </template>
                    </div>
                    <!-- DONUT & MARKERS -->
                    <svg 
                        v-if="showTonality && path.hasOwnProperty('series')"
                        :style="`
                            background: transparent; 
                            padding:0 !important; 
                            margin-left:${isNormalSizeDonut(i) ? '24px' : '64px'};
                        `" 
                        :height="styleSvgSize(i)" 
                        :viewBox="`0 0 100 100`"
                    >
                        <!-- DONUT --> 
                        <path
                            style="fill:none" 
                            v-for="(arc, k) in makeDonut(path, 50, 50, 100, 100)" 
                            :key="`arc_${i}_${k}`" 
                            :d="arc.path" 
                            :stroke="arc.color" 
                            :stroke-width="selectedBarIndex !== undefined ? 50 : 80"
                        />
                        <!-- MARKERS -->
                        <template v-if="selectedBarIndex === i && showTonality ">
                            <foreignObject
                                v-for="(arc, k) in makeDonut(
                                path,
                                0,
                                0,
                                110,
                                110
                                )"
                                :key="`arc_select_${k}`"
                                :x="arc.center.endX"
                                :y="arc.center.endY"
                                height="100%"
                                width="100%"
                                style="overflow: visible"
                                :id="`marker_${k}`"
                            >
                                    <div
                                    :style="`
                                        align-items:center; 
                                        background:white; 
                                        border-radius: 50%; 
                                        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
                                        color: black; 
                                        height: 100px;
                                        width:100px;
                                        display: block; 
                                        display: flex; 
                                        font-size:2.5em; 
                                        font-weight: bold;  
                                        justify-content:center; 
                                        padding: 2px; 
                                        z-index:100;
                                    `"
                                    >
                                    <span style="line-height: 5px;">
                                        {{ (arc.proportion * 100).toFixed(0) }}%
                                        <br>
                                    </span>
                                </div>
                            </foreignObject>
                     </template>
                    </svg>
                </div>
            </foreignObject>
        </g>
    </g>

    <!-- PARENT CIRCLES -->
    <text :x="width / 6" y="-24" text-anchor="middle" font-size="20" font-weight="bold" fill="grey">
        base: {{ totalOccurences.toLocaleString() }}
    </text>
    <g v-for="(circle,i) in circles"  
        :key="`parent_${i}`" 
        :style="styleParentOpacity(circle)" 
        @click="selectParent(circle)"
        class="rootbar__parent"
    >
        <circle 
            :cx="width/6 " :cy="circle.optY"
            :r="getCircleRadius(circle)"
            :fill="circle.color"
        />
        <!-- CENTER LABELS -->
        <!-- percentage -->
        <text 
            :x="width / 6" 
            :y="getParentLabelYPosition(circle, -5)" 
            :font-size="`${styleParentFontSize(circle, 25)}px`" 
            :fill="styleTextColor(circle.color)"
            text-anchor="middle"
            font-weight="bold"
        >
            {{ (circle.data / totalOccurences * 100).toFixed(1) }} %
      
        </text>
        <!-- base -->
        <text 
            :x="width / 6" 
            :y="getParentLabelYPosition(circle, 30)" 
            :font-size="`${styleParentFontSize(circle, 20)}px`" 
            :fill="styleTextColor(circle.color)"
            text-anchor="middle"
        >
            {{ circle.data }}
      
        </text>
        <!-- PARENT'S NAME -->
        <foreignObject 
            style="overflow: visible;"
            :x="-50" 
            :y="getParentLabelYPosition(circle, - height / circles.length / 2)" 
            :height="getCircleRadius(circle) * 2" 
            width="200px"
        >
            <div 
                class="rootbar__parent__label" 
                :style="`border-left: 5px solid ${circle.color};background: linear-gradient(to right, ${circle.color}1f, transparent); position: relative;`"
            >
                {{ circle.name }}
            <!-- Parent tonality bars -->
            <svg v-if="showTonality" :viewBox="`0 0 100 10`" class="sentiment">
                <defs>
                    <clipPath id="round-corner">
                        <rect x="0" y="5" width="100%" height="10" rx="5" ry="5"/>
                    </clipPath>
                </defs>
                <g v-for="(tonality, k) in circle.tonalities"
                    :key="`tonality_selected_${k}`">
                    <!-- <line
                        :stroke-width="10"
                        :stroke="getTonality(circle.tonalities, k).color"
                        :x1="getTonality(circle.tonalities, k).x1"
                        y1="5"
                        :x2="(getTonality(circle.tonalities, k).acc)"
                        y2="5"
                    /> -->
                    <rect 
                        :fill="getTonality(circle.tonalities, k).color" 
                        :x="getTonality(circle.tonalities, k).x1" 
                        :y="5" :width="getTonality(circle.tonalities, k).acc - getTonality(circle.tonalities, k).x1" 
                        height="10"
                        :clip-path="k === 0 || k === circle.tonalities.length - 1 ? 'url(#round-corner)': ''"
                    />
                </g>
            </svg>
            </div>

            
        </foreignObject>
    </g>

    <!-- BARS -->
    <g class="rootbar__bars">
        <line v-for="(bar,i) in bars" 
            :key="`bar_${i}`" 
            :x1="bar.x1" 
            :x2="bar.x2" 
            :y1="bar.y1" 
            :y2="bar.y2" 
            :stroke="bar.color" 
            :stroke-width="barWidth" 
            @click="selectBar(bar, i)"
            :style="styleBarOpacity(bar, i, 0.1)"
            class="bar"
        />
    </g>

    <!-- VERTICAL SEPARATOR BETWEEN CIRCLES & BARS -->
    <g>
        <line 
            :x1="width / ratioSeparation" 
            :x2="width / ratioSeparation" 
            :y1="0" 
            :y2="height" 
            stroke="white" 
            stroke-width="3" 
        />
    </g>
  </svg>
</template>

<script>
export default {
  name: "RootBar",
  props: {
    barFontSize: {
        type: String,
        default:"12px",
    },
    circleTextOffset: {
        type: Number,
        default: 5,
    },
    dataset: {
        type: Array,
        default(){
            /** Dataset must respect this format:
             * 
             * [
             *      {
             *          id: String,
             *          name: String,
             *          color: String (hex format)
             *          children: [
             *              id: String,
             *              name: String,
             *              data: Number,
             *              series: [
             *                  {
             *                      name: String,
             *                      value: Number,
             *                      color: String (hex format)
             *                  }
             *              ]
             *          ]
             *      }
             * ]
             * 
             * IMPORTANT: 
             *  >>> IDs for both parents and children are mandatory
             * 
             *  >>> the 'series' property of the children is optional, 
             *      and will determine donut rendering,
             *      if the array is not empty AND if the showTonality component 
             *      prop is set to true. If one children has no 'series' prop or
             *      if it is empty, there will be no error, and simply no
             *      donut rendering for this datapoint.
             * 
             *  >>> the total base will be calculated from the sum of all
             *      children data property
             * 
             */
            return [
                {
                    id: "01",
                    name: "Topic 1 with a very long label",
                    color: "#74cf77",
                    children: [
                        {
                            id: "01_01",
                            name: "Children label with a very long description that can display on multiple lines",
                            data: 150,
                            series: [
                                {
                                    name: "Good",
                                    value: 120,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 59,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 102,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "01_02",
                            name: "Topic 1 Item 2",
                            data: 80,
                            series: [
                                {
                                    name: "Good",
                                    value: 110150,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 59000,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 102000,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "01_03",
                            name: "Topic 1 Item 3",
                            data: 122,
                            series: [
                                {
                                    name: "Good",
                                    value: 37200,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 11595,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 2300,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "01_04",
                            name: "Topic 1 Item 4",
                            data: 165,
                            series: [
                                {
                                    name: "Good with a long label",
                                    value: 1125,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average with a long label",
                                    value: 256,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad with a long label",
                                    value: 1210,
                                    color: "#F17171"
                                },
                                {
                                    name: "Additional category with a long label",
                                    value: 1324,
                                    color: "#6376DD"
                                },
                                {
                                    name: "Another additional specific category",
                                    value: 999,
                                    color: "orange"
                                }
                            ]
                        },
                        {
                            id: "01_05",
                            name: "Topic 1 Item 5",
                            data: 25,
                            series: [
                                {
                                    name: "Good",
                                    value: 10,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 15,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 20,
                                    color: "#F17171"
                                }
                            ]
                        },
                    ]
                },
                {
                    id: "02",
                    name: "Topic 2",
                    color: "#6376DD",
                    children: [
                        {
                            id: "02_01",
                            name: "Topic 2 Item 1",
                            data: 120,
                            series: [
                                {
                                    name: "Good",
                                    value: 12,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 4,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 9,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "02_02",
                            name: "Topic 2 Item 2",
                            data: 90,
                            series: [
                                {
                                    name: "Good",
                                    value: 102,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 66,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 13,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "02_03",
                            name: "Topic 2 Item 3",
                            data: 102,
                            series: [
                                {
                                    name: "Good",
                                    value: 200,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 12,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 12,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "02_04",
                            name: "Topic 2 Item 4",
                            data: 10,
                            series: [
                                {
                                    name: "Good",
                                    value: 112,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 13,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 144,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "02_05",
                            name: "Topic 2 Item 5",
                            data: 16,
                            series: [
                                {
                                    name: "Good",
                                    value: 2,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 10,
                                    color: "#F17171"
                                }
                            ]
                        },
                    ]
                },
                {
                    id: "03",
                    name: "Topic 3",
                    color: "#f2bc27",
                    children: [
                        {
                            id: "03_01",
                            name: "Topic 3 Item 1",
                            data: 150,
                            series: [
                                {
                                    name: "Good",
                                    value: 2,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 0,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "03_02",
                            name: "Topic 3 Item 2",
                            data: 125,
                            series: [
                                {
                                    name: "Good",
                                    value: 36,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 12,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 15,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "03_03",
                            name: "Topic 3 Item 3",
                            data: 99,
                            series: [
                                {
                                    name: "Good",
                                    value: 9,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 4,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 2,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "03_04",
                            name: "Topic 3 Item 4",
                            data: 9,
                            series: [
                                {
                                    name: "Good",
                                    value: 4,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 2,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 7,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "03_05",
                            name: "Topic 3 Item 5",
                            data: 11,
                            series: [
                                {
                                    name: "Good",
                                    value: 5,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 2,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 7,
                                    color: "#F17171"
                                }
                            ]
                        },
                    ]
                },
                {
                    id: "04",
                    name: "Topic 4",
                    color: "#db621d",
                    children: [
                        {
                            id: "04_01",
                            name: "Topic 4 Item 1",
                            data: 34,
                            series: [
                                {
                                    name: "Good",
                                    value: 3,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 2,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 3,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "04_02",
                            name: "Topic 4 Item 2",
                            data: 125,
                            series: [
                                {
                                    name: "Good",
                                    value: 3,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 8,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "04_03",
                            name: "Topic 4 Item 3",
                            data: 99,
                            series: [
                                {
                                    name: "Good",
                                    value: 2,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 3,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 4,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "04_04",
                            name: "Topic 4 Item 4",
                            data: 22,
                            series: [
                                {
                                    name: "Good",
                                    value: 3,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 2,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 6,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "04_05",
                            name: "Topic 4 Item 5",
                            data: 29,
                            series: []
                        },
                    ]
                },
                {
                    id: "05",
                    name: "Topic 5",
                    color: "#732196",
                    children: [
                        {
                            id: "05_01",
                            name: "Topic 5 Item 1",
                            data: 24,
                            series: [
                                {
                                    name: "Good",
                                    value: 12,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 3,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 1,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "05_02",
                            name: "Topic 5 Item 2",
                            data: 12,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 11,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 1,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "05_03",
                            name: "Topic 5 Item 3",
                            data: 9,
                            series: [
                                {
                                    name: "Good",
                                    value: 3,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 3,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 15,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "05_04",
                            name: "Topic 5 Item 4",
                            data: 15,
                            series: [
                                {
                                    name: "Good",
                                    value: 4,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 3,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 6,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "05_05",
                            name: "Topic 5 Item 5",
                            data: 23,
                            series: [
                                {
                                    name: "Good",
                                    value: 9,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 2,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 7,
                                    color: "#F17171"
                                }
                            ]
                        }
                    ]
                },
            ]
        }
    },
    fontFamily: {
        type: String,
        default: "Product Sans"
    },
    height: {
        type: Number,
        default: 600,
    },
    maxWidth: {
        type: Number,
        default: 1500,
    },
    showTonality: {
        type: Boolean,
        default: false,
    },
    width: {
        type: Number,
        default: 1200,
    }
  },
  data() {
    return {
        gap: 3,
        ratioSeparation: 2.3,
        selectedBar: {},
        selectedBarIndex: undefined,
        selectedParent: {},
    };
  },
  computed: {
    barWidth(){
        return (this.height - this.children.length * this.gap) / this.children.length;
    },
    children(){
        return this.dataset.flatMap((category) => {
            return category.children.map((child) => {
                return {
                    ...child,
                    parentId: category.id,
                    parentName: category.name,
                    color: category.color,
                }
            })
        }).sort((a,b) => b.data - a.data)
    },
    bars(){
        return this.children.map((child,i) => {
            return {
                ...child,
                y1: i * this.barWidth + this.barWidth / 2 + this.gap * i,
                y2: i * this.barWidth + this.barWidth / 2 + this.gap * i,
                x1: this.width / this.ratioSeparation,
                x2: this.width / this.ratioSeparation + (child.data / this.maxBar) * this.width / (this.showTonality ? 4 : 3),
            }
        }).sort((a,b) => a.data - b.data)
    },
    circles(){
        const parents = [...this.dataset].map((parent) => {
            const {id, name, color, children} = parent;
            let data = parent.children.map((child) => {
                return child.data
            }).reduce((a, b) => a + b, 0);
            return {
                id, name, data, color, children
            }
        }).sort((a,b) => b.data - a.data);
        return parents.map((parent, i) => {
            const allY = this.bars.filter((bar) => bar.parentId === parent.id).map((child) => {
                    return child.y1;
                });
                const max = Math.max(...allY);
                const min = Math.min(...allY);
            const optY = (this.height / parents.length) * i + this.height/parents.length / 2;
            const y = min + (max - min) / 2;

            // EXPERIMENTAL DISPLAY OF MAIN TOPICS TONALITIES
            
            let tonalities = parent.children.flatMap((child) => {
                if(child.series.length > 0){
                    return child.series.map((serie) => {
                        return {
                            name: serie.name,
                            color: serie.color
                        }
                    })
                }
            });

            tonalities = [...new Map(tonalities.map(v => [v && v.name ? v.name : "", v])).values()].filter((el) => el !== undefined)

            tonalities = tonalities.map((tonality) => {
                return {
                    ...tonality,
                    value: parent.children.flatMap((child) => {
                        if(child.series.length > 0){
                            return child.series.map(serie => {
                                if(serie.name === tonality.name){
                                    return serie.value
                                }
                            })
                        }
                    })
                    .filter((el) => el !== undefined)
                    .reduce((a,b) => a + b, 0)
                }
            });

            /////////////////////////////////////////////////////

            return {
                ...parent,
                y,
                max,
                min,
                optY,
                tonalities
            }
        });
    },
    maxBar(){
        return Math.max(...this.dataset.flatMap((category) => {
            return category.children.map((child) => child.data)
        }))
    },
    maxCircle(){
        return Math.max(...this.circles.map((category) => {
            return category.data
        }))
    },
    totalOccurences(){
        return this.circles.map((parent) => parent.data).reduce((a, b) => a + b, 0);
    }
  },
  methods: {
    // PARENTS TONALITY BARS
    getTonality(tonalities, index) {

      const total = tonalities.map((t) => t.value).reduce((a, b) => a + b, 0);
      let arr = [];
      let acc = 0;
      for(let i = 0; i < tonalities.length; i += 1){
        const t = tonalities[i];
        const x1 = acc;
        const x2 = t.value / total * 100;
        acc += x2;
        arr.push({...t, x1, x2, ratio:x2, total, acc})
      }
      return arr[index]
    },
    // COLOR CONVERSION UTILS
    componentToHex(c) {
      let hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
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
    rgbToHex(color) {
      const elements = color.replace("rgb(", "").replace(")", "").split(",");
      const r = Number(elements[0]);
      const g = Number(elements[1]);
      const b = Number(elements[2]);
      return `#${this.componentToHex(r)}${this.componentToHex(
        g
      )}${this.componentToHex(b)}`;
    },
    // SELECTORS
    selectBar(bar, index){
        this.selectedParent = {};
        if(this.selectedBarIndex !== undefined && index === this.selectedBarIndex){
            this.selectedBar = {};
            this.selectedBarIndex = undefined;
        }else{
            this.selectedBar = bar;
            this.selectedBarIndex = index;
        }
    },
    selectParent(parent){
        this.$emit("selectTopic", parent);
        this.selectedBarIndex = undefined;
        this.selectedBar = {};
        if(this.selectedParent.hasOwnProperty("id") && parent.id === this.selectedParent.id){
            this.selectedParent = {};
        }else{
            this.selectedParent = parent
        }
    },
    // GETTERS
    getCircleRadius(parent){
        if(this.selectedParent.id === parent.id){
            return this.maxCircle / this.maxCircle * this.height / this.circles.length / 2;
        }else{
            return parent.data / this.maxCircle * this.height / this.circles.length / 2;
        }
    },
    getParent(plot){
        return this.circles.find((circle) => circle.id === plot.parentId);
    },
    getParentLabelYPosition(parent, offset){
        if(this.selectedParent.id === parent.id){
            return parent.optY + this.maxCircle / this.maxCircle * offset;
        }else{
            return parent.optY + parent.data / this.maxCircle * offset;
        }
    },
    getParentLegendXPosition(parent){
        if(this.selectedParent.id === parent.id){
            return this.width / 6 - this.maxCircle / this.maxCircle * this.height / this.circles.length / 2 - 5;
        }else{
            return this.width / 6 - parent.data / this.maxCircle * this.height / this.circles.length / 2 - 5;
        }
    },
    // DONUT GENERATION METHODS
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
      if(!series) return {...series, proportion:0, ratio:0, path:'', startX:0, startY:0,endX:0,center:{}};
      series = series.map((el) => {
        return {
            ...el,
            value: el.value === 0 ? 0.001 : el.value // if not this, donut doesn't show at all
        }
      })
      const sum = [...series]
        .map((serie) => serie.value)
        .reduce((a, b) => a + b, 0);
      const ratios = [];
      let acc = 0;
      for (let i = 0; i < series.length; i += 1) {
        const proportion = series[i].value / sum;
        const ratio = proportion * (Math.PI * 2);
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
          ratio,
          path,
          startX,
          startY,
          endX,
          endY,
          center: this.createArc(
            [cx, cy],
            [rx * 1.35, ry * 1.35],
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
    // CONDITIONAL STYLING METHODS
    isNormalSizeDonut(index){
        return (this.selectedBarIndex === undefined || this.selectedBarIndex !== index);
    },
    styleBarLabelEllipsis(index, width){
        if(this.isNormalSizeDonut(index)){
            return `width: ${width}px; display:flex; flex-direction: row; overflow: hidden; text-overflow: ellipsis; white-space:nowrap; align-items:center; justify-content:start`
        }else{
            return `width: ${width}px; display: flex; align-items:center; text-align:left;`
        }
    },
    styleBarOpacity(path, index, fadedValue){
        if(this.selectedBarIndex !== undefined){
            if(this.selectedBarIndex === index){
                return 'opacity:1';
            }
            return `opacity: ${fadedValue}`;
        }else if(this.selectedParent.hasOwnProperty("id")){
            if(this.selectedParent.id === path.parentId){
                return 'opacity:1';
            }
            return `opacity: ${fadedValue}`;
        }else{
            return 'opacity:1';
        }
    },
    styleParentFontSize(parent, ratio){
        if(this.selectedParent.id === parent.id){
            return this.maxCircle / this.maxCircle * ratio;
        }else{
            return parent.data / this.maxCircle * ratio;
        }
    },
    styleParentOpacity(parent){
        if(this.selectedBarIndex !== undefined){
            if(this.selectedBar.parentId === parent.id){
                return "opacity:1";
            }
            return 'opacity:0.2'
        }else if(this.selectedParent.hasOwnProperty("id")){
            if(this.selectedParent.id === parent.id){
                return "opacity:1";
            }
            return "opacity:0.2";
        }else{
            return "opacity:1";
        }
    },
    styleSvgSize(index){
        if(this.isNormalSizeDonut(index)){
            return this.barWidth / 3;
        }else{
            return 42; // :)
        }
    },
    styleTextColor(bgColor) {
      // returns white or black text color based on the bgColor color shade 
      if (bgColor) {
        let color = bgColor;
        if(color.charAt(0) !== "#"){
            color = this.rgbToHex(bgColor);
        }
        color = color.substring(1, 7);
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
        return L > 0.3 ? "#000000" : "#FFFFFF";
      }
      return "#000000";
    },
  },
 
};
</script>

<style lang="scss" scoped>
*{
    transition: all 0.15s ease-in-out;
}
svg {
    background: white;
    overflow: visible;
    padding: 92px;
    user-select: none;
}
.bar-label{
    overflow: visible;
    div{
        align-items:center;
        color: black;
        display: flex;
        height: 100%;
        justify-content: start;
    }
}
.rootbar{
    &__donut{
        &__legend{
            align-items:center;
            background: white;
            border-radius: 12px;
            border-top: 1px solid grey;
            display: flex;
            flex-wrap: wrap;
            height: fit-content !important;
            justify-content: space-around !important;
            padding-top: 12px;
            width: 300px;
            &__item{
                padding-bottom:6px;
            }
        }
    }
    &__parent{
        overflow: visible;
        &__label{
            align-items:start;
            border-radius: 3px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            font-weight: bold;
            height: 100%;
            padding: 0 36px 0 12px;
            text-align:left;
            width:100%;
        }
    }
}
circle, .bar, text, .bar-label{
    cursor: pointer;
}
circle{
    stroke: white;
    stroke-width: 3;
}
svg.sentiment{
    background: transparent;
    height: 7px;
    padding: 0;
    margin-top: 6px;
}
</style>