<template>
    <svg 
        :style="`max-width:${maxWidth}px`" 
        :viewBox="`0 0 ${width} ${height}`"
        class="relation-circle"
        width="100%" 
    >
        <circle 
            :cx="width/2" 
            :cy="width/2" 
            :r="r" 
            class="main-circle"
        />

        <g v-if="curved">
             <path v-for="(relation,i) in relations" 
            :key="`relation_${i}`" 
            :style="getLineOpacityAndWidth(relation)"
            :stroke="getLineColor(relation)" 
            class="relation"
            :d="`M${relation.x1},${relation.y1} C${relation.x1},${relation.y1} ${height/2},${width/2} ${relation.x2},${relation.y2}`"
            fill="none"
            />
        </g>
        <g v-else>
            <line v-for="(relation,i) in relations" 
            :key="`relation_${i}`" 
            :stroke="getLineColor(relation)" 
            :style="getLineOpacityAndWidth(relation)"
            :x1="relation.x1" 
            :x2="relation.x2" 
            :y1="relation.y1" 
            :y2="relation.y2" 
            class="relation" 
            />
        </g>

        

        <text v-for="(plot,i) in circles" 
            :font-family="fontFamily"
            :key="`plot_text_${i}`" 
            :style="getTextOpacity(plot)"
            :text-anchor="getTextAnchor(plot)"
            :transform="getTextRotation(plot)"
            :x="getTextX(plot)" 
            :y="plot.y + 5"
            @click="selectPlot(plot)" 
            class="legend" 
            transform-origin="start"
        >
            {{plot.verbatim}}
        </text>

        <circle v-for="(plot,i) in circles" 
            :cx="plot.x" 
            :cy="plot.y" 
            :key="`plot_${i}`" 
            :style="getCircleOpacity(plot)"
            class="plot" 
            fill="black" @click="selectPlot(plot)" 
            r="2" 
        />
    </svg>
</template>

