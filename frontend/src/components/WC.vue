<template>
  <div class="word-cloud" :style="`font-family: ${fontFamily}`">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="pxwc__svg"
      :width="800"
      :viewBox="`0 0 ${width} ${height}`"
    >
      <g v-for="(word, i) in words" :key="`word_${i}`" @click="selectWord(word,i)">
        <text
          :x="word.x"
          :y="word.y"
          :font-size="selectedIndex === i ? maxFontSize : word.fontSize"
          :fill="word.color"
          :font-weight="bold ? 900 : 400"
          text-anchor="middle"

          :class="{selected: i === selectedIndex, unselected: selectedIndex !== undefined && i !== selectedIndex}"
        >
          {{ word.verbatim }}
        </text>
      </g>
        <foreignObject v-if="selectedIndex !== undefined" :x="selectedWord.x - calcTooltipWidth(selectedWord) / 2" :y="selectedWord.y - maxFontSize * 2" :height="maxFontSize" :width="calcTooltipWidth(selectedWord)">
            <div class="word-cloud__tooltip" 
              :style="
              `
              border-radius:${calcTooltipWidth(selectedWord) / 20}px; box-shadow: 0 ${calcTooltipWidth(selectedWord) / 10}px ${calcTooltipWidth(selectedWord)/5}px rgba(0,0,0,0.2); font-family:${tooltipFont};
              font-size:${maxFontSize / 2}px; 
              padding:${calcTooltipWidth(selectedWord) / 20}px ${calcTooltipWidth(selectedWord) / 5}px; 
              `
            ">
            <div class="word-cloud__tooltip__pointer">
                &#9660;
            </div>
                {{ Math.round(selectedWord.weight).toLocaleString() }}
            </div>
        </foreignObject>
    </svg>
  </div>
</template>

