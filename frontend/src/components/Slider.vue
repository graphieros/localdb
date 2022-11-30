<template>
    <div class="slider__wrapper" :style="`width:${width}`">
        <input 
            type="range"
            class="slider__range"
            :min="min" 
            :max="max" 
            :step="step" 
            list="tickmarks" 
            v-model="value"
            @change="slide"
        >
        <datalist id="tickmarks">
            <option 
                v-for="(tick,i) in ticks" 
                :key="`tickmark_${i}`" 
                :value="tick"
                :label="i === min || i === max ? tick : ''"
            >
            </option>
        </datalist>
    </div>
</template>

<script>
export default {
    props: {
        currentValue: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 10,
        },
        min: {
            type: Number,
            default: 0,
        },
        step: {
            type: Number,
            default: 1,
        },
        width: {
            type: String,
            default: 'fit-content'
        }
    },
    data(){
        return {
            value: this.currentValue,
        }
    },
    computed: {
        ticks(){
            let ticks = [];
            for(let i = this.max; i >= this.min; i -= this.step){
                ticks.push(i);
            }
            return ticks.reverse();
        }
    },
    methods: {
        slide(){
            this.$emit("slide", this.value);
        }
    }
}
</script>

<style lang="scss" scoped>
.slider {
    &__range {
        width: 100%;
    }
    &__wrapper {
        margin: 0 auto;
    }
}
datalist {
    display: flex !important;
    align-items:center;
    justify-content: space-between;
    margin-top: -0.7em;
    padding: 0 0 0 0.2em;
    option {
        font-size: 0.8em;
    }
}
input[type=range] {
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 11px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #6376DD;
  border-radius: 50px;
  border: 1px solid #000000;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 1px #000000;
  border: 1px solid #000000;
  height: 16px;
  width: 16px;
  border-radius: 50px;
  background: #FFFFFF;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -3.5px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #6376DD;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 11px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #6376DD;
  border-radius: 50px;
  border: 1px solid #000000;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 0px 0px 1px #000000;
  border: 1px solid #000000;
  height: 16px;
  width: 16px;
  border-radius: 50px;
  background: #FFFFFF;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 11px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #6376DD;
  border: 1px solid #000000;
  border-radius: 100px;
  box-shadow: 0px 0px 0px #000000;
}
input[type=range]::-ms-fill-upper {
  background: #6376DD;
  border: 1px solid #000000;
  border-radius: 100px;
  box-shadow: 0px 0px 0px #000000;
}
input[type=range]::-ms-thumb {
  box-shadow: 0px 0px 1px #000000;
  border: 1px solid #000000;
  height: 16px;
  width: 16px;
  border-radius: 50px;
  background: #FFFFFF;
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: #6376DD;
}
input[type=range]:focus::-ms-fill-upper {
  background: #6376DD;
}
</style>