<script>
export default {
  name: "RelationCircle",
  props: {
    curved: {
        type: Boolean,
        default: false,
    },
    dataset: {
        type: Array,
        default(){
            // one relation between to datapoints must be present in both relations arrays
            return [
                {
                    id: "01",
                    verbatim: "Lorem",
                    relations: ["02","03","04","05","06","07","08","09","10","11","12"],
                    color: "green"
                },
                {
                    id: "02",
                    verbatim: "Ipsum",
                    relations: ["01", "03", "07", "06", "07"],
                    color: "blue"
                },
                {
                    id: "03",
                    verbatim: "Dolor",
                    relations: ["01", "02"],
                    color: "red",
                },
                {
                    id: "04",
                    verbatim: "Consectetur",
                    relations: ["01", "05", "10"],
                    color: "orange"
                },
                {
                    id: "05",
                    verbatim: "Amet",
                    relations: ["01", "04", "07", "10"],
                    color: "purple"
                },
                {
                    id: "06",
                    verbatim: "Rherum",
                    relations: ["01", "02"],
                    color: "turquoise"
                },
                {
                    id: "07",
                    verbatim: "Delecta",
                    relations: ["01","02", "08", "12"],
                    color: "yellow"
                },
                {
                    id: "08",
                    verbatim: "Nitimur",
                    relations: ["01","07", "12", "01"],
                    color: "#6376DD"
                },
                {
                    id: "09",
                    verbatim: "Vetitum",
                    relations: ["01"],
                    color: "magenta"
                },
                {
                    id: "10",
                    verbatim: "Monumentum",
                    relations: ["01", "04", "05"],
                    color: "darkblue"
                },
                {
                    id: "11",
                    verbatim: "Aere",
                    relations: ["01"],
                    color: "greenyellow"
                },
                {
                    id: "12",
                    verbatim: "Perennius",
                    relations: ["01","07", "08"],
                    color: "crimson"
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
        default: 400,
    },
    maxWidth: {
        type: Number,
        default: 1000,
    },
    width: {
        type: Number,
        default: 400,
    }
  },
  data() {
    return {
        circles: [],
        r: this.width / 4,
        relations: [],
        selectedPlot: {},
        selectedRelations: [],
        selectedRotation: 0,
    };
  },
  created(){
    this.createPlots();
    this.createRelations();
  },
  computed: {},
  methods: {
    createPlots(){
        const angleGap = 6.28319 / this.dataset.length;
        const regAngleGap = 360 / this.dataset.length;
        let angle = 0;
        let regAngle = 0;
        this.dataset.forEach((plot, i) => {
            let x = this.r * Math.cos(angle) + this.width / 2;
            let y = this.r * Math.sin(angle) + this.width / 2;
            this.circles.push({x,y, ...plot, regAngle});
            angle += angleGap;
            regAngle += regAngleGap
        });
    },
    createRelations(){
        this.circles.forEach((plot) => {
            let relations = this.circles.filter(c => c.relations.includes(plot.id));
            relations.forEach(relation => {
                this.relations.push({
                    relationId: `${plot.id}_${relation.id}`,
                    x1: plot.x,
                    y1: plot.y,
                    x2: relation.x,
                    y2: relation.y,
                    colorSource: plot.color,
                    colorTarget: relation.color,
                    ...plot
                })
            })
        })
    },
    getCircleOpacity(plot){
        if(this.selectedPlot.hasOwnProperty("x")){
            if(this.selectedPlot.id === plot.id || this.selectedRelations.includes(plot.id)){
                return "opacity:1";
            }
            return "opacity:0.1";
        }
        return "opacity:1";
    },
    getLineColor(plot){
        if(this.selectedPlot.hasOwnProperty("x")){
            return plot.colorTarget;
        }
        return plot.colorSource;  
    },
    getLineOpacityAndWidth(plot){
        if(this.selectedPlot.hasOwnProperty("x")){
            if(this.selectedRelations.includes(plot.id) && plot.relationId === `${plot.id}_${this.selectedPlot.id}` || plot.relationId === `${this.selectedPlot.id}_${plot.id}`){
                return 'opacity:1; stroke-width:2';
            }
            return 'opacity: 0.05';
        }   
        return 'opacity:1';
    },
    getTextAnchor(plot){
        if(plot.regAngle > 90 && plot.regAngle < 270){
            return "end";
        }
        return "start";
    },
    getTextX(plot){
        if(plot.regAngle > 90 && plot.regAngle < 270){
            return plot.x - 5;
        }
        return plot.x + 5;
    },
    getTextOpacity(plot){
        if(this.selectedPlot.hasOwnProperty("x")){
            if(this.selectedPlot.id === plot.id || this.selectedRelations.includes(plot.id)){
                return 'opacity:1';
            }
            return "opacity:0.2";
        }
        return 'opacity:1';
    },
    getTextRotation(plot){
        if(plot.regAngle > 90 && plot.regAngle < 270){
            return `rotate(${plot.regAngle + 180},${plot.x},${plot.y})`;
        }
            return `rotate(${plot.regAngle},${plot.x},${plot.y})`;
    },
    selectPlot(plot){
        this.selectedRotation = 360 - plot.regAngle
        if(this.selectedPlot.hasOwnProperty("id") && plot.id === this.selectedPlot.id){
            this.selectedPlot = {};
            return;
        }
        this.selectedPlot = plot;
        this.selectedRelations = [...plot.relations]
    }
  },
};
</script>

<style lang="scss" scoped>
* {
    transition: all 0.2s ease-in-out;
}
svg{
    border-radius: 50%;
    user-select: none;
}
svg.relation-circle{
    background: white;
    overflow: visible;
    padding: 12px;
}
circle, .legend{
    cursor: pointer;
}
.legend {
    font-size: 0.8rem;
}
.main-circle{
    cursor: initial;
    fill: transparent;
    stroke: rgb(194, 194, 194);
}

</style>
