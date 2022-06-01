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
      :viewBox="`0 0 ${53 * 20 + 41} ${7 * 20 + 1}`"
      @mousemove="(e) => showTooltip(e)"
      @mouseleave="manageTooltip(false)"
    >
      <g
        v-for="(text, i) in weekDays"
        :key="`weekday_${i}`"
        @mouseenter="manageTooltip(false)"
      >
        <text
          :fill="dark ? 'white' : 'black'"
          font-size="0.7em"
          text-anchor="end"
          :x="text.xLeft"
          :y="text.yLeft"
        >
          {{ text.short }}
        </text>
      </g>
      <g
        v-for="(square, i) in days"
        :key="`day_${i}`"
        @mouseenter="manageTooltip(true)"
      >
        <rect
          :class="{
            'alp-contribution-grid__rect': true,
            'alp-contribution-grid__rect--dark': dark,
            'alp-contribution-grid__rect--light': !dark,
            'alp-contribution-grid__rect--today':
              showToday && today === square.day,
          }"
          :x="square.x"
          :y="square.y"
          :fill="getColor(square.data)"
          @click="reveal(square)"
          @pointerenter="getDate(square)"
        ></rect>
      </g>
    </svg>
    <div v-if="legend" class="alp-contribution-grid__legend">
      <svg viewBox="0 0 180 30" width="30%">
        <g v-for="(square, i) in colorRange" :key="`legend_${i}`">
          <rect
            :class="{
              'alp-contribution-grid__rect': true,
              'alp-contribution-grid__rect--no-hover': true,
              'alp-contribution-grid__rect--dark': dark,
              'alp-contribution-grid__rect--light': !dark,
            }"
            :fill="dark ? square.dark : square.light"
            :x="square.x"
            :y="square.y"
          ></rect>

          <text
            text-anchor="end"
            font-weight="bold"
            :x="square.x - 4.5"
            y="27"
            :fill="dark ? 'white' : 'black'"
            font-size="0.4em"
          >
            {{ `>${Math.round(square.span[0])}` }}
          </text>
        </g>
      </svg>
    </div>
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
    legend: {
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
        {
          short: "Fri",
          long: "Friday",
          xLeft: 30,
          yLeft: 15,
          xRight: "",
          yRight: "",
        },
        {
          short: "Sat",
          long: "Saturday",
          xLeft: 30,
          yLeft: 35,
          xRight: "",
          yRight: "",
        },
        {
          short: "Sun",
          long: "Sunday",
          xLeft: 30,
          yLeft: 55,
          xRight: "",
          yRight: "",
        },
        {
          short: "Mon",
          long: "Monday",
          xLeft: 30,
          yLeft: 75,
          xRight: "",
          yRight: "",
        },
        {
          short: "Tue",
          long: "Tuesday",
          xLeft: 30,
          yLeft: 95,
          xRight: "",
          yRight: "",
        },
        {
          short: "Wed",
          long: "Wednesday",
          xLeft: 30,
          yLeft: 115,
          xRight: "",
          yRight: "",
        },
        {
          short: "Thu",
          long: "Thursday",
          xLeft: 30,
          yLeft: 135,
          xRight: "",
          yRight: "",
        },
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
          x: el.x + 40,
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
    colorRange() {
      const max = Math.max(...this.days.map((el) => el.data));
      const ranges = [
        {
          dark: "#EAFAF1",
          light: "#186A3B ",
          span: [max * 0.9, max * 1],
          x: 0,
          y: 0,
        },
        {
          dark: "#D5F5E3",
          light: "#1D8348",
          span: [max * 0.8, max * 0.9],
          x: 20,
          y: 0,
        },
        {
          dark: "#ABEBC6",
          light: "#239B56",
          span: [max * 0.7, max * 0.8],
          x: 40,
          y: 0,
        },
        {
          dark: "#82E0AA",
          light: "#28B463",
          span: [max * 0.6, max * 0.7],
          x: 60,
          y: 0,
        },
        {
          dark: "#58D68D",
          light: "#2ECC71",
          span: [max * 0.5, max * 0.6],
          x: 80,
          y: 0,
        },
        {
          dark: "#2ECC71",
          light: "#58D68D",
          span: [max * 0.4, max * 0.5],
          x: 100,
          y: 0,
        },
        {
          dark: "#28B463",
          light: "#82E0AA",
          span: [max * 0.3, max * 0.4],
          x: 120,
          y: 0,
        },
        {
          dark: "#239B56",
          light: "#ABEBC6",
          span: [max * 0.2, max * 0.3],
          x: 140,
          y: 0,
        },
        {
          dark: "#1D8348",
          light: "#D5F5E3 ",
          span: [max * 0.1, max * 0.2],
          x: 160,
          y: 0,
        },
        {
          dark: "#186A3B",
          light: "#EAFAF1",
          span: [max * 0.01, max * 0.1],
          x: 180,
          y: 0,
        },
      ];
      return ranges;
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
    getColor(value) {
      if (value === 0) {
        return "transparent";
      }
      if (
        value >= this.colorRange[0].span[0] &&
        value <= this.colorRange[0].span[1]
      ) {
        return this.dark ? this.colorRange[0].dark : this.colorRange[0].light;
      } else if (
        value >= this.colorRange[1].span[0] &&
        value < this.colorRange[1].span[1]
      ) {
        return this.dark ? this.colorRange[1].dark : this.colorRange[1].light;
      } else if (
        value >= this.colorRange[2].span[0] &&
        value < this.colorRange[2].span[1]
      ) {
        return this.dark ? this.colorRange[2].dark : this.colorRange[2].light;
      } else if (
        value >= this.colorRange[3].span[0] &&
        value < this.colorRange[3].span[1]
      ) {
        return this.dark ? this.colorRange[3].dark : this.colorRange[3].light;
      } else if (
        value >= this.colorRange[4].span[0] &&
        value < this.colorRange[4].span[1]
      ) {
        return this.dark ? this.colorRange[4].dark : this.colorRange[4].light;
      } else if (
        value >= this.colorRange[5].span[0] &&
        value < this.colorRange[5].span[1]
      ) {
        return this.dark ? this.colorRange[5].dark : this.colorRange[4].light;
      } else if (
        value >= this.colorRange[6].span[0] &&
        value < this.colorRange[6].span[1]
      ) {
        return this.dark ? this.colorRange[6].dark : this.colorRange[4].light;
      } else if (
        value >= this.colorRange[7].span[0] &&
        value < this.colorRange[7].span[1]
      ) {
        return this.dark ? this.colorRange[7].dark : this.colorRange[4].light;
      } else if (
        value >= this.colorRange[8].span[0] &&
        value < this.colorRange[8].span[1]
      ) {
        return this.dark ? this.colorRange[8].dark : this.colorRange[4].light;
      } else if (
        value >= this.colorRange[9].span[0] &&
        value < this.colorRange[9].span[1]
      ) {
        return this.dark ? this.colorRange[9].dark : this.colorRange[4].light;
      }
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
  user-select: none;
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
    }
    &--no-hover {
      &:hover {
        stroke: none;
      }
    }
  }
  &__tooltip {
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 3px 3px -0px rgba(0, 0, 0, 0.1);
  }
  &__legend {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
