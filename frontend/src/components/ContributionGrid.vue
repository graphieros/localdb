<template>
  <div class="alp-contribution-grid">
    <svg
      class="alp-contribution-grid__svg"
      :viewbox="`0 0 ${7 * 20} ${52 * 20}`"
    >
      <g v-for="(day, i) in days" :key="`day_${i}`">
        <rect
          class="alp-contribution-grid__rect"
          :x="day.x"
          :y="day.y"
          :fill="getHsl(day.data)"
          @click="reveal(day)"
        ></rect>
      </g>
    </svg>
  </div>
</template>

<script>
import Vue from "vue";
import store from "../store";

export default Vue.extend({
  name: "ContributionGrid",
  components: {},
  data() {
    return {};
  },
  computed: {
    days() {
      let arr = [];
      let week = 0;
      for (let i = 0; i < 365; i += 1) {
        arr.push({
          [i]: 0,
          day: i + 1,
          weekDay: i % 7,
          x: week * 20,
          y: (i % 7) * 20,
        });
        if (i % 7 === 6) {
          week += 1;
        }
      }
      Object.keys(this.quantityPerDay).forEach((el, i) => {
        arr[el] = {
          ...arr[el],
          [el]: this.quantityPerDay[el],
        };
      });

      return arr.map((el, i) => {
        return {
          data: el[i],
          day: el.day,
          weekDay: el.weekDay,
          x: el.x,
          y: el.y,
        };
      });
    },
    logs() {
      return store.state.storedLogs;
    },
    logDates() {
      return this.logs.map((log) => {
        return {
          count: this.daysIntoYear(new Date(log.logDate)),
          weekDay: new Date(log.logDate).getDay(),
        };
      });
    },
    quantityPerDay() {
      const counts = {};
      this.logDates.forEach((date) => {
        counts[date.count] = (counts[date.count] || 0) + 1;
        counts.weekDay = date.weekDay;
      });
      return counts;
    },
  },
  methods: {
    daysIntoYear(date) {
      return (
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
          Date.UTC(date.getFullYear(), 0, 0)) /
        24 /
        60 /
        60 /
        1000
      );
    },
    getHsl(val) {
      if (this.isDarkMode) {
        return `hsl(100,100%,${val * 2}%)`;
      } else {
        return `hsl(100,100%,${100 - val * 2}%)`;
      }
    },
    reveal(day) {
      console.log(day.day);
    },
  },
});
</script>

<style lang="scss" scoped>
.alp-contribution-grid {
  height: fit-content;
  width: fit-content;

  &__svg {
    width: 100%;
    border: 1px dashed red;
  }
  &__rect {
    height: 20px;
    width: 20px;
    &:hover {
      zoom: 120%;
    }
  }
}
</style>
