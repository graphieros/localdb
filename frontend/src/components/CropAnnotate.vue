<template>
    <div>
        <button v-if="!isActive" class="alp-crop-annotate__starter" @click="isActive = !isActive" data-html2canvas-ignore>
            {{ isActive ? 'deactivate' : 'click to annotate' }}
        </button>
        
    <div v-show="isActive" style="height:100%; width: 100%; z-index:2147483647; position: fixed; top:0; left:0;" ref="alpCropAnnotateWrapper">
        <div 
            class="alp-crop-annotate__overlay" 
            ref="alpCropAnnotateOverlay"
            @mousedown="dragMouse($event)"
            @mousemove="moveMouse($event)"
            @mouseup="stopMouse($event)"
            :style="isModal ? 'background: radial-gradient(transparent, rgba(0,0,0,0.3));' : 'background: transparent;'"
        >
        </div>
        
        <button class="alp-crop-annotate__starter" @click="isActive = !isActive" data-html2canvas-ignore>
            {{ isActive ? 'deactivate' : 'click to annotate' }}
        </button>
        <div class="alp-crop-annotate__selection" ref="alpCropAnnotateSelection" :style="`opacity: ${isModal ? 0 : 1}; border:${selectionHasBorder ? '2px dashed grey' : 'none !important'}`"></div>
        <div v-show="isModal" class="alp-crop-annotate__modal">
            <button v-if="!isLoading" @click="closeModal">CLOSE</button>
            <div v-if="isLoading" data-html2canvas-ignore>
            LOADING CONTENT...
        </div>
            <SvgAnnotator v-show="!isLoading" @interface="getInterface">
             <section style="color: black; width: fit-content; height: fit-content" ref="selectionContent">
             </section>
            </SvgAnnotator>
        </div>
    </div>
    </div>
    
</template>

<script>
import SvgAnnotator from "svg-annotator";
import html2canvas from "html2canvas";

export default {
    components: {
        SvgAnnotator
    },
    props: {},
    data(){
        return {
            annotatorInterface: {
                reset: () => {}
            },
            isActive: false,
            isDragging: false,
            isLoading: false,
            isModal: false,
            startX: 0,
            startY: 0,
            selection: null,
            selectionHasBorder: true,
            selectionWidth: 0,
            selectionHeight: 0,
            croppedCanvas: null,
        }
    },
    mounted(){
        this.selection = this.$refs.alpCropAnnotateSelection;
    },
    methods: {
        captureSelection() {
            const selectionContent = this.$refs.selectionContent;
            const wrapper = this.$refs.alpCropAnnotateWrapper;
            const pageHeight = document.body.scrollHeight;
            console.log({pageHeight});
            console.log(window.scrollY);
            html2canvas(document.body, {
                allowTaint: true,
                useCORS: true,
                scale: 1,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
            }).then((canvas) => {
                // const top = this.selection.offsetTop;
                // const left = this.selection.offsetLeft;
                const imageData = canvas.getContext("2d").getImageData(this.startX, this.startY, this.selectionWidth, this.selectionHeight);
                this.croppedCanvas = document.createElement("canvas");
                this.croppedCanvas.height = this.selectionHeight;
                this.croppedCanvas.width = this.selectionWidth;
                this.croppedCanvas.getContext("2d").putImageData(imageData, 0, 0);
                selectionContent.innerHTML = "";
                selectionContent.appendChild(this.croppedCanvas);
            }).finally(() => {
                this.isLoading = false;
            });
        },
        dragMouse(e){
            if(!this.isActive || this.isModal) return;
            this.selection.style.display = "initial";
            this.isDragging = true;
            this.startX = e.pageX;
            this.startY = e.pageY;
        },
        moveMouse(e) {
            if (!this.isDragging || !this.isActive || this.isModal) return;
            this.selectionWidth = this.startX < e.pageX ? e.pageX - this.startX : this.startX - e.pageX;
            this.selectionHeight = this.startY < e.pageY ? e.pageY - this.startY : this.startY - e.pageY;
            const left = this.startX < e.pageX ? this.startX - window.scrollX : e.pageX - window.scrollX;
            const top = this.startY < e.pageY ? this.startY - window.scrollY : e.pageY - window.scrollY;
            this.setSelection({
                height: this.selectionHeight,
                width: this.selectionWidth,
                top,
                left
            });
        },
        stopMouse(){
            if(this.isModal) return;
            this.isDragging = false;
            this.setSelectionBorder(false);
            this.isLoading = true;
            this.$nextTick(() => {
                this.captureSelection();
                this.isModal = true;
            })
        },
        setSelectionBorder(isVisible){
            this.selectionHasBorder = isVisible;
        },
        closeModal(){
            this.selection.style.display = "none";
            this.setSelection({
                top:0,
                left:0,
                height:0,
                width:0,
            });
            this.setSelectionBorder(true);
            this.resetAnnotator();
            const selectionContent = this.$refs.selectionContent;
            selectionContent.removeChild(this.croppedCanvas);
            this.isModal = false;
        },
        setSelection({top, left, width, height}) {
            this.selection.style.top = `${top}px`;
            this.selection.style.left = `${left}px`;
            this.selection.style.width = `${width}px`;
            this.selection.style.height = `${height}px`;
        },
        getInterface(payload) {
            this.$options.annotatorInterface = payload;
        },
        resetAnnotator() {
            this.$options.annotatorInterface.reset();
        }
    }

}
</script>

<style lang="scss">

.alp-crop-annotate {
    position: relative;
    &__starter {
        border-radius: 0 0 0 3px;
        border: 1px solid grey;
        position: fixed;
        right:0;
        top: 0;
        padding: 12px;
    }
    &__overlay {
        height: 100%;
        left: 0;
        position: fixed;
        top:0;
        width: 100%;
    }
    &__selection {
        position: fixed;
        border: 1px dashed grey;
        pointer-events: none;
    }
    &__modal {
        position: absolute;
        top: 50%;
        left: 50%;
        max-height: calc(100vh - 48px);
        max-width: calc(100vw - 48px);
        overflow: auto;
        transform: translate(-50%,-50%);
        background: white;
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 12px 24px -12px rgba(0,0,0,0.1);
    }
}

</style>