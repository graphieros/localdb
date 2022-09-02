<template>
  <div class="tab-menu" :style="`font-family:${fontFamily}`">
    <div 
        v-for="(tab,i) in data.actions" 
        :key="`tab_${i}`" 
        :class="{'tab-menu__item' :true, 'tab-menu__item--tonality': atLeastOneHasTonality(), 'tab-menu__item--selected': tab.id === activeTab}"
        @click="selectTab(tab.id)"
    >
        <div class="tab-menu__item__content">
            <span class="tab-menu__item__value">
                {{ tab.count.toLocaleString() }}
            </span>
            <span class="tab-menu__item__name">
                {{ tab.name }}
            </span>
            <svg width="80px" viewBox="0 0 100 10" v-if="hasTonality(tab)">
                <g
                    v-for="(tonality, i) in createTonalityBarChart(
                            tab.tonalities
                        )"
                    :key="`tonality_selected_${i}`"
                >
                    <rect
                        :fill="colors.tonalities[tonality.name]"
                        :x="tonality.x1"
                        :y="5"
                        :width="tonality.acc - tonality.x1"
                        height="10"
                    />
                </g>
                <g class="tab-menu__item__bar-border">
                    <rect
                        rx="5"
                        stroke-width="4"
                        height="10"
                        width="100"
                        y="5"
                        x="0"
                        fill="none"
                    />
                </g>
            </svg>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabMenu",
  props: {
    fontFamily:{
        type: String,
        default: "Product Sans"
    },
    data: {
        type: Object,
        default(){
            return {
                actions: [
                    {
                        id: "01",
                        name: "Tab1",
                        tonalities: {
                            positive: 70,
                            neutral: 10,
                            negative: 20
                        },
                        count: 100,
                    },
                    {
                        id: "02",
                        name: "Tab2",
                        tonalities: {
                            positive: 120,
                            neutral: 50,
                            negative: 30
                        },
                        count: 200,
                    },
                    {
                        id: "03",
                        name: "Tab3",
                        tonalities: {
                            positive: 150,
                            neutral: 30,
                            negative: 120
                        },
                        count: 300,
                    }
                ],
                activeTab: 0,
            }
        }
    },
  },
  data() {
    return {
        activeTab: this.data.activeTab,
        colors: {
            tonalities: {
                positive: "#15B300",
                neutral: "#C4C4C4",
                negative: "#F17171"
            }
        },
    };
  },
  computed: {},
  methods: {
    atLeastOneHasTonality(){
        return this.data.actions.map((tab) => {
            return !!tab.tonalities;
        }).some((tab) => tab === true);
    },
    createTonalityBarChart(tonalities) {
            const values = Object.values(tonalities);
            const names = Object.keys(tonalities);
            const total = values.reduce((a, b) => a + b, 0);
            let bars = [];
            let acc = 0;
            for (let i = 0; i < values.length; i += 1) {
                const t = values[i];
                const x1 = acc;
                const x2 = (t / total) * 100;
                acc += x2;
                bars.push({
                    ...t,
                    x1,
                    x2,
                    ratio: x2,
                    total,
                    acc,
                    name: names[i],
                    value: values[i]
                });
            }
            return bars;
        },
        hasTonality(tab){
            return !!tab.tonalities;
        },
        selectTab(actionId){
            if(actionId === this.activeTab){
                return;
            }
            this.activeTab = actionId;
            this.$emit("selectTab", actionId);
        }
  },
};
</script>

<style lang="scss" scoped>
svg{
    overflow: visible;
    background: transparent;
}
.tab-menu {
    align-items:center;
    background: #EFF2F2;
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    gap: 6px;
    justify-content: center;
    margin: 0 auto;
    padding: 6px;
    user-select: none;
    width: fit-content;
    &__item{
        border-radius: 8px;
        height: 64px;
        width: 120px;
        &__bar-border{
            stroke: #EFF2F2;
        }
        &:hover, &--selected{
            box-shadow: 0 3px 3px rgba(0,0,0,0.1);
        }
        &:hover{
            background: rgba(255, 255, 255, 0.5);
            cursor: pointer;
        }
        &--selected{
            background: white !important;
            cursor: initial !important;
            .tab-menu{
                &__item{
                    &__bar-border{
                        stroke: white;
                    }
                }
            }
        }
        
        &--tonality{
            height:76px;
        }
        &__content{
            align-items:center;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        &__name{
            font-size: 12px;
            font-weight: 400;
        }
        &__value{
            font-size: 24px;
            font-weight: 700;
        }
    }
}
</style>
