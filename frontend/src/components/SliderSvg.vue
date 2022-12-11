<template>
<div class="slider-svg__wrapper" :style="`font-family:${fontFamily}`" tabindex="0" >
    <div class="slider-svg__label__min" @click="setHandleToExtreme(min)">
        {{ min }}
    </div>
    <svg
        :width="width" 
        :height="height" 
        :viewBox="`0 0 100 ${height / width * 100}`"
        :style="styleTrack"
        class="slider-svg"
        @pointermove="getClientPosition"
        ref="sliderSvg"
        @pointerdown="moveHandle"
        @pointerover="isInFocus = true" 
        @pointerout="isInFocus = false"
    >
        <g class="slider-svg__ticks" v-if="showTicks">
            <line 
                v-for="(tick,i) in ticks" 
                :key="`tick_${i}`"
                :x1="tick"
                :x2="tick"
                :y1="((value / (max - min) )* 100) === tick ? 5 : 9"
                :y2="10"
                :stroke="((value / (max - min)) * 100) === tick ? 'grey' : '#ccc'"
                stroke-width="2"
                stroke-linecap="round"
            />
        </g>

        <g class="slider-svg__tooltip">
            <foreignObject :x="handlePosition.x - 25" :y="-23" height="20" width="50" style="background: transparent">
                <div class="slider-svg__tooltip__wrapper" :style="`font-family:${fontFamily}`">
                    {{ value }}
                </div>
            </foreignObject>
        </g>

        <g class="slider-svg__track" v-if="value > this.min">
            <rect 
                class="previous"
                :x="height / width * 100 / 2"
                :y="0"
                :width="Math.abs(handlePosition.x - (height / width * 100 / 2))"
                :height="height / width * 100"
                fill="#6376DD"
            />
            <circle 
                :cx="height / width * 100 / 2" 
                :cy="height / width * 100 / 2" 
                :r="height / width * 100 / 2" 
                fill="#6376DD"
            />
        </g>

        <g class="slider-svg__handle" v-if="handleType === 'circle'">
            <circle
                draggable="true"
                :cx="handlePosition.x" 
                :cy="handlePosition.y" 
                :r="handleSize" 
                :fill="handleColor"
                :style="styleHandle"
            />
            <circle
                :cx="handlePosition.x" 
                :cy="handlePosition.y" 
                :r="handleSize / 2" 
                fill="white"
                style="stroke: grey; stroke-width: 0.25px"
            />
        </g>
    </svg>
    <div class="slider-svg__label__max" @click="setHandleToExtreme(max)">
        {{ max }}
    </div>
</div>
    
</template>

<script>
export default {
    name: "SliderSvg",
    props: {
        cssHandle: {
            type: String,
            default: "",
        },
        cssTrack: {
            type: String,
            default: "",
        },
        fontFamily: {
            type: String,
            default: "Product Sans",
        },
        handleColor: {
            type: String,
            default: "#ccc",
        },
        handleSize: {
            type: Number,
            default: 4,
        },
        handleType: {
            type: String,
            default: "circle",
        },
        height: {
            type: Number,
            default: 10,
        },
        max: {
            type: Number,
            default: 10,
        },
        min: {
            type: Number,
            default: 10,
        },
        showTicks: {
            type: Boolean,
            default: false,
        },
        step: {
            type: Number,
            default: 1,
        },
        value: {
            type: Number,
            default: 0,
        },
        width: {
            type: Number,
            default: 100,
        }
    },
    data(){
        return {
            clientX: 0,
            isInfocus: false,
            isPointerDown: false,
        }
    },
    created(){
        document.body.onpointerdown = () => {
            if(this.isInFocus) {
                this.isPointerDown = true;
            }
        }
        document.body.onpointerup = () => {
            if(this.isInFocus){
                this.isPointerDown = false;
            }
        }
        document.addEventListener("pointermove", (e) => {
            this.clientX = e.clientX;
            if(this.isPointerDown && this.isInFocus){
                this.moveHandle();
            }
        })
    },
    destroyed(){
        document.removeEventListener("pointermove", (e) => {
            this.clientX = e.clientX;
        })
    },
    computed: {
        clientPosition(){
            const svgSlider = this.$refs.sliderSvg;
            const { left, top } = svgSlider.getBoundingClientRect();
            let position;
            switch (true) {
                case this.clientX - left < 0:
                    position = 0;
                    break;
                
                case this.clientX - left > this.width:
                    position = this.width;
                    break;

                default:
                    position = Math.round(this.clientX - left);
            }

            return position;
        },
        handlePosition(){
            const minMax = (this.max - this.min);
            const x = ((this.value - this.min) / minMax) * 100;
            const y = this.height / 4;
            return { x, y };
        },
        styleHandle(){
            if(!this.cssHandle){
                return `
                    stroke: grey;
                    stroke-width: 0.5px;
                `;
            }
            return this.cssHandle;
        },
        styleTrack(){
            if(!this.cssTrack){
                return `
                    border-radius: ${this.height}px;
                `;
            }
            return this.cssTrack;
        },
        ticks() {
            const ticks = [];
            for(let i = 0; i <= (this.max - this.min) / this.step; i += 1) {
                ticks.push(i * (this.step / (this.max - this.min)) * 100)
            }
            return ticks;
        }
    },
    methods: {
        getClientPosition(){
            
        },
        moveHandle(){
            const minMax = this.max - this.min;
            const position = Math.floor(((this.clientPosition / this.width) * minMax) / this.step) * this.step;
            this.$emit('slide', Math.round(position + this.min));
        },
        setHandleToExtreme(extremity){
            this.$emit('slide', extremity);
        }
    }
}
</script>

<style lang="scss" scoped>
svg {
    all: initial;
    border: 1px solid grey;
    overflow: visible;
}
.slider-svg {
    cursor: pointer;

    &__label {
        &__max,
        &__min {
            cursor: pointer;
            user-select: none;
            border-radius: 3px;
            padding: 0 2px;
            &:hover {
                background: rgba(0,0,0,0.05);
            }
        }
        &__max {
            text-align: left; 
        }
        &__min {
            text-align: right;
        }
    }
    &__tooltip {
        user-select: none;
        &__wrapper {
            background: white;
            width: 100%;
            text-align:center;
            font-size: 0.5em;
            box-shadow: 0 2px 3px rgba(0,0,0,0.2);
            border-radius: 3px;
            width: 1.2em;
            padding: 2px 6px;
            font-weight: bold;
            position: relative;
            margin: 0 auto;
            &:after {
                content: '';
                position: absolute;
                display: block;
                width: 0;
                z-index: 1;
                border-style: solid;
                border-color: #ffffff transparent;
                border-width: 0.6em 0.4em 0;
                bottom: -0.4em;
                left: 50%;
                margin-left: -0.36em;
            }
        }
    }
    &__wrapper {
        display: flex;
        flex-direction: row;
        align-items:center;
        justify-content:center;
        gap: 12px;
    }
}
</style>