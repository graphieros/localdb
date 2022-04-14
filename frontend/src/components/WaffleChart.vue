<template>
  <div
    class="waffle"
    :style="{
      height: `${size}px`,
      width: `${size}px !important`,
    }"
  >
    <div class="waffle__wrapper">
      <div
        class="waffle__square"
        v-for="(el, i) in 100"
        :key="`el_${i}`"
        :style="{
          background: computeColor(i).color,
          opacity: isSelected
            ? selectedSerie === computeColor(i).name
              ? 1
              : 0.3
            : 1,
        }"
        @mouseover="setTooltipPosition(i)"
        @mouseout="closeTooltip()"
      >
        <span v-if="lastSquare(i) === i">{{ serieValue(i) }}%</span>
      </div>
      <div
        v-if="isTooltip"
        class="waffle__tooltip"
        :style="{
          top: `${tooltipPosition.y}%`,
          left: `${tooltipPosition.x}%`,
        }"
      >
        <div
          class="waffle__marker mr-1"
          :style="`background:${tooltipInfo.color}`"
        ></div>
        <span class="waffle__tooltip--name">
          {{ tooltipInfo.name }} : <strong>{{ tooltipInfo.value }}%</strong>
        </span>
      </div>
    </div>
    <div class="waffle__legend">
      <div v-for="(serie, i) in series" :key="`legend_${i}`">
        <div
          class="waffle__legend-wrapper"
          @mouseover="highlight(serie)"
          @mouseout="
            selectedSerie = '';
            isSelected = false;
          "
        >
          <div
            class="waffle__marker"
            :style="`background:${serie.color}`"
          ></div>
          <span class="waffle__legend-name mr-5">
            {{ serie.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "WaffleChart",
  props: ["series", "size"],
  components: {},
  data() {
    return {
      selectedSerie: "",
      isSelected: false,
      isTooltip: false,
      tooltipPosition: { x: 0, y: 0 },
      tooltipInfo: {},
    };
  },
  computed: {
    flatSeries() {
      let idx = 0;
      let counter = 0;
      return this.series
        .map((serie, i) => {
          let arr = [];
          for (let j = 0; j < serie.value; j += 1) {
            arr.push({
              index: idx,
              color: serie.color,
              name: serie.name,
              value: Math.round(serie.value),
              lastSquare: counter,
            });
            idx += 1;
          }
          counter += Math.round(serie.value);
          return arr;
        })
        .flat();
    },
  },
  methods: {
    closeTooltip() {
      setTimeout(() => {
        this.isTooltip = false;
      }, 3000);
    },
    computeColor(index) {
      if (this.flatSeries.length) {
        return {
          color: this.flatSeries.filter((serie) => {
            return serie.index === index;
          })[0].color,
          name: this.flatSeries.filter((serie) => {
            return serie.index === index;
          })[0].name,
        };
      } else {
        return "";
      }
    },
    highlight(serie) {
      this.selectedSerie = serie.name;
      this.isSelected = true;
    },
    setTooltipPosition(index) {
      const x = ((index % 10) / this.size) * this.size * 10;
      const y = (index / this.size) * this.size;
      this.tooltipPosition = { x, y };
      this.isTooltip = true;
      this.tooltipInfo = this.flatSeries[index];
    },
    lastSquare(index) {
      const lastSquares = this.flatSeries.map((serie) => {
        return serie.lastSquare;
      });
      if (lastSquares.includes(index)) {
        return index;
      }
    },
    serieValue(index) {
      return this.flatSeries[index].value;
    },
  },
});
</script>

<style lang="scss" scoped>
.waffle {
  background: rgba(255, 255, 255, 0.1);
  display: block;
  &__legend {
    align-items: center;
    color: grey;
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    width: 100%;
  }
  &__legend-name {
    cursor: default;
    font-size: 0.8rem;
    user-select: none;
  }
  &__legend-wrapper {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 6px;
    justify-content: center;
  }
  &__marker {
    border-radius: 2px;
    display: block;
    height: 14px;
    width: 14px;
  }
  &__square {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    cursor: default;
    display: block;
    height: 100%;
    transition: all 0.15s ease-in-out;
    width: 100%;
    font-size: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-shadow: 1px 1px black;
  }
  &__tooltip {
    align-items: center;
    background: white;
    border-radius: 4px;
    box-shadow: 0 10px 20px -10px black;
    cursor: default;
    display: flex;
    font-size: 0.9rem;
    justify-content: center;
    padding: 12px;
    position: absolute;
    transform: translate(-50%, -50%);
    width: fit-content;
  }
  &__wrapper {
    display: grid;
    grid-gap: 4px;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    height: 100%;
    position: relative;
    width: 100%;
  }
}
</style>
