<template>
  <svg class="rootbar" width="100%" :style="`max-width:${maxWidth}px; font-family:${fontFamily}`" :viewBox="`0 0 ${width} ${height}`">

    <g>
        <g v-for="(path,i) in bars" :key="`path_${i}`" 
            :style="getBarOpacity(path, i)">
            <path v-for="(el,k) in Math.round(barWidth)" :key="`el_${k}`"
            :d="`M
                ${path.x1},${path.y1 - barWidth / 2 + k}
                C${path.x1 - width / 50},${path.y1 - barWidth / 2 + k} 
                ${path.x1 - width / 6},${path.y1 - barWidth / 2 + k} 
                ${width /6}, ${getParent(path).optY}
            `"
            :stroke="k === 0 || k === Math.round(barWidth) ? 'white' : path.color"
            :stroke-width="2"
            fill="none"
            :shape-rendering="k === 0 || k === Math.round(barWidth) - 1 ? 'auto' : 'crispEdges'"
            :opacity="0.15"
            />
            <text  @click="selectBar(path, i)" :x="path.x2 + 10" :y="path.y1 + height*0.01" text-anchor="start" :font-size="barFontSize">
                {{ path.name }}
            </text>
        </g>
        
    </g>

    <g v-for="(circle,i) in circles"  :key="`parent_${i}`" :style="getParentOpacity(circle)" @click="selectParent(circle)">
        <circle 
            :cx="width/6 " :cy="circle.optY"
            :r="circle.data / maxCircle * height / circles.length/2"
            :fill="circle.color"
        />
        <text :x="width / 6" :y="circle.optY + circle.data / maxCircle * 10" text-anchor="middle" :font-size="`${circle.data / maxCircle * 30}px`" :fill="textColor(circle.color)">
            {{ circle.data }}
        </text>
        <text :x="width / 6 - circle.data / maxCircle * height / circles.length / 2 - 5" :y="circle.optY + circleTextOffset" text-anchor="end">
            {{ circle.name }}
        </text>
    </g>

    <g>
        <line v-for="(bar,i) in bars" 
            :key="`bar_${i}`" 
            :x1="bar.x1" 
            :x2="bar.x2" 
            :y1="bar.y1" 
            :y2="bar.y2" 
            :stroke="bar.color" 
            :stroke-width="barWidth" 
            @click="selectBar(bar, i)"
            :style="getBarOpacity(bar,i)"
            class="bar"
        />
    </g>

    <g>
        <line :x1="width / 2" :x2="width / 2" :y1="0" :y2="height" stroke="white" stroke-width="3" />
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
            return [
                {
                    id: "01",
                    name: "Group 1",
                    data: 100,
                    color: "#74cf77",
                    children: [
                        {
                            id: "01_01",
                            name: "Group 1 Item 1",
                            data: 100
                        },
                        {
                            id: "01_02",
                            name: "Group 1 Item 2",
                            data: 110
                        },
                        {
                            id: "01_03",
                            name: "Group 1 Item 3",
                            data: 95
                        },
                        {
                            id: "01_04",
                            name: "Group 1 Item 4",
                            data: 20
                        },
                        {
                            id: "01_05",
                            name: "Group 1 Item 5",
                            data: 18
                        },
                        {
                            id: "01_06",
                            name: "Group 1 Item 6",
                            data: 36
                        },
                        {
                            id: "01_07",
                            name: "Group 1 Item 7",
                            data: 80
                        },
                        {
                            id: "01_08",
                            name: "Group 1 Item 8",
                            data: 55
                        },
                    ]
                },
                {
                    id: "02",
                    name: "Group 2",
                    data: 20,
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
                        }
                    ]
                },
                {
                    id: "03",
                    name: "Group 3",
                    data: 35,
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
                        }
                    ]
                },
                {
                    id: "04",
                    name: "Group 4",
                    data: 30,
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
        default: 1000,
    },
    width: {
        type: Number,
        default: 800,
    }
  },
  data() {
    return {
        gap: 3,
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
                x1: this.width / 2,
                x2: this.width / 2 + (child.data / this.maxBar) * this.width / 3,
            }
        }).sort((a,b) => a.data - b.data)
    },
    circles(){
        // get first and last x of each parent, and find middle point
        const parents = [...this.dataset].map((parent) => {
            const {id, name, data, color} = parent;
            return {
                id, name, data, color
            }
        });
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
        return Math.max(...this.dataset.map((category) => {
            return category.data
        }))
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
    getBarOpacity(path, index){
        if(this.selectedBarIndex !== undefined){
            if(this.selectedBarIndex === index){
                return 'opacity:1';
            }
            return 'opacity: 0.2';
        }else if(this.selectedParent.hasOwnProperty("id")){
            if(this.selectedParent.id === path.parentId){
                return 'opacity:1';
            }
            return 'opacity: 0.2';
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
    }
  },
};
</script>

<style lang="scss" scoped>
*{
    transition: all 0.2s ease-in-out;
}
svg {
    user-select: none;
    background: white;
    padding: 48px;
    overflow: visible;
    // transform: rotate(90deg);
}
circle, .bar, text{
    cursor: pointer;
}
</style>