<script>
export default {
  name: "WordCloud",
  props: {
    bold: {
        type: Boolean,
        default: false,
    },
    dataset: {
      type: Array,
      default() {
        return [
          {
            verbatim: "Lorem",
            weight: 20,
          },
        ];
      },
    },
    fontFamily: {
        type: String,
        default: "Impact"
    },
    randomColors: {
        type: Boolean,
        default: false,
    },
    tooltipFont: {
        type: String,
        default: "Product Sans"
    }
  },
  data() {
    return {
      height: 0,
      width: 0,
      words: [],
      index: 0,
      originalWord: {},
      rowIndex: 0,
      starts: true,
      gap: 100,
      previousWord: {},
      anteWord: {},
      count: 0,
      bottomReference: 0,
      previousRow: {},
      anteRow: {},
      rowSizer: 0,
      selectedWord: {},
      selectedIndex: undefined,
      fontSizes: [],
      mult: 10000,
    };
  },
  computed: {
    sortedDataset() {
      return this.dataset.sort((a, b) => b.weight - a.weight);
    },
    max() {
      return this.sortedDataset[0].weight;
    },
    maxWordsPerRow() {
      return Math.floor(Math.sqrt(this.dataset.length/4.2));
    },
    rows() {
      const rows = [];
      for (let i = 0; i < this.dataset.length; i += 1) {
        if (i % this.maxWordsPerRow === 0) {
          rows.push([]);
        }
      }
      return rows;
    },
    maxFontSize(){
        return Math.max(...this.fontSizes);
    },
    magnitude(){
        return Math.pow(10,Math.floor(Math.log(this.max) / Math.log10(this.max)));
    }
  },
  mounted() {
    this.sortedDataset.forEach((word) => {
      this.generateCloud(word);
    });
  },
  methods: {
    calcTooltipWidth(word){
        const chars = word.verbatim.split("").length;
        return Math.sqrt(chars * this.max * this.mult);
    },
    generateCloud(word) {
      const chars = word.verbatim.split("").length;
      const wordWidth =  Math.sqrt(chars * word.weight * this.mult);
      let color = "black";
      if(this.randomColors){
        const r = Math.random()* 200;
        const g = Math.random()* 200;
        const b = Math.random()* 200;
        color = `rgb(${r},${g},${b})`;
      }
      const box = {
        x: 0,
        y: 0,
        height: ((word.weight*this.mult) / (this.max*this.mult)) * 100,
        width: wordWidth,
        fontSize: ((Math.sqrt(word.weight*this.mult) * Math.sqrt(chars)) / chars) * 2,
        color,
        ...word,
      };
      this.fontSizes.push(box.fontSize);

      if (this.starts) {
        this.width = wordWidth;
        this.height = box.fontSize;
        box.x = this.width / 2;
        box.y = box.fontSize * 0.8;
        this.originalWord = box;
        this.starts = false;
        this.nuke(box);

        return;
      }

      if (this.rowIndex === 0) {
        if (this.index % 2 === 1) {
          if (!this.anteWord.hasOwnProperty("x")) {
            box.x =
              this.originalWord.x +
              this.originalWord.width / 2 +
              wordWidth / 2 +
              box.fontSize;
            box.y =
              this.originalWord.y - (this.originalWord.height - box.height) / 4;
            this.width += wordWidth + box.fontSize;
            this.nuke(box);
            return;
          } else {
            box.x =
              this.anteWord.x +
              this.anteWord.width / 2 +
              wordWidth / 2 +
              box.fontSize;
            box.y = this.anteWord.y - (this.anteWord.height - box.height) / 4;
            this.width += wordWidth + box.fontSize;
            this.nuke(box);
            return;
          }
        } else {
          box.x = wordWidth / 2;
          box.y =
            this.originalWord.y - (this.originalWord.height - box.height) / 4;
          this.width += wordWidth + box.fontSize;
          this.words.forEach((word) => (word.x += wordWidth + box.fontSize));
          this.nuke(box);
          return;
        }
      }

      if (this.rowIndex % 2 === 1) {
        if (this.index === 0) {
            if(this.rowIndex === 1){
                box.x = this.originalWord.x;
                box.y = box.height/2 + box.fontSize;
                this.words.forEach(
                (word) => (word.y +=  box.height + box.fontSize)
                );
                this.nuke(box);
                return;
            }
            box.x = this.originalWord.x;
            box.y = box.height + box.fontSize;
            this.height += box.height * 2 + box.fontSize;
            this.words.forEach(
              (word) => (word.y += box.height + box.fontSize)
            );
            this.nuke(box);
            return;
        } else {
            if(this.index % 2 === 1){
                if(this.anteWord.hasOwnProperty("x")){
                    box.x = this.anteWord.x + this.anteWord.width / 2 + wordWidth / 2 + box.fontSize;
                    box.y = this.anteWord.y - (this.anteWord.height - box.height) /4;
                }else{
                    box.x = this.previousWord.x + this.previousWord.width / 2 + wordWidth / 2 + box.fontSize;
                    box.y = this.previousWord.y - (this.previousWord.height - box.height) /4;
                }
                this.nuke(box);
                return;
            }else{
                box.x = this.anteWord.x - this.anteWord.width / 2 - wordWidth / 2 - box.fontSize;
                box.y = this.anteWord.y - (this.anteWord.height - box.height) /4;
                this.nuke(box);
                return;
            }
        }
      }

      if(this.rowIndex % 2 === 0){
        if(this.index === 0){
            if(this.anteRow.hasOwnProperty("x")){
                box.x = this.originalWord.x;
                box.y = this.anteRow.y + this.anteRow.height/2 + box.height/2 + box.fontSize;
            }else{
                box.x = this.originalWord.x;
                box.y = this.originalWord.y + this.originalWord.height/2 + box.height/2 + box.fontSize;
            }
            
            this.height += box.height + box.fontSize;
            this.nuke(box);
            return;
        }else{
            if(this.index % 2 === 1){
                if(this.anteWord.hasOwnProperty("x")){
                    box.x = this.anteWord.x + this.anteWord.width / 2 + wordWidth / 2 + box.fontSize;
                    box.y = this.anteWord.y - (this.anteWord.height - box.height) /4;
                }else{
                    box.x = this.previousWord.x + this.previousWord.width / 2 + wordWidth / 2 + box.fontSize;
                    box.y = this.previousWord.y - (this.previousWord.height - box.height) /4;
                }
                this.nuke(box);
                return;
            }else{
                box.x = this.anteWord.x - this.anteWord.width / 2 - wordWidth / 2 - box.fontSize;
                box.y = this.anteWord.y - (this.anteWord.height - box.height) /4;
                this.nuke(box);
                return;
            }
        }
      }
    },
    nuke(box) {
      this.anteWord = this.previousWord;
      this.previousWord = box;

      if (this.index > this.maxWordsPerRow) {
        this.anteRow = this.previousRow;
        this.previousRow = box;
        this.previousWord = {};
        this.anteWord = {};
        this.index = 0;
        this.rowIndex += 1
      } else {
        this.index += 1;
      }
      // add word
      this.words.push(box);
      this.count += 1;
      if(this.count === this.dataset.length){
        // add padding
        this.width += this.magnitude;
        this.height += this.magnitude;
        this.words.forEach(word => {
            word.x += this.magnitude / 2;
            word.y += this.magnitude / 2;
        })
      }
    },
    selectWord(word,index){
        if(this.selectedIndex === undefined || (this.selectedIndex !== undefined && this.selectedIndex !== index)){
            this.selectedWord = word;
            this.selectedIndex = index;
        }else{
            this.selectedIndex = undefined;
        }
        
    }
  },
};
</script>

<style lang="scss" scoped>
* {
    transition: all 0.15s ease-in-out;
}
.word-cloud{
    user-select: none;
    &__tooltip{
        width: 100%;
        text-align:center;
        background: white;
        width: fit-content;
        margin: 0 auto;
        font-weight: bold;
        position: relative;
        &__pointer{
            position: absolute;
            left: 50%;
            top: 100%;
            transform: translate(-50%, -40%);
            color: white;
            font-size: 1em;
        }
    }
}
svg {
  background: white;
  padding: 80px;
  overflow: visible;
}
.word {
  color: black;
  font-size: 2em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
text{
    cursor: pointer;
}
foreignObject {
  overflow: visible;
  color: black !important;
  position: relative;
}
.selected{
    opacity: 1;
}
.unselected {
    opacity:0.2;
}
</style>
