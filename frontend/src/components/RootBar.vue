<template>
  <svg 
    class="rootbar" 
    width="100%" 
    :style="`max-width:${maxWidth}px; font-family:${fontFamily}`" 
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
            <!-- Bar label -->
            <foreignObject class="bar-label" @click="selectBar(path, i)"  :x="path.x2 + 10" :y="path.y1 - (height / (bars.length) / 2)" :height="height / (bars.length)" :width="500">
                <div>
                    {{ path.name }} ( {{ path.data }} ) : 
                    <span v-if="selectedParent.hasOwnProperty('data')" :style="`color:${getParent(path).color}; font-weight: bold;`">
                        &nbsp;{{ (path.data / getParent(path).data * 100).toFixed(1) }}%
                    </span>
                    <span v-else style="font-weight:bold;">
                        &nbsp;{{ (path.data / totalOccurences * 100).toFixed(1) }} %
                    </span>
                </div>
            </foreignObject>
        </g>
    </g>

    <!-- PARENT CIRCLES -->
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
        <text :x="getParentLegendXPosition(circle)" 
            :y="circle.optY + circleTextOffset"
            text-anchor="end"
        >
            {{ circle.name }}
        </text>
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
                    name: "Group 1",
                    color: "#74cf77",
                    children: [
                        {
                            id: "01_01",
                            name: "Group 1 Item 1",
                            data: 150
                        },
                        {
                            id: "01_02",
                            name: "Group 1 Item 2",
                            data: 80
                        },
                        {
                            id: "01_03",
                            name: "Group 1 Item 3",
                            data: 122
                        },
                        {
                            id: "01_04",
                            name: "Group 1 Item 4",
                            data: 165
                        },
                        {
                            id: "01_05",
                            name: "Group 1 Item 5",
                            data: 25
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
                            data: 120
                        },
                        {
                            id: "02_02",
                            name: "Group 2 Item 2",
                            data: 90
                        },
                        {
                            id: "02_03",
                            name: "Group 2 Item 3",
                            data: 102
                        },
                        {
                            id: "02_04",
                            name: "Group 2 Item 4",
                            data: 10
                        },
                        {
                            id: "02_05",
                            name: "Group 2 Item 5",
                            data: 16
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
                            data: 150
                        },
                        {
                            id: "03_02",
                            name: "Group 3 Item 2",
                            data: 125
                        },
                        {
                            id: "03_03",
                            name: "Group 3 Item 3",
                            data: 99
                        },
                        {
                            id: "03_04",
                            name: "Group 3 Item 4",
                            data: 9
                        },
                        {
                            id: "03_05",
                            name: "Group 3 Item 5",
                            data: 11
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
                            data: 34
                        },
                        {
                            id: "04_02",
                            name: "Group 4 Item 2",
                            data: 125
                        },
                        {
                            id: "04_03",
                            name: "Group 4 Item 3",
                            data: 99
                        },
                        {
                            id: "04_04",
                            name: "Group 4 Item 4",
                            data: 22
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
                            data: 24
                        },
                        {
                            id: "05_02",
                            name: "Group 5 Item 2",
                            data: 12
                        },
                        {
                            id: "05_03",
                            name: "Group 5 Item 3",
                            data: 9
                        },
                        {
                            id: "05_04",
                            name: "Group 5 Item 4",
                            data: 15
                        },
                        {
                            id: "05_05",
                            name: "Group 5 Item 5",
                            data: 23
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
    width: {
        type: Number,
        default: 1000,
    }
  },
  data() {
    return {
        gap: 3,
        ratioSeparation: 2.2,
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
                x2: this.width / this.ratioSeparation + (child.data / this.maxBar) * this.width / 3,
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
