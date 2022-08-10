<template>
  <div class="word-cloud" :style="`font-family: ${fontFamily}`">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      :viewBox="`0 0 ${width} ${height}`"
      class="main"
    >
      <g
        v-for="(word, i) in words"
        :key="`word_${i}`"
        @click="selectWord(word, i)"
      >

        <!-- VERBATIM --->
        <text
          :x="word.x"
          :y="word.y"
          :font-size="selectedIndex === i ? maxFontSize : word.fontSize"
          :fill="
            selectedIndex === i && monochrome
              ? dark
                ? 'white'
                : 'black'
              : word.color
          "
          :font-weight="bold ? 900 : 400"
          text-anchor="middle"
          :class="{
            selected: i === selectedIndex,
            unselected: selectedIndex !== undefined && i !== selectedIndex,
          }"
        >
          {{ word.verbatim }}
        </text>

        <!-- BAR CHART UNSELECTED STATE -->
        <foreignObject
          v-if="showTonality && selectedIndex !== i"
          :x="word.x - height / 8"
          :y="word.y + word.fontSize / 10"
          height="20px"
          :width="height / 4"
          :class="{
            selected: i === selectedIndex,
            unselected: selectedIndex !== undefined && i !== selectedIndex,
          }"
        >
          <!-- BARS -->
          <svg width="100%" :viewBox="`0 0 100 10`" class="sentiment">
            <g v-for="(tonality, k) in word.tonality"
                :key="`tonality_selected_${k}`">

                <line
                  :stroke-width="10"
                  :stroke="getTonality(word, k).color"
                  :x1="getTonality(word, k).x1"
                  y1="5"
                  :x2="(getTonality(word, k).acc)"
                  y2="5"
                />
              </g>
          </svg>

        </foreignObject>
      </g>

      <!-- TOOLTIP -->
      <foreignObject
        v-if="selectedIndex !== undefined"
        :x="selectedWord.x - calcTooltipWidth(selectedWord) / 2"
        :y="selectedWord.y - maxFontSize * 2.2"
        :height="maxFontSize"
        :width="calcTooltipWidth(selectedWord)"
      >
        <div
          class="word-cloud__tooltip"
          :style="`
              border-radius:${calcTooltipWidth(selectedWord) / 20}px; 
              box-shadow: 0 ${calcTooltipWidth(selectedWord) / 10}px ${
            calcTooltipWidth(selectedWord) / 5
          }px rgba(0,0,0,0.2); 
              font-family:${tooltipFont};
              font-size:${maxFontSize / 2}px; 
              padding:${calcTooltipWidth(selectedWord) / 20}px ${
            calcTooltipWidth(selectedWord) / 5
          }px; 
              `"
        >
          <div class="word-cloud__tooltip__pointer">&#9660;</div>
          {{ Math.round(selectedWord.weight).toLocaleString() }}
        </div>
      </foreignObject>

      <!-- BAR CHART SELECTED STATE -->
      <foreignObject
          v-if="showTonality && selectedWord.hasOwnProperty('x') && selectedIndex !== undefined"
          :x="selectedWord.x - width / 7.55"
          :y=" selectedWord.y + height/10"
          height="20px"
          :width="height / 1.5"
          :class="{
            selected: true,
          }"
        >
          <!-- BARS -->
          <svg :height=" height/ 15" :width="height / 1.5" :viewBox="`0 0 100 10`" class="sentiment">
            <g v-for="(tonality, k) in selectedWord.tonality"
                :key="`tonality_selected_${k}`">

                <line
                  :stroke-width="10"
                  :stroke="getTonality(selectedWord, k).color"
                  :x1="getTonality(selectedWord, k).x1"
                  y1="5"
                  :x2="(getTonality(selectedWord, k).acc)"
                  y2="5"
                />
              </g>
          </svg>

          <!-- LEGEND -->
          <div class="word-cloud__selected__legend">
            <div v-for="(tonality, k) in selectedWord.tonality"
              :key="`tonality_legend_${k}`"
              class="word-cloud__selected__tonality-wrapper" 
              :style="`font-family:${tooltipFont}; color:${tonality.color};`
            ">
              <div class="word-cloud__selected__tonality">
                <span>
                  {{ (tonality.value / getTonality(selectedWord,k).total * 100).toFixed(0)}}%
                </span>
                <span style="font-size: 0.8em;">
                  ( {{ tonality.value}} )
                </span>
              </div>
            </div>
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
      default: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    dataset: {
      /**
       * To display a bar chart under each word:
       * 1. set the showTonality prop to true
       * 2. make sure your dataset has a tonality array with sentiment, value and color
       */
      type: Array,
      default() {
        return [
          {
            verbatim: "Lorem",
            weight: 20,
            tonality: [
              {
                sentiment: "happy",
                value: 5,
                color: "#15B300"
              },
              {
                sentiment: "neutral",
                value: 5,
                color: "#C4C4C4"
              },
              {
                sentiment: "sad",
                value: 5,
                color: "#F17171"
              },
            ],
          },
          {
            verbatim: "Ipsum",
            weight: 25,
            tonality: [
              {
                sentiment: "happy",
                value: 15,
                color: "#15B300"
              },
              {
                sentiment: "neutral",
                value: 5,
                color: "#C4C4C4"
              },
              {
                sentiment: "sad",
                value: 5,
                color: "#F17171"
              },
            ],
          },
          {
            verbatim: "Dolor",
            weight: 13,
            tonality: [
              {
                sentiment: "happy",
                value: 2,
                color: "#15B300"
              },
              {
                sentiment: "neutral",
                value: 4,
                color: "#C4C4C4"
              },
              {
                sentiment: "sad",
                value: 7,
                color: "#F17171"
              },
            ],
          },
          {
            verbatim: "Amet",
            weight: 6,
            tonality: [
              {
                sentiment: "happy",
                value: 2,
                color: "#15B300"
              },
              {
                sentiment: "neutral",
                value: 2,
                color: "#C4C4C4"
              },
              {
                sentiment: "sad",
                value: 2,
                color: "#F17171"
              },
            ],
          },
          {
            verbatim: "Consectetur",
            weight: 9,
            tonality: [
              {
                sentiment: "happy",
                value: 3,
                color: "#15B300"
              },
              {
                sentiment: "neutral",
                value: 5,
                color: "#C4C4C4"
              },
              {
                sentiment: "sad",
                value: 1,
                color: "#F17171"
              },
            ],
          },
        ];
      },
    },
    demo: {
      type: Boolean,
      default: false,
    },
    fontFamily: {
      type: String,
      default: "Product Sans",
    },
    // Limit the number of words to be displayed
    limit: {
      type: Number,
      default: 50
    },
    monochrome: {
      type: Boolean,
      default: false,
    },
    monochromeColor: {
      type: String,
      default: "#6376DD",
    },
    randomColors: {
      type: Boolean,
      default: true,
    },
    // Set to true only if data points have a tonality array
    showTonality: {
      type: Boolean,
      default: false,
    },
    tooltipFont: {
      type: String,
      default: "Product Sans",
    },
  },
  data() {
    return {
      activeDemo: false,
      anteRow: {},
      anteWord: {},
      bottomReference: 0,
      count: 0,
      fontSizes: [],
      gap: 100,
      height: 0,
      index: 0,
      mult: 10000,
      originalWord: {},
      previousRow: {},
      previousWord: {},
      rowIndex: 0,
      rowSizer: 0,
      selectedIndex: undefined,
      selectedWord: {},
      starts: true,
      width: 0,
      words: [],
    };
  },
  computed: {
    magnitude() {
      return Math.pow(
        10,
        Math.floor(Math.log(this.max) / Math.log10(this.max))
      );
    },
    max() {
      return this.sortedDataset[0].weight;
    },
    maxFontSize() {
      return Math.max(...this.fontSizes);
    },
    maxWordsPerRow() {
      return Math.floor(Math.sqrt(this.sortedDataset.length / 4.2));
    },
    rows() {
      const rows = [];
      for (let i = 0; i < this.sortedDataset.length; i += 1) {
        if (i % this.maxWordsPerRow === 0) {
          rows.push([]);
        }
      }
      return rows;
    },
    sortedDataset() {
      return this.dataset.sort((a, b) => b.weight - a.weight).slice(0, this.limit);
    },
  },
  created() {
    setTimeout(() => {
      this.sortedDataset.forEach((word) => {
        this.generateCloud(word);
      });
    },300);

    if(this.demo){
      this.activeDemo = true;
      this.playDemo();
    }
  },
  methods: {
    playDemo() {
      if (!this.activeDemo) {
        return;
      }
      let randomIndex = Math.round(Math.random() * this.sortedDataset.length);
      if (this.selectedIndex === randomIndex) {
        randomIndex = 0;
      }
      this.selectedIndex = randomIndex;
      this.selectedWord = this.words[randomIndex];

      setTimeout(this.playDemo, 1000);
    },
    calcTooltipWidth(word) {
      const chars = word.verbatim.split("").length;
      return Math.sqrt(chars * this.max * this.mult);
    },
    generateCloud(word) {
      const chars = word.verbatim.split("").length;
      const wordWidth = Math.sqrt(chars * word.weight * this.mult);
      let color = "black";
      if (this.monochrome) {
        let colorRatio = this.dark
          ? word.weight / this.max
          : 1 - word.weight / this.max;
        if (!this.dark && colorRatio > 0.6) {
          colorRatio = 0.6;
        }
        color = this.pSBC(colorRatio, this.monochromeColor);
      } else if (this.randomColors) {
        const r = Math.random() * 200;
        const g = Math.random() * 200;
        const b = Math.random() * 200;
        color = `rgb(${r},${g},${b})`;
      }
      const currentWord = {
        x: 0,
        y: 0,
        height: ((word.weight * this.mult) / (this.max * this.mult)) * 100,
        width: wordWidth,
        fontSize:
          ((Math.sqrt(word.weight * this.mult) * Math.sqrt(chars)) / chars) * 2,
        color,
        ...word,
      };
      this.fontSizes.push(currentWord.fontSize);

      if (this.starts) {
        this.width = wordWidth;
        this.height = currentWord.fontSize;
        currentWord.x = this.width / 2;
        currentWord.y = currentWord.fontSize * 0.8;
        this.originalWord = currentWord;
        this.starts = false;
        this.drawWord(currentWord);

        return;
      }

      if (this.rowIndex === 0) {
        if (this.index % 2 === 1) {
          if (!this.anteWord.hasOwnProperty("x")) {
            currentWord.x =
              this.originalWord.x +
              this.originalWord.width / 2 +
              wordWidth / 2 +
              currentWord.fontSize;
            currentWord.y =
              this.originalWord.y -
              (this.originalWord.height - currentWord.height) / 4;
            this.width += wordWidth + currentWord.fontSize;
            this.drawWord(currentWord);
            return;
          } else {
            currentWord.x =
              this.anteWord.x +
              this.anteWord.width / 2 +
              wordWidth / 2 +
              currentWord.fontSize;
            currentWord.y =
              this.anteWord.y - (this.anteWord.height - currentWord.height) / 4;
            this.width += wordWidth + currentWord.fontSize;
            this.drawWord(currentWord);
            return;
          }
        } else {
          currentWord.x = wordWidth / 2;
          currentWord.y =
            this.originalWord.y -
            (this.originalWord.height - currentWord.height) / 2;
          this.width += wordWidth + currentWord.fontSize;
          this.words.forEach(
            (word) => (word.x += wordWidth + currentWord.fontSize)
          );
          this.drawWord(currentWord);
          return;
        }
      }

      if (this.rowIndex % 2 === 1) {
        if (this.index === 0) {
          if (this.rowIndex === 1) {
            currentWord.x = this.originalWord.x;
            currentWord.y = currentWord.height / 2 + currentWord.fontSize;
            this.words.forEach(
              (word) => (word.y += currentWord.height * 2.5 + currentWord.fontSize)
            );
            this.drawWord(currentWord);
            return;
          }
          currentWord.x = this.originalWord.x;
          currentWord.y = currentWord.height + currentWord.fontSize;
          this.height += currentWord.height * 2 + currentWord.fontSize;
          this.words.forEach(
            (word) => (word.y += currentWord.height*2 + currentWord.fontSize)
          );
          this.drawWord(currentWord);
          return;
        } else {
          if (this.index % 2 === 1) {
            if (this.anteWord.hasOwnProperty("x")) {
              currentWord.x =
                this.anteWord.x +
                this.anteWord.width / 2 +
                wordWidth / 2 +
                currentWord.fontSize;
              currentWord.y =
                this.anteWord.y -
                (this.anteWord.height - currentWord.height) / 4;
            } else {
              currentWord.x =
                this.previousWord.x +
                this.previousWord.width / 2 +
                wordWidth / 2 +
                currentWord.fontSize;
              currentWord.y =
                this.previousWord.y -
                (this.previousWord.height - currentWord.height) / 4;
            }
            this.drawWord(currentWord);
            return;
          } else {
            currentWord.x =
              this.anteWord.x -
              this.anteWord.width / 2 -
              wordWidth / 2 -
              currentWord.fontSize;
            currentWord.y =
              this.anteWord.y - (this.anteWord.height - currentWord.height) / 4;
            this.drawWord(currentWord);
            return;
          }
        }
      }

      if (this.rowIndex % 2 === 0) {
        if (this.index === 0) {
          if (this.anteRow.hasOwnProperty("x")) {
            currentWord.x = this.originalWord.x;
            currentWord.y =
              this.anteRow.y +
              this.anteRow.height / 2 +
              currentWord.height / 2 +
              currentWord.fontSize;
          } else {
            currentWord.x = this.originalWord.x;
            currentWord.y =
              this.originalWord.y +
              this.originalWord.height / 2 +
              currentWord.height / 2 +
              currentWord.fontSize;
          }

          this.height += currentWord.height + currentWord.fontSize;
          this.drawWord(currentWord);
          return;
        } else {
          if (this.index % 2 === 1) {
            if (this.anteWord.hasOwnProperty("x")) {
              currentWord.x =
                this.anteWord.x +
                this.anteWord.width / 2 +
                wordWidth / 2 +
                currentWord.fontSize;
              currentWord.y =
                this.anteWord.y -
                (this.anteWord.height - currentWord.height) / 4;
            } else {
              currentWord.x =
                this.previousWord.x +
                this.previousWord.width / 2 +
                wordWidth / 2 +
                currentWord.fontSize;
              currentWord.y =
                this.previousWord.y -
                (this.previousWord.height - currentWord.height) / 4;
            }
            this.drawWord(currentWord);
            return;
          } else {
            currentWord.x =
              this.anteWord.x -
              this.anteWord.width / 2 -
              wordWidth / 2 -
              currentWord.fontSize;
            currentWord.y =
              this.anteWord.y - (this.anteWord.height - currentWord.height) / 4;
            this.drawWord(currentWord);
            return;
          }
        }
      }
    },
    drawWord(currentWord) {
      this.anteWord = this.previousWord;
      this.previousWord = currentWord;

      const isEndOfRow = this.index > this.maxWordsPerRow;
      const allWordsAreDrawn = this.count === this.sortedDataset.length;

      if (isEndOfRow) {
        this.anteRow = this.previousRow;
        this.previousRow = currentWord;
        this.previousWord = {};
        this.anteWord = {};
        this.index = 0;
        this.rowIndex += 1;
      } else {
        this.index += 1;
      }
      this.words.push(currentWord);
      this.count += 1;

      if (allWordsAreDrawn) {
        // add final padding
        this.width += this.magnitude;
        this.height += this.magnitude;
        this.words.forEach((word) => {
          word.x += this.magnitude / 2;
          word.y += this.magnitude / 2;
        });
      }
    },
    selectWord(word, index) {
      if (this.demo) {
        this.activeDemo = false;
      }
      if (
        this.selectedIndex === undefined ||
        (this.selectedIndex !== undefined && this.selectedIndex !== index)
      ) {
        this.selectedWord = word;
        this.selectedIndex = index;
      } else {
        this.selectedIndex = undefined;
      }
    },
    getTonality(word, index) {
      const { tonality } = word;
      const total = tonality.map((t) => t.value).reduce((a, b) => a + b, 0);
      let arr = [];
      let acc = 0;
      for(let i = 0; i < tonality.length; i += 1){
        const t = tonality[i];
        const x1 = acc;
        const x2 = t.value / total * 100;
        acc += x2;
        arr.push({...t, x1, x2, ratio:x2, total, acc})
      }
      return arr[index]
    },
    // This pSBC method is taken from https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    // Its purpose is to generate color shades for the monochrome option
    pSBC(p, c0, c1, l) {
      let r,
        g,
        b,
        P,
        f,
        t,
        h,
        i = parseInt,
        m = Math.round,
        a = typeof c1 == "string";
      if (
        typeof p != "number" ||
        p < -1 ||
        p > 1 ||
        typeof c0 != "string" ||
        (c0[0] != "r" && c0[0] != "#") ||
        (c1 && !a)
      )
        return null;
      if (!this.pSBCr)
        this.pSBCr = (d) => {
          let n = d.length,
            x = {};
          if (n > 9) {
            ([r, g, b, a] = d = d.split(",")), (n = d.length);
            if (n < 3 || n > 4) return null;
            (x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4))),
              (x.g = i(g)),
              (x.b = i(b)),
              (x.a = a ? parseFloat(a) : -1);
          } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6)
              d =
                "#" +
                d[1] +
                d[1] +
                d[2] +
                d[2] +
                d[3] +
                d[3] +
                (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5)
              (x.r = (d >> 24) & 255),
                (x.g = (d >> 16) & 255),
                (x.b = (d >> 8) & 255),
                (x.a = m((d & 255) / 0.255) / 1000);
            else
              (x.r = d >> 16),
                (x.g = (d >> 8) & 255),
                (x.b = d & 255),
                (x.a = -1);
          }
          return x;
        };
      (h = c0.length > 9),
        (h = a ? (c1.length > 9 ? true : c1 == "c" ? !h : false) : h),
        (f = this.pSBCr(c0)),
        (P = p < 0),
        (t =
          c1 && c1 != "c"
            ? this.pSBCr(c1)
            : P
            ? { r: 0, g: 0, b: 0, a: -1 }
            : { r: 255, g: 255, b: 255, a: -1 }),
        (p = P ? p * -1 : p),
        (P = 1 - p);
      if (!f || !t) return null;
      if (l)
        (r = m(P * f.r + p * t.r)),
          (g = m(P * f.g + p * t.g)),
          (b = m(P * f.b + p * t.b));
      else
        (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
          (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
          (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
      (a = f.a),
        (t = t.a),
        (f = a >= 0 || t >= 0),
        (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
      if (h)
        return (
          "rgb" +
          (f ? "a(" : "(") +
          r +
          "," +
          g +
          "," +
          b +
          (f ? "," + m(a * 1000) / 1000 : "") +
          ")"
        );
      else
        return (
          "#" +
          (
            4294967296 +
            r * 16777216 +
            g * 65536 +
            b * 256 +
            (f ? m(a * 255) : 0)
          )
            .toString(16)
            .slice(1, f ? undefined : -2)
        );
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  transition: all 0.15s ease-in-out;
}
.word-cloud {
  user-select: none;
  &__selected{
    &__legend{
      display: flex;
      align-items: center;
      justify-content: space-around;
      overflow: visible;
      background: white;
      margin-top: 200px;
      padding: 200px 0;
      border-radius: 200px;
      box-shadow: 0 0 200px 100px rgba(0,0,0,0.11);
    }
    &__tonality-wrapper{
      font-size: 20rem;
      width: 100%;
      font-weight: bold;
    }
    &__tonality{
      display: flex;
      flex-direction: column;
      align-items:center;
      justify-content: center;
    }
  }
  &__sentiment {
    overflow: hidden;
    color: white;
    display: flex;
    background: white;
    width: 100%;
  }
  &__tooltip {
    background: white;
    font-weight: bold;
    margin: 0 auto;
    position: relative;
    text-align: center;
    width: 100%;
    width: fit-content;
    &__pointer {
      color: white;
      font-size: 1em;
      left: 50%;
      position: absolute;
      top: 100%;
      transform: translate(-50%, -40%);
    }
  }
}
svg.main {
  background: transparent;
  overflow: visible;
  padding: 80px;
}
svg.sentiment{
  border-radius: 200px;
  overflow: hidden;
}
.word {
  color: black;
  font-size: 2em;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
text {
  cursor: pointer;
}
foreignObject {
  color: black !important;
  overflow: visible;
  position: relative;
}
.selected {
  opacity: 1;
}
.unselected {
  opacity: 0.1;
}

</style>
