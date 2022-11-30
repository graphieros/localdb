<template>
<div class="slider-svg__wrapper" :style="`font-family:${fontFamily}`">
    <div class="slider-svg__label__min">
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
    >
        <g class="slider-svg__tooltip">
            <foreignObject :x="handlePosition.x - 25" :y="-23" height="20" width="50" style="background: radial-gradient(white, transparent);">
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
        </g>
    </svg>
    <div class="slider-svg__label__max">
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
            isPointerDown: false,
        }
    },
    created(){
        document.body.onpointerdown = () => {
            this.isPointerDown = true;
        }
        document.body.onpointerup = () => {
            this.isPointerDown = false;
        }
        document.addEventListener("pointermove", (e) => {
            this.clientX = e.clientX;
            if(this.isPointerDown){
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
        }
    },
    methods: {
        getClientPosition(){
            
        },
        moveHandle(){
            const minMax = this.max - this.min;
            const position = (this.clientPosition / this.width) * minMax;
            this.$emit('slide', Math.round(position + this.min));
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
            user-select: none;
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
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
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