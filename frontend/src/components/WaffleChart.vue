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
          background: gradient
            ? `radial-gradient(white, ${computeColor(i).color})`
            : computeColor(i).color,
          opacity: isSelected
            ? selectedSerie === computeColor(i).name
              ? 1
              : 0.3
            : 1,
          fontSize: isSelected
            ? selectedSerie === computeColor(i).name && funky
              ? '1.3rem'
              : '0.6em'
            : '0.6em',
        }"
        @mouseover="setTooltipPosition(i)"
        @mouseout="closeTooltip()"
      >
        <span class="waffle__percent" v-if="lastSquare(i) === i && showLabels"
          >{{ serieValue(i) }}%</span
        >
      </div>
      <div
        v-if="isTooltip"
        v-show="tooltip"
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
          {{ tooltipInfo.name }} : <strong>{{ tooltipInfo.value }}%</strong> ({{
            tooltipInfo.quantity
          }})
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
          :style="{
            opacity: selectedSerie
              ? selectedSerie === serie.name
                ? 1
                : 0.3
              : 1,
          }"
        >
          <div
            class="waffle__marker"
            :style="{
              background: gradient
                ? `radial-gradient(white, ${serie.color})`
                : serie.color,
            }"
          ></div>
          <span class="waffle__legend-name mr-5">
            {{ serie.name }} ({{ serie.quantity.toLocaleString() }})
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
  props: {
    series: Array,
    size: {
      default: "250",
      type: String,
    },
    funky: Boolean,
    gradient: Boolean,
    showLabels: {
      default: true,
      type: Boolean,
    },
    tooltip: {
      default: true,
      type: Boolean,
    },
  },
  components: {},
  data() {
    return {
      isSelected: false,
      isTooltip: false,
      selectedSerie: "",
      tooltipInfo: {},
      tooltipPosition: { x: 0, y: 0 },
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
              color: serie.color,
              index: idx,
              lastSquare: counter,
              quantity: serie.quantity,
              name: serie.name,
              value: Math.round(serie.value),
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
    transition: all 0.2s ease-in-out;
  }
  &__marker {
    border-radius: 2px;
    display: block;
    height: 14px;
    width: 14px;
  }
  &__percent {
    color: white;
    text-shadow: 1px 1px 3px black;
    font-weight: bold;
  }
  &__square {
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    cursor: default;
    display: block;
    display: flex;
    font-size: 0.6rem;
    height: 100%;
    justify-content: center;
    transition: all 0.15s ease-in-out;
    width: 100%;
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
