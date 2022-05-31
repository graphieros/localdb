<template>
  <div class="alp-contribution-grid" @mouseleave="manageTooltip(false)">
    <div
      v-show="isTooltipVisible"
      class="alp-contribution-grid__tooltip"
      :style="`position: fixed; left: ${mouseX}px; top:${mouseY}px`"
      @mouseenter="manageTooltip(true)"
      v-html="displaySelectedDate"
    ></div>
    <svg
      class="alp-contribution-grid__svg"
      :viewBox="`0 0 ${53 * 20 + 1} ${7 * 20 + 1}`"
      @mousemove="(e) => showTooltip(e)"
      @mouseenter="manageTooltip(true)"
      @mouseleave="manageTooltip(false)"
    >
      <g v-for="(day, i) in days" :key="`day_${i}`">
        <rect
          :class="{
            'alp-contribution-grid__rect': true,
            'alp-contribution-grid__rect--dark': dark,
            'alp-contribution-grid__rect--light': !dark,
            'alp-contribution-grid__rect--today': today === day.day,
          }"
          :x="day.x"
          :y="day.y"
          :fill="getHsl(day.data)"
          @click="reveal(day)"
          @pointerenter="getDate(day)"
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
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    showToday: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      selectedDate: null,
      weekDays: [
        { short: "Fri", long: "Friday" },
        { short: "Sat", long: "Saturday" },
        { short: "Sun", long: "Sunday" },
        { short: "Mon", long: "Monday" },
        { short: "Tue", long: "Tuesday" },
        { short: "Wed", long: "Wednesday" },
        { short: "Thu", long: "Thursday" },
      ],
      mouseX: 0,
      mouseY: 0,
      isTooltipVisible: false,
    };
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
          stringDay: this.weekDays[el.weekDay].long,
        };
      });
    },
    displaySelectedDate() {
      if (!this.selectedDate) {
        return;
      }
      const { data, day, stringDay } = this.selectedDate;
      return `${stringDay} (day ${day}) : <strong>${data}</strong> log${
        data > 1 ? "s" : ""
      }`;
    },
    logs() {
      return store.state.storedLogs;
    },
    logDates() {
      return this.logs.map((log) => {
        return {
          count: this.daysIntoYear(new Date(log.logDate)),
          weekDay: new Date(log.logDate).getDay(),
          day: new Date(log.logDate).toDateString(),
        };
      });
    },
    quantityPerDay() {
      const counts = {};
      this.logDates.forEach((date) => {
        counts[date.count] = (counts[date.count] || 0) + 1;
        counts.weekDay = date.weekDay;
        counts.day = date.day;
      });
      return counts;
    },
    today() {
      return this.daysIntoYear(new Date()) + 1;
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
    getDate(day) {
      this.selectedDate = day;
    },
    getHsl(val) {
      if (val === 0) {
        return "transparent";
      }
      if (this.dark) {
        return `hsl(100,100%,${val * 2}%)`;
      } else {
        return `hsl(100,100%,${100 - val * 2}%)`;
      }
    },
    manageTooltip(isVisible) {
      setTimeout(() => {
        this.isTooltipVisible = isVisible;
      }, 50);
    },
    reveal(day) {
      console.log(day);
    },
    showTooltip(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY - 56;
    },
  },
});
</script>

<style lang="scss" scoped>
.alp-contribution-grid {
  height: fit-content;
  width: fit-content;
  overflow: visible;
  &__svg {
    width: 100%;
    border: 1px solid grey;
    border-radius: 8px;
  }
  &__rect {
    height: 20px;
    width: 20px;
    stroke: grey;
    stroke-width: 0.1;
    &:hover {
      stroke-width: 1;
    }
    &--dark {
      &:hover {
        stroke: white;
      }
    }
    &--light {
      &:hover {
        stroke: black;
      }
    }
    &--today {
      stroke: red;
      stroke-width: 2;
      stroke-dasharray: 2;
      // animation: dash 10s infinite linear;
    }
    // @keyframes dash {
    //   to {
    //     stroke-dashoffset: 100;
    //   }
    // }
  }
  &__tooltip {
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 3px 3px -0px rgba(0, 0, 0, 0.1);
  }
}
</style>
