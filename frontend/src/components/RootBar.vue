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
            :style="getBarOpacity(path, i, 0.05)"
        >
            <path v-for="(el,k) in Math.round(barWidth)" 
            :key="`el_${k}`"
            :d="`M
                ${path.x1},${path.y1 - barWidth / 2 + k}
                C${path.x1 - width / 20},${path.y1 - barWidth / 2 + k} 
                ${path.x1 - width / 10},${path.y1 - barWidth / 2 + k} 
                ${width /6}, ${getParent(path).optY}
            `"
            :stroke="k === 0 || k === Math.round(barWidth) ? 'white' : path.color"
            :stroke-width="2"
            fill="none"
            :shape-rendering="k === 0 || k === Math.round(barWidth) - 1 ? 'auto' : 'crispEdges'"
            :opacity="0.15"
            />
             <!-- DONUT LEGEND -->
            <foreignObject v-if="showTonality && path.hasOwnProperty('series') && selectedBarIndex !== undefined"
                class="bar-label" 
                @click="selectBar(path, i)"  
                :x="path.x2 + 150" 
                :y="path.y1 + 80" 
                :height="64"
                :width="width/3"
            >
                <div :style="`width: 300px; background: white; border-radius: 12px; display: flex; align-items:center; justify-content: space-around; flex-wrap: wrap; opacity:${path.id === selectedBar.id ? 1 : 0}`">
                    <div v-for="(tonality,k) in path.series" :key="`tonality_legend_${k}`" style="display:flex; flex-direction: column; align-items:center;justify-content:cneter;">
                        <strong :style="`color:${tonality.color}; font-size: 1.2em;`">{{tonality.value}}</strong>
                        <span>{{ tonality.name}}</span>
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
                :width="width/3"
            >
                <!-- BAR LABEL -->
                <div style="width: fit-content; display: flex; flex-direction: row;">
                    <div :style="manageEllipsis(i)">
                        <template v-if="selectedParent.hasOwnProperty('data')">
                            <b :style="`color:${getParent(path).color}; margin-right: 3px;`">{{ (path.data / getParent(path).data * 100).toFixed(1) }}%</b> ( {{ path.data }} )&nbsp;{{ path.name }} 
                        </template>
                        <template v-else>
                            <b style="margin-right:3px;">{{ (path.data / totalOccurences * 100).toFixed(1) }}%</b> ( {{ path.data }} )&nbsp;{{ path.name }} 
                        </template>
                    </div>
                    <!-- DONUT & MARKERS -->
                    <svg 
                        v-if="showTonality && path.hasOwnProperty('series')"
                        :style="`background: transparent; padding:0 !important; margin-left:${isNormalSizeDonut(i) ? '24px' : '64px'};`" 
                        :height="sizeSvg(i)" 
                        :viewBox="`0 0 ${100} ${100}`"
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
        :style="getParentOpacity(circle)" 
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
            :font-size="`${getParentLabelFontSize(circle, 25)}px`" 
            :fill="textColor(circle.color)"
            text-anchor="middle"
            font-weight="bold"
        >
            {{ (circle.data / totalOccurences * 100).toFixed(1) }} %
      
        </text>
        <!-- base -->
        <text 
            :x="width / 6" 
            :y="getParentLabelYPosition(circle, 30)" 
            :font-size="`${getParentLabelFontSize(circle, 20)}px`" 
            :fill="textColor(circle.color)"
            text-anchor="middle"
        >
            {{ circle.data }}
      
        </text>
        <!-- PARENT'S NAME -->
        <foreignObject style="overflow: visible;" :x="-50" :y="getParentLabelYPosition(circle, - height/circles.length/2)" :height="getCircleRadius(circle) * 2" width="200px">
            <div :style="`height: 100%; width:100%; text-align: left; display: flex; align-items:center; font-weight: bold; border-left: 5px solid ${circle.color}; padding: 0 36px 0 12px; border-radius: 3px; background: linear-gradient(to right, ${circle.color}71, transparent)`">
                {{ circle.name}}
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
            :style="getBarOpacity(bar,i, 0.1)"
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

export default{
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
            // Dataset must respect this format
            return [
                {
                    id: "01",
                    name: "Group 1 with a very long name that is way too long",
                    color: "#74cf77",
                    children: [
                        {
                            id: "01_01",
                            name: "Some label that is way too long and really that much",
                            data: 150,
                            series: [
                                {
                                    name: "Good",
                                    value: 1125,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 256,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 1324,
                                    color: "#F17171"
                                }
                            ]
                        },
                        {
                            id: "01_02",
                            name: "Group 1 Item 2",
                            data: 80,
                            series: [
                                {
                                    name: "Good",
                                    value: 10,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "01_03",
                            name: "Group 1 Item 3",
                            data: 122,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "01_04",
                            name: "Group 1 Item 4",
                            data: 165,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "01_05",
                            name: "Group 1 Item 5",
                            data: 25,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 1,
                                    color: "#F17171"
                                }
                            ]
                        },
                    ]
                },
                {
                    id: "02",
                    name: "Group 2",
                    color: "#6376DD",
                    children: [
                        {
                            id: "02_01",
                            name: "Group 2 Item 1",
                            data: 120,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "02_02",
                            name: "Group 2 Item 2",
                            data: 90,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "02_03",
                            name: "Group 2 Item 3",
                            data: 102,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "02_04",
                            name: "Group 2 Item 4",
                            data: 10,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "02_05",
                            name: "Group 2 Item 5",
                            data: 16,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 1,
                                    color: "#F17171"
                                }
                            ]
                        },
                    ]
                },
                {
                    id: "03",
                    name: "Group 3",
                    color: "#f2bc27",
                    children: [
                        {
                            id: "03_01",
                            name: "Group 3 Item 1",
                            data: 150,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "03_02",
                            name: "Group 3 Item 2",
                            data: 125,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "03_03",
                            name: "Group 3 Item 3",
                            data: 99,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "03_04",
                            name: "Group 3 Item 4",
                            data: 9,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "03_05",
                            name: "Group 3 Item 5",
                            data: 11,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 1,
                                    color: "#F17171"
                                }
                            ]
                        },
                    ]
                },
                {
                    id: "04",
                    name: "Group 4",
                    color: "#db621d",
                    children: [
                        {
                            id: "04_01",
                            name: "Group 4 Item 1",
                            data: 34,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "04_02",
                            name: "Group 4 Item 2",
                            data: 125,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "04_03",
                            name: "Group 4 Item 3",
                            data: 99,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "04_04",
                            name: "Group 4 Item 4",
                            data: 22,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "04_05",
                            name: "Group 4 Item 5",
                            data: 29
                        },
                    ]
                },
                {
                    id: "05",
                    name: "Group 5",
                    color: "#732196",
                    children: [
                        {
                            id: "05_01",
                            name: "Group 5 Item 1",
                            data: 24,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            name: "Group 5 Item 2",
                            data: 12,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            name: "Group 5 Item 3",
                            data: 9,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "05_04",
                            name: "Group 5 Item 4",
                            data: 15,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
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
                            id: "05_05",
                            name: "Group 5 Item 5",
                            data: 23,
                            series: [
                                {
                                    name: "Good",
                                    value: 1,
                                    color: "#15B300"
                                },
                                {
                                    name: "Average",
                                    value: 1,
                                    color: "#ccc"
                                },
                                {
                                    name: "Bad",
                                    value: 1,
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
            const {id, name, color} = parent;
            let data = parent.children.map((child) => {
                return child.data
            }).reduce((a,b) => a + b, 0);
            return {
                id, name, data, color
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
            return {
                ...parent,
                y,
                max,
                min,
                optY
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
        return this.circles.map((parent) => parent.data).reduce((a,b) => a + b, 0);
    }
  },
  methods: {
    componentToHex(c) {
      let hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    getParent(plot){
        return this.circles.find((circle) => circle.id === plot.parentId);
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
    textColor(bgColor) {
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
        this.selectedBarIndex = undefined;
        this.selectedBar = {};
        if(this.selectedParent.hasOwnProperty("id") && parent.id === this.selectedParent.id){
            this.selectedParent = {};
        }else{
            this.selectedParent = parent
        }
    },
    getBarOpacity(path, index, fadedValue){
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
    getParentOpacity(parent){
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
    getCircleRadius(parent){
        if(this.selectedParent.id === parent.id){
            return this.maxCircle / this.maxCircle * this.height / this.circles.length / 2;
        }else{
            return parent.data / this.maxCircle * this.height / this.circles.length / 2;
        }
    },
    getParentLabelYPosition(parent, offset){
        if(this.selectedParent.id === parent.id){
            return parent.optY + this.maxCircle / this.maxCircle * offset;
        }else{
            return parent.optY + parent.data / this.maxCircle * offset;
        }
    },
    getParentLabelFontSize(parent, ratio){
        if(this.selectedParent.id === parent.id){
            return this.maxCircle / this.maxCircle * ratio;
        }else{
            return parent.data / this.maxCircle * ratio;
        }
    },
    getParentLegendXPosition(parent){
        if(this.selectedParent.id === parent.id){
            return this.width / 6 - this.maxCircle / this.maxCircle * this.height / this.circles.length / 2 - 5;
        }else{
            return this.width / 6 - parent.data / this.maxCircle * this.height / this.circles.length / 2 - 5;
        }
    },
    //Donut generation methods
    addVector([a1, a2], [b1, b2]) {
      return [a1 + b1, a2 + b2];
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
      const { series } = item;
      if(!series) return {...series, proportion:0, ratio:0, path:'', startX:0, startY:0,endX:0,center:{}};
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
    isNormalSizeDonut(index){
        return (this.selectedBarIndex === undefined || this.selectedBarIndex !== index);
    },
    sizeSvg(index){
        if(this.isNormalSizeDonut(index)){
            return this.barWidth / 3;
        }else{
            return 42;
        }
    },
    sizeDonut(plot, index){
        if(this.isNormalSizeDonut(index)){
            return this.makeDonut(plot, this.barWidth / 6, this.barWidth / 6, this.barWidth / 3, this.barWidth / 3)
        }else {
            return this.makeDonut(plot, this.maxCircle, this.maxCircle, this.maxCircle /3, this.maxCircle / 3)
        }
    },
    manageEllipsis(index){
        if(this.isNormalSizeDonut(index)){
            return `width: 200px; display:flex; flex-direction: row; overflow: hidden; text-overflow: ellipsis; white-space:nowrap;`
        }else{
            return `width: 200px; display: flex; align-items:start; text-align:left;`
        }
    }
  },
 
};
</script>

<style lang="scss" scoped>
*{
    transition: all 0.15s ease-in-out;
}
svg {
    user-select: none;
    background: white;
    padding: 48px;
    overflow: visible;
    // transform: rotate(90deg);
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
circle, .bar, text, .bar-label{
    cursor: pointer;
}
circle{
    stroke: white;
    stroke-width: 3;
}
</style>
