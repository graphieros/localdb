<template>
  <div class="waffle-face">
    <svg :height="height" :width="width" :viewBox="`0 0 ${width} ${height}`" :style="`padding: ${height/10}px ${width/10}px`">
        <g v-for="(row,i) in 10" :key="`row_${i}`">
            <g v-for="(col,j) in 10" :key="`col_${j}_${i}`">
                <!-- i for y; j for x -->
                <!-- i for dataset target  -->
               
                <!-- <text :x="(width/10 * j) + width/20" :y="(height/10*i) + height/20" text-anchor="middle" fill="black" font-size="12px">
                    {{ Number(`${i}${j}`) }}
                </text> -->
                <foreignObject :height="height/10" :width="width/10" :x="(width/10 * j)" :y="(height/10*i)" v-html="chooseIconFromIndex(Number(`${i}${j}`)+1).icon" :class="`waffle-face__icon ${chooseIconFromIndex(Number(`${i}${j}`)+1).cls}`">
                </foreignObject>
            </g>
        </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "WaffleFace",
  props: {
    dataset: {
        type: Array,
        default(){
            return [
                {
                    name: "Happy",
                    value: 100
                },
                {
                    name: "Neutral",
                    value: 200
                },
                {
                    name: "Sad",
                    value: 150,
                }
            ]
        }
    },
    height: {
        type: Number,
        default: 400,
    },
    width: {
        type: Number,
        default: 400,
    }
  },
  data() {
    return {
        icons: {
            happy: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#15B300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
            neutral: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
            sad: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F17171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
        }
    };
  },
  computed: {
    agglomerated(){
        let base = 100;
        const total = this.dataset.map((serie) => serie.value).reduce((a,b) => a + b, 0);
        const ratios = this.dataset.map((serie, i) => {
            const ratio = Math.round(serie.value / total * 100);
            base -= ratio;
            return {
                ...serie,
                ratio,
                agglo: base 
            }
        });
        const totalRatios = [...ratios].map((serie) => serie.ratio).reduce((a,b) => a + b, 0);
        if(totalRatios < 100){
            ratios[0].ratio += Math.round(100 - totalRatios);
            ratios[ratios.length - 1].ratio = 0;
        }
        return ratios;
    }
  },
  methods: {
    chooseIconFromIndex(index){
        let icon, cls;
        if(index >= this.agglomerated[2].agglo && index < this.agglomerated[1].agglo){
            icon = this.icons.sad;
            cls = "waffle-face__icon__sad"
        }else if(index >= this.agglomerated[1].agglo && index < this.agglomerated[0].agglo){
            icon =  this.icons.neutral;
            cls = "waffle-face__icon__neutral"
        }else{
            icon = this.icons.happy;
            cls = "waffle-face__icon__happy"
        }
        return {
            icon,
            cls
        }
    }
  },
};
</script>

<style lang="scss" scoped>
svg{
    background: white;
    overflow: visible;
}
.waffle-face{
    &__icon{
        border-radius: 50%;
        &__sad{
           /** */
        }
        &__neutral{
           /** */   
        }
        &__happy{
           /** */
        }
    }
}
</style>
