<template>
  <div class="mini-score-chart">
        <svg width="100%" :viewBox="`0 0 ${height * formatA} ${height}`" :style="`font-family:${fontFamily}`" @pointermove="setClientPosition($event)">
        <!-- <path :d="smileys.neutral" stroke="black" stroke-linecap="round" stroke-width="2" fill="none"/> -->
        <defs>
            <clipPath id="round-corner">
                <rect 
                    height="10" 
                    rx="5" 
                    ry="5"
                    width="100%" 
                    x="0" 
                    y="5" 
                />
            </clipPath>
        </defs>

        <!-- CHARTS WITH A SINGLE DATA POINT -->
        <g v-if="isSingle">
            <!-- Title -->
            <foreignObject style="overflow: visible;" :x="0" :y="5" width="100%" height="1em">
                <div class="title" :style="`font-family:${fontFamily} !important;`">
                    {{ data.title }}
                </div>
            </foreignObject>

            <!-- Chart of type 'score-ctl' -->
            <g v-if="isChartOfType('score-ctl')">
                <!-- Score & base -->
                <foreignObject :x="0" :y="26" height="100%" width="50%">
                    <div :style="`color:${getScoreColor(data.dataset[0].score)}`">
                        <b class="score">
                            {{ data.dataset[0].score.toLocaleString() }}
                        </b>
                        <b class="score-base">
                            /{{ data.dataset[0].scoreBase }}
                        </b>
                    </div>
                    <svg height="24" viewBox="0 0 29 29">
                        <path :stroke="getScoreColor(data.dataset[0].score)" stroke-width="2" stroke-linecap="round" :d="smileys[getTonality(data.dataset[0].score)]" fill="none"/>
                    </svg>
                </foreignObject>
                <foreignObject :x="centerX - 5" :y="36" height="100%" width="50%">
                    <div class="score-ctl-progression">
                        <b :style="`color:${colors.tonalities[getProgressColor(data.dataset[0].progression)]} !important;`">
                            {{ data.dataset[0].progression >= 0 ? `+${data.dataset[0].progression}` : data.dataset[0].progression }}
                        </b>
                        <span>
                            {{ data.dataset[0].name}}
                        </span>
                    </div>
                </foreignObject>
            </g>

            <!-- Chart of type 'score-tonality-single' -->
            <g v-if="isChartOfType('score-tonality')">
                <!-- Score & base -->
                <foreignObject :x="0" :y="26" height="32" width="100%">
                    <div :style="`color:${getScoreColor(data.dataset[0].score)}`">
                        <b class="score">
                            {{ data.dataset[0].score.toLocaleString() }}
                        </b>
                        <b class="score-base">
                            /{{ data.dataset[0].scoreBase }}
                        </b>
                    </div>
                </foreignObject>

                <!-- Bar -->
                <g v-for="(tonality, i) in makeTonalityBar(data.dataset[0].tonalities)"
                    :key="`tonality_selected_${i}`">
                    <rect 
                        :fill="colors.tonalities[tonality.name]" 
                        :x="tonality.x1 + 10" 
                        :y="66" :width="(tonality.acc - tonality.x1)" 
                        height="5"
                    /> 
                </g>
                <g class="minibar-white-border">
                    <rect rx="3.5" stroke-width="2" height="7" width="120" y="65" x="10" stroke="white" fill="none"/>
                </g>
                
                <!-- Legend width smileys -->
                <foreignObject :x="0" :y="80" height="32" width="100%">
                    <div class="legend__wrapper">
                        <div class="legend__item" v-for="(tonality, i) in convertTonalities(data.dataset[0].tonalities)" :key="`legend_tonality_${i}`">
                            <svg viewBox="0 0 29 29" height="16" width="16" style="margin-bottom:-3px">
                                <path :d="smileys[tonality.name]" fill="none" :stroke="colors.tonalities[tonality.name]" stroke-linecap="round" stroke-width="2"/>
                            </svg>
                            <b>{{(tonality.ratio*100).toFixed(0)}}%</b>
                        </div>
                    </div>
                </foreignObject>
            </g>
        </g>

        <!-- CHARTS WITH MULTIPLE DATA POINTS -->
        <template v-else>
            <!-- Chart of type 'score-tonality-list' -->
            <g v-if="isChartOfType('score-tonality')">
                <!-- Title -->
                <foreignObject style="overflow: visible;" :x="0" :y="5" width="100%" height="1em">
                    <div class="title" :style="`font-family:${fontFamily} !important;`">
                        {{ data.title }}
                    </div>
                </foreignObject>

                <!-- Bars -->
                <g v-for="(datapoint,i) in data.dataset" :key="`datapoint_${i}`">
                    <g v-for="(tonality, j) in makeTonalityBar(datapoint.tonalities)"
                    :key="`tonality_selected_${j}`">
                    <rect 
                        :fill="colors.tonalities[tonality.name]" 
                        :x="tonality.x1 + 10" 
                        :y="((i+1) * (height-30) / data.dataset.length) + 10" :width="(tonality.acc - tonality.x1)" 
                        height="5"
                        @pointerover="tooltipActive = true; drawAndShowTooltip(datapoint)"
                        @pointerout="tooltipActive = false"
                    /> 
                    </g>
                    <g class="minibar-white-border">
                        <rect rx="3" stroke-width="2.5" height="6" width="120" :y="((i+1) * (height-30) / data.dataset.length) + 10" x="10" stroke="white" fill="none"/>
                    </g>

                    <!-- datapoint name -->
                    <text :x="10" :y="((i+1) * (height-30) / data.dataset.length) + 8" font-size="7" fill="#4E5D78">
                        {{datapoint.name}}
                    </text>
                </g>
            </g>
        </template>
    </svg>

    <!-- TOOLTIP -->
    <div class="tooltip" v-if="tooltipActive" :style="`top:${clientY}px; left:${clientX}px`" v-html="tooltipContent"> 
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    data: {
        type: Object,
        default(){
            return {
                dataset: [],
                title: "Title",
                /* POSSIBLE TYPES:
                 * nps-only
                 * ranking-only
                 * score-only (single or duo with vertical separation)
                 * score-ctl (with comparison between first & last answerings)
                 * score-tonality (single or list, depending on data.dataset length)
                 */
                type: "",
            }
        }
    },
    fontFamily: {
        type: String,
        default: "Product Sans",
    },
  },
  data() {
    return {
        clientX: undefined,
        clientY: undefined,
        colors: {
            nps: {
                promoter: "#15B300",
                passive: "#E4793C",
                detractor: "#EE4F4F"
            },
            tonalities: {
                positive: "#15B300",
                neutral: "#C4C4C4",
                negative: "#F17171"
            }
        },
        formatA: 1.414285714285714,
        height: 100,
        smileys: {
            positive: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            neutral: "M9.172 15.170a0 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            negative: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        },
        tooltipActive: false,
        tooltipContent: "",
    };
  },
  computed: {
    centerX(){
        return (this.height * this.formatA) / 2;
    },
    computedDataset(){
        return []
    },
    isSingle(){
        return this.data.dataset.length === 1;
    }
  },
  methods: {
    convertTonalities(tonalities){
        const values = Object.values(tonalities);
        const names = Object.keys(tonalities);
        const total = values.reduce((a, b) => a + b, 0);
        return values.map((v, i) => {
            return {
                value:v,
                name:names[i],
                ratio: v / total
            }
        });
    },
    drawAndShowTooltip({tonalities}){
        const values = Object.values(tonalities);
        const keys = Object.keys(tonalities);
        const total = values.reduce((a,b) => a + b, 0);
        const legendArray = values.map((v,i) => {
            return {
                value: v,
                name: keys[i],
                ratio: v / total,
                icon: `<svg height="29" viewBox="0 0 29 29">
                            <path 
                                d="${this.smileys[keys[i]]}" 
                                fill="none"
                                stroke-linecap="round" 
                                stroke-width="2" 
                                stroke="${this.colors.tonalities[keys[i]]}" 
                            />
                       </svg>`
            }
        });
        let html = "";
        
        legendArray.forEach((legend, i) => {
            html += `
                <div style="width: 100%; display: flex;">
                    ${legend.icon}
                    <span>
                        <b>${(legend.ratio * 100).toFixed(0)}%</b> 
                        <span>( ${legend.value} )</span>
                    </span>
                </div>
            `
        })
        this.tooltipContent = html;
    },
    getProgressColor(progression){
        switch (true) {
            case progression > 0:
                return "positive";
            
            case progression === 0:
                return "neutral";

            case progression < 0:
                return "negative";
        
            default:
                return "neutral";
        }
    },
    getScoreColor(score){
        switch (true) {
            case score <= 6:
                return this.colors.nps.detractor;
            
            case score > 6 && score < 8:
                return this.colors.nps.passive;

            case score >= 8:
                return this.colors.nps.promoter;

            default:
                return this.colors.nps.passive;
        }
    },
    getTonality(score){
        switch (true) {
            case score <= 6:
                return "negative";

            case score > 6 && score < 8:
                return "neutral";

            case score >= 8:
                return "positive";
        
            default:
                return "neutral";
        }
    },
    isChartOfType(type){
        return this.data.type.includes(type);
    },
    makeTonalityBar(tonalities) {
        const values = Object.values(tonalities);
        const names = Object.keys(tonalities);
        const total = values.reduce((a, b) => a + b, 0);
        let arr = [];
        let acc = 0;
        for(let i = 0; i < values.length; i += 1){
            const t = values[i];
            const x1 = acc;
            const x2 = t / total * (this.height * this.formatA - 22);
            acc += x2;
            arr.push({...t, x1, x2, ratio:x2, total, acc, name:names[i], value: values[i] })
        }

        return arr;
    },
    
    setClientPosition({ clientX, clientY }) {
      this.clientX = clientX - 125;
      this.clientY = clientY + 12;
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
    background: white;
    overflow: visible;
    position: relative;
}
.legend {
    &__item {
        align-items:center;
        color: #2D353C;
        flex-direction: row;
        font-size: 0.5em;
        justify-content: center;
        display: flex;
    }
    &__wrapper {
        align-items:center;
        display: flex;
        flex-direction: row;
        gap: 12px;
        justify-content: center;
        width:100%;
    }
}

.mini-score-chart {
    height: fit-content;
    max-width: 400px;
    position: relative;
    width: 100%;
}

.score {
    font-size: 1.2em;
}

.score-base {
    font-size: 0.618em; 
    margin-left:-0.4em;
}

.title {
    color: #2D353C;
    font-size: 8px !important;
    line-height: 10px;
    width: 100%;
}

.tooltip {
    background: white;
    position: fixed;
    padding: 16px 12px 12px 24px;
    border-radius: 12px;
    box-shadow: 0 3px 6px 0 rgba(0,0,0,0.11);
    width: 250px;
}

.score-ctl-progression {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
    b {
        font-size: 0.6em;
    }
    span {
        font-size: 0.4em;
    }
}
</style>
