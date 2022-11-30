<template>
<div> 
    <div>
        {{ activeShape }}
        <details>
            <summary>Tools</summary>

            <div class="tool-selection">
                <!-- DELETE -->
                <button :class="{'button-tool': true, 'button-tool--selected': isDeleteMode}" @click="isDeleteMode = !isDeleteMode; isMoveMode = false; isResizeMode = false; isTextMode = false; activeShape = undefined">
                    <svg style="width:24px;height:24px; margin-bottom: -4px;" viewBox="0 0 24 24">
                        <path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
                    </svg>
                </button>

                <!-- MOVE -->
                <button :class="{'button-tool': true, 'button-tool--selected': isMoveMode}" @click="isMoveMode = !isMoveMode; activeShape = undefined; isDeleteMode = false; isDrawMode = false; isResizeMode = false; isTextMode = false">
                    <svg style="width:24px;height:24px; margin-bottom:-7px" viewBox="0 0 24 24">
                        <path d="M13,11H18L16.5,9.5L17.92,8.08L21.84,12L17.92,15.92L16.5,14.5L18,13H13V18L14.5,16.5L15.92,17.92L12,21.84L8.08,17.92L9.5,16.5L11,18V13H6L7.5,14.5L6.08,15.92L2.16,12L6.08,8.08L7.5,9.5L6,11H11V6L9.5,7.5L8.08,6.08L12,2.16L15.92,6.08L14.5,7.5L13,6V11Z" />
                    </svg>
                </button>

                <!-- RESIZE -->
                <button :class="{'button-tool': true, 'button-tool--selected': isResizeMode}" @click="isResizeMode = !isResizeMode; isMoveMode = false; isDeleteMode = false; isDrawMode = false; isTextMode = false; activeShape = undefined">
                    <svg style="width:24px;height:24px; margin-bottom: -7px;" viewBox="0 0 24 24">
                        <path d="M23,15H21V17H23V15M23,11H21V13H23V11M23,19H21V21C22,21 23,20 23,19M15,3H13V5H15V3M23,7H21V9H23V7M21,3V5H23C23,4 22,3 21,3M3,21H11V15H1V19A2,2 0 0,0 3,21M3,7H1V9H3V7M15,19H13V21H15V19M19,3H17V5H19V3M19,19H17V21H19V19M3,3C2,3 1,4 1,5H3V3M3,11H1V13H3V11M11,3H9V5H11V3M7,3H5V5H7V3Z" />
                    </svg>
                </button>

                <!-- TEXT -->
                <button :class="{'button-tool': true, 'button-tool--selected': isTextMode}" @click="isTextMode = !isTextMode; isDeleteMode = false; isMoveMode = false; isResizeMode = false; isDrawMode = false; activeShape = undefined">
                    <svg style="width:24px;height:24px; margin-bottom: -7px;" viewBox="0 0 24 24">
                        <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
                    </svg>
                </button>
            </div>

            <div class="tool-selection">
                <button :class="{'button-tool': true, 'button-tool--selected': activeShape === 'circle'}" @click="setShapeTo('circle')">
                    <svg viewBox="0 0 12 12" height="40px" width="40px">
                        <circle :cx="6" :cy="6" r="4" :fill="options.circle.filled ? activeShape==='circle' ? 'white' : 'grey' : 'none'" stroke="grey"></circle>
                    </svg>
                </button>
                <div class="tool-input" v-if="activeShape === 'circle'">
                    <label for="circleRadius">Circle radius</label>
                    <input type="number" id="circleRadius" v-model="options.circle.radius">
                </div>
                <div class="tool-input" v-if="activeShape === 'circle'">
                    <label for="circleFill">Filled</label>
                    <input type="checkbox" v-model="options.circle.filled" :checked="options.circle.filled"> 
                </div>

                <button :class="{'button-tool': true, 'button-tool--selected': activeShape === 'rect'}" @click="setShapeTo('rect')">
                    <svg viewBox="0 0 12 12" height="40px" width="40px">
                        <rect x="3" y="3" height="6" width="6" :fill="options.rect.filled ? activeShape==='rect' ? 'white' : 'grey' : 'none'" stroke="grey" />
                    </svg>
                </button>
                <div class="tool-input" v-if="activeShape === 'rect'">
                    <label for="rectFill">Filled</label>
                    <input id="rectFill" type="checkbox" v-model="options.rect.filled" :checked="options.rect.filled"> 
                </div>
                
            </div>
           
        </details>
        x:{{ Math.round(pointerPosition.x) }}  y:{{ Math.round(pointerPosition.y) }}
    </div>
    <svg 
        :key="step" 
        ref="mainSvg" 
        class="draw"
        :style="`cursor:${cursorClass};`" 
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`" 
        width="100%" 
        @pointerdown="chooseAction($event)"
        @pointerup="resetDraw" 
        @pointermove="setPointer($event); chooseMove($event)"
        @click="clickSvg($event)"
        @onkeypress="write($event)"
    >
        <g v-for="(shape,i) in userShapes" :key="`shape_${i}`" :id="shape.id" v-html="shape" @click="deleteShape($event); isMoveMode = false"></g>
    </svg>
</div>
</template>

<script>
export default {
    props:{},
    data(){
        return {
            activeShape: undefined,
            currentPointer: {
                start: {
                    x: 0,
                    y:0,
                },
                end: {
                    x: 0,
                    end: 0,
                }
            },
            cursorClass: 'default',
            currentTarget: undefined,
            isDeleteMode: false,
            isDrawMode: false,
            isMoveMode: false,
            isMouseDown: false,
            isResizeMode: false,
            isTextMode: false,
            isDrawing: false,
            isWriting: false,
            pointerDownId: -1,
            pointerPosition: {
                x:0,
                y:0
            },
            shapes: [],
            step:0,
            svgHeight: 1000,
            svgWidth: 1000,
            options: {
                circle: {
                    color: "grey",
                    filled: false,
                    radius: 3,
                    strokeWidth: 2,
                },
                rect: {
                    color: "grey",
                    filled: false,
                    strokeWidth: 2,
                    height: 12,
                    width: 12,
                }
            }
        }
    },
    computed: {
        records(){
            return this.shapes;
        },
        userShapes(){
            return this.records.map(shape => {
                switch (true) {
                    case shape && shape.type === "circle":
                        return `<circle id="${shape.id}" cx="${shape.x}" cy="${shape.y}" r="${shape.circleRadius}" fill="${shape.circleFilled ? shape.circleColor : 'rgba(255,255,255,0.001)'}" stroke="${shape.circleColor}" stroke-width="${shape.circleStrokeWidth}"></circle>`;

                    case shape && shape.type === "rect":
                        return `<rect id="${shape.id}" x="${shape.x}" y="${shape.y}" fill="${shape.rectFilled ? shape.rectColor: 'rgba(255,255,255,0.001)'}" height="${shape.rectHeight}" width="${shape.rectWidth}" stroke="${shape.rectColor}" stroke-width="${shape.rectStrokeWidth}"></rect>`;

                    case shape && shape.type === "text":
                        return `<text x="${shape.x}" y="${shape.y}" text-anchor="middle">${shape.textContent}</text>`
            
                    default:
                        break;
                }
            })
        }
    },
    methods:{
        clickSvg(e){
            this.isWriting = !this.isWriting;

            if(!this.isWriting){
                return;
            }

            if(this.isWriting){
                let id = `text_${Math.random()*10000}_${Math.random()*99999}`;
                this.shapes.push({
                    id,
                    type: "text",
                    x: this.pointerPosition.x,
                    y: this.pointerPosition.y,
                    textContent: "|"
                });
            }
        },
        write(e){
            e.preventDefault();
            console.log(e.key)
            
            if(!this.isWriting){
                return;
            }
            const text = this.shapes.at(-1);
            if(text.type !== "text"){
                return;
            }
            console.log(e);

            text.textContent === e

        },
        chooseAction(e){
            this.isMouseDown = true;
            switch (true) {
                case this.isDrawMode:
                    this.drawDown();
                    break;
            
                default:
                    break;
            }
        },
        chooseMove(e){
            this.currentTarget = e.target;
            this.cursorClass = "move";
            switch(true){
                case this.isMoveMode && this.isMouseDown:
                    this.moveDown();
                    break;

                case this.isResizeMode && this.isMouseDown:
                    this.resize();
                    break;    

                default: break;
            }
        },
        copy(source){
            return JSON.parse(JSON.stringify(source));
        },
        deleteShape(e){
            if(!this.isDeleteMode){
                return;
            }
            const shapeId = e.target.id;
            this.shapes = [...this.shapes].filter((shape) => shape.id !== shapeId);
        },
        drawUp(){
            if(!this.activeShape || !this.isDrawing){
                return;
            }
            this.currentPointer.end = {
                x: this.pointerPosition.x,
                y: this.pointerPosition.y
            };
            const max = Math.max(this.currentPointer.end.x, this.currentPointer.start.x);
            const min = Math.min(this.currentPointer.end.x, this.currentPointer.start.x);
            switch (true) {
                case this.activeShape === "circle":
                    this.shapes.at(-1).circleRadius = this.copy(max - min);
                    break;

                case this.activeShape === "rect":
                    this.shapes.at(-1).rectWidth = this.copy(max - min);
                    this.shapes.at(-1).rectHeight = this.copy(max - min);
            
                default:
                    break;
            }
        },
        drawDown(){
             this.isDrawing = true;
            if(!this.activeShape){
                return;
            }
            if(!this.isDrawing){
                return;
            }
            this.currentPointer.start = {
                x: this.pointerPosition.x,
                y: this.pointerPosition.y,
            }
            let id = `${this.activeShape}_${Math.random()*10000}_${Math.random()*99999}`;

            switch (true) {
                case this.activeShape === 'circle':
                    this.shapes.push({
                        id,
                        circleColor: this.copy(this.options.circle.color),
                        circleFilled: this.copy(this.options.circle.filled),
                        circleRadius: this.copy(this.options.circle.radius),
                        circleStrokeWidth: this.copy(this.options.circle.strokeWidth),
                        type: this.activeShape,
                        x: this.pointerPosition.x,
                        y: this.pointerPosition.y
                    });
                    break;

                case this.activeShape === 'rect':
                    this.shapes.push({
                        id,
                        rectColor: this.copy(this.options.rect.color),
                        rectFilled: this.copy(this.options.rect.filled),
                        rectStrokeWidth: this.copy(this.options.rect.strokeWidth),
                        rectHeight: this.copy(this.options.rect.height),
                        rectWidth: this.copy(this.options.rect.width),
                        type: this.activeShape,
                        x: this.pointerPosition.x,
                        y: this.pointerPosition.y
                    });
                    break;
            
                default:
                    break;
            }

            
            if(this.pointerDownId !== -1){
                clearInterval(this.pointerDownId);
                this.pointerDownId = -1;
            }

            if(this.pointerDownId === -1){
                this.pointerDownId = setInterval(this.drawUp, 10)
            }
            this.step += 1;
        },
        move(shape){
            switch (true) {
                case shape.type === 'circle':
                    shape.x = this.copy(this.pointerPosition.x);
                    shape.y = this.copy(this.pointerPosition.y);
                    break;
                
                case shape.type === 'rect':
                    shape.x = this.copy(this.pointerPosition.x - shape.rectWidth / 2);
                    shape.y = this.copy(this.pointerPosition.y - shape.rectHeight / 2);
            
                default:
                    break;
            }
        },
        moveDown(){
            const shapeId = this.currentTarget.id;
            const shape = this.shapes.find(shape => shape.id === shapeId);
            this.shapes = this.shapes.filter(el => el.id !== shapeId);
            this.shapes.push(shape);

            if(this.pointerDownId !== -1){
                clearInterval(this.pointerDownId);
                this.pointerDownId = -1;
            }
            if(this.pointerDownId === -1 && shapeId){
                this.pointerDownId = setInterval(this.move(shape), 1)
            }
        },
        resetDraw(){
            this.isDrawing = false;
            this.isMouseDown = false;
            this.cursorClass = 'default';
            this.pointerDownId = -1;
        },
        resize(){
            const shapeId = this.currentTarget.id;
            if(!shapeId){
                return;
            }
            const shape = this.shapes.find(shape => shape.id === shapeId);
            this.shapes = this.shapes.filter(el => el.id !== shapeId);
            this.shapes.push(shape);

            switch (true) {
                case shape.type === 'circle':
                    const currentRadius = shape.circleRadius;
                    const radius = this.copy(Math.abs(this.pointerPosition.x - shape.x));

                    shape.circleRadius = radius > 6 ? radius : 6;
                    break;
            
                default:
                    return;
            }
        },
        setPointer(e) {
            const mainSvg = this.$refs.mainSvg;
            const rect = mainSvg.getBoundingClientRect();
            this.pointerPosition.x = (e.clientX - rect.left) / rect.width * this.svgWidth;
            this.pointerPosition.y = (e.clientY - rect.top) / rect.height * this.svgHeight;
        },
        setShapeTo(shape){
            if(shape === this.activeShape){
                this.activeShape = undefined;
                this.isDrawMode = false;
                return;
            }
            this.isDrawMode = true;
            this.isDeleteMode = false;
            this.isMoveMode = false;
            this.isResizeMode = false;
            this.isTextMode = false;
            this.activeShape = shape;
        }
    }
}
</script>

<style lang="scss" scoped>
button.button-tool {
    height: 40px;
    width: 40px;
    border: 1px solid grey;
    border-radius: 3px;
    box-shadow: 0 3px 6px -3px grey;
    opacity:0.9;
    &:hover {
        opacity: 1;
    }
    &--selected {
        background: #ccc;
        border: 1px solid rgb(42, 42, 42);
        svg {
            background: #ccc;
        }
        circle {
            stroke: white;
        }
        path {
            fill: white;
        }
    }
}
.tool-selection {
    display: flex;
    flex-wrap: wrap;
    align-items:center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #ccc;
}
.tool-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
        background: white;
        padding: 3px;
        border-radius: 3px;
        width: 40px;
    }
    label {
        font-size: 0.6em;
    }
}
</style>