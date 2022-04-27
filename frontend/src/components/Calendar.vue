<template>
  <div class="calendar">
    <div
      v-show="selectedDay"
      :class="`calendar__day ${isDarkMode ? 'white--text' : 'black--text'}`"
    >
      Day {{ selectedDay }}
    </div>
    <div class="calendar__grid">
      <div
        v-for="(el, i) in weightDates"
        :key="`square_${i}`"
        :class="`calendar__square`"
        :style="`background:${getHsl(el.data)}`"
        @mouseover="selectedDay = el.day"
        @mouseout="selectedDay = null"
      >
        <span
          v-show="selectedDay === el.day"
          :class="isDarkMode ? 'white--text' : 'black--text'"
          >{{ el.data }}</span
        >
      </div>
    </div>
    <!-- <apexchart
      :options="options"
      :series="options.series"
      height="150px"
      width="800px"
    ></apexchart> -->
  </div>
</template>

<script>
import Vue from "vue";
import store from "../store";

export default Vue.extend({
  name: "Calendar",
  components: {},
  data() {
    return {
      selectedDay: null,
    };
  },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
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
    weightDates() {
      let arr = [];
      for (let i = 0; i < 365; i += 1) {
        arr.push({
          [i]: 0,
          day: i + 1,
          weekDay: i % 7,
        });
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
        };
      });
    },

    options() {
      const series = [
        {
          name: "friday",
          data: this.weightDates
            .filter((el) => el.weekDay === 0)
            .map((e) => e.data),
        },
        {
          name: "saturday",
          data: this.weightDates
            .filter((el) => el.weekDay === 1)
            .map((e) => e.data),
        },
        {
          name: "sunday",
          data: this.weightDates
            .filter((el) => el.weekDay === 2)
            .map((e) => e.data),
        },
        {
          name: "monday",
          data: this.weightDates
            .filter((el) => el.weekDay === 3)
            .map((e) => e.data),
        },
        {
          name: "tuesday",
          data: this.weightDates
            .filter((el) => el.weekDay === 4)
            .map((e) => e.data),
        },
        {
          name: "wednesday",
          data: this.weightDates
            .filter((el) => el.weekDay === 5)
            .map((e) => e.data),
        },
        {
          name: "thursday",
          data: this.weightDates
            .filter((el) => el.weekDay === 6)
            .map((e) => e.data),
        },
      ];

      return {
        chart: {
          type: "heatmap",
        },
        colors: ["#000000"],
        dataLabels: {
          style: {
            fontSize: "8px",
          },
        },
        plotOptions: {
          heatmap: {
            useFillColorAsStroke: false,
          },
        },
        series: series,
      };
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
  },
});
</script>

<style lang="scss" scoped>
.calendar {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: hidden;
  position: relative;
  height: 400px;
  &__day {
    color: white;
    position: absolute;
    top: 50%;
    transform: translateY(-400%);
    z-index: 1;
  }
  &__grid {
    display: grid;
    grid-column-gap: 0 !important;
    grid-row-gap: 0;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(52, 1fr);
    transform: rotate(-90deg);
    height: 100%;
    margin-left: -30%;
  }
  &__square {
    align-items: center;
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(128, 128, 128, 0.185);
    color: transparent;
    cursor: auto;
    display: block;
    display: flex;
    font-size: 0.5em;
    height: 15px;
    justify-content: center;
    text-orientation: mixed;
    user-select: none;
    width: 15px;
    writing-mode: vertical-rl;
    border-radius: 3px;
    transition: transform 0.1s ease-in-out;
    &:hover {
      transform: scale(1.618, 1.618);
      color: white;
      box-shadow: 0 0px 10px white;
      border: 1px solid white;
    }
  }
}
</style>
