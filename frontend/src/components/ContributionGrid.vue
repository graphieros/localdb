<template>
  <div
    class="alp-contribution-grid"
    @pointerleave="
      allowTooltip(false);
      currentSelection = undefined;
    "
  >
    <div
      v-show="isTooltipVisible && !hideTooltip"
      class="alp-contribution-grid__tooltip"
      :style="`position: fixed; left: ${mouseX}px; top:${mouseY}px`"
      @pointerenter="allowTooltip(true)"
      v-html="displaySelectedDate"
    ></div>
    <svg
      :class="{
        'alp-contribution-grid__svg': true,
        'alp-contribution-grid__svg--outlined': outlined,
      }"
      :viewBox="`0 0 ${53 * 20 + 41} ${7 * 20 + 16}`"
      @mousemove="(e) => showTooltip(e)"
      @mouseleave="allowTooltip(false)"
    >
      <g v-for="(month, i) in months" :key="`month_${i}`">
        <text
          :fill="dark ? 'white' : 'black'"
          font-size="0.7em"
          text-anchor="end"
          y="10"
          :x="1021 * (i / 12) + 95"
          v-if="!hideYLegend"
        >
          {{ month }}
        </text>
      </g>

      <g
        v-for="(text, i) in weekDays"
        :key="`weekday_${i}`"
        @pointerenter="allowTooltip(false)"
      >
        <text
          :fill="
            selectedDate && selectedDate.weekDay === i
              ? 'green'
              : dark
              ? 'white'
              : 'black'
          "
          :text-decoration="
            selectedDate && selectedDate.weekDay === i ? 'underline' : 'none'
          "
          font-size="0.7em"
          text-anchor="end"
          :x="text.xLeft - 3"
          :y="text.yLeft + 12"
          v-if="!hideXLegend"
        >
          {{ text.short }}
        </text>
        <text
          v-if="selectedDate && selectedDate.weekDay === i && !hideXLegend"
          fill="green"
          font-size="1em"
          text-anchor="end"
          :x="text.xLeft + 8"
          :y="text.yLeft + 15"
        >
          &#x276E;
        </text>
      </g>
      <g
        v-for="(square, i) in days"
        :key="`day_${i}`"
        @pointerenter="allowTooltip(true)"
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
          @pointerenter="
            getDate(square);
            showLegendRange(square);
          "
        ></rect>
      </g>
    </svg>
    <div v-if="!hideLegend" class="alp-contribution-grid__legend">
      <svg viewBox="0 0 200 35" width="30%">
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
            v-show="canShowTick(square, i)"
            fill="green"
            font-size="0.6em"
            :x="square.x + 16"
            y="4"
            text-anchor="middle"
            rotate="-90"
          >
            &#x276E;
          </text>

          <text
            text-anchor="end"
            font-weight="bold"
            :x="square.x + 15"
            y="32"
            :fill="dark ? 'white' : 'black'"
            font-size="0.4em"
          >
            {{ `${Math.round(square.span[0])}` }}
          </text>
          <text
            text-anchor="start"
            font-weight="bold"
            :x="square.x + 2"
            y="32"
            fill="green"
            font-size="0.5em"
          >
            >
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "ContributionGrid",
  props: {
    dataset: {
      type: Array,
      default() {
        return [];
      },
    },
    dark: {
      type: Boolean,
      default: false,
    },
    hideTooltip: {
      type: Boolean,
      default: false,
    },
    hideLegend: {
      type: Boolean,
      default: false,
    },
    hideXLegend: {
      type: Boolean,
      defult: false,
    },
    hideYLegend: {
      type: Boolean,
      defult: false,
    },
    legendLabel: {
      type: String,
      default: "",
    },
    outlined: {
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
      currentSelection: undefined,
      selectedDate: null,
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
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
          y: (i % 7) * 20 + 15,
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
      // TODO: get date from day number, from the year passed as a prop
      const { data, day, stringDay } = this.selectedDate;
      return `${stringDay} (day ${day}) : <strong>${data}</strong> ${this.legendLabel}`;
    },
    logs() {
      return this.dataset;
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
          y: 5,
        },
        {
          dark: "#D5F5E3",
          light: "#1D8348",
          span: [max * 0.8, max * 0.9],
          x: 20,
          y: 5,
        },
        {
          dark: "#ABEBC6",
          light: "#239B56",
          span: [max * 0.7, max * 0.8],
          x: 40,
          y: 5,
        },
        {
          dark: "#82E0AA",
          light: "#28B463",
          span: [max * 0.6, max * 0.7],
          x: 60,
          y: 5,
        },
        {
          dark: "#58D68D",
          light: "#2ECC71",
          span: [max * 0.5, max * 0.6],
          x: 80,
          y: 5,
        },
        {
          dark: "#2ECC71",
          light: "#58D68D",
          span: [max * 0.4, max * 0.5],
          x: 100,
          y: 5,
        },
        {
          dark: "#28B463",
          light: "#82E0AA",
          span: [max * 0.3, max * 0.4],
          x: 120,
          y: 5,
        },
        {
          dark: "#239B56",
          light: "#ABEBC6",
          span: [max * 0.2, max * 0.3],
          x: 140,
          y: 5,
        },
        {
          dark: "#1D8348",
          light: "#D5F5E3 ",
          span: [max * 0.1, max * 0.2],
          x: 160,
          y: 5,
        },
        {
          dark: "#186A3B",
          light: "#EAFAF1",
          span: [max * 0, max * 0.1],
          x: 180,
          y: 5,
        },
      ];
      return ranges;
    },
    today() {
      return this.daysIntoYear(new Date()) + 1;
    },
  },
  methods: {
    canShowTick(square, index) {
      const { span } = square;
      const { data } = this.selectedDate || 0;

      if (index === 0) {
        if (data >= span[1]) {
          return true;
        } else if (data >= span[0] && data < span[1]) {
          return true;
        }
      }
      return data >= span[0] && data < span[1];
      // but it doesn't show max when reached
    },
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
        return this.dark ? this.colorRange[5].dark : this.colorRange[5].light;
      } else if (
        value >= this.colorRange[6].span[0] &&
        value < this.colorRange[6].span[1]
      ) {
        return this.dark ? this.colorRange[6].dark : this.colorRange[6].light;
      } else if (
        value >= this.colorRange[7].span[0] &&
        value < this.colorRange[7].span[1]
      ) {
        return this.dark ? this.colorRange[7].dark : this.colorRange[7].light;
      } else if (
        value >= this.colorRange[8].span[0] &&
        value < this.colorRange[8].span[1]
      ) {
        return this.dark ? this.colorRange[8].dark : this.colorRange[8].light;
      } else if (
        value >= this.colorRange[9].span[0] &&
        value < this.colorRange[9].span[1]
      ) {
        return this.dark ? this.colorRange[9].dark : this.colorRange[9].light;
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
    allowTooltip(isVisible) {
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
    showLegendRange(day) {
      this.currentSelection = day.data;
    },
  },
});
</script>

<style lang="scss" scoped>
.alp-contribution-grid {
  height: fit-content;
  overflow: visible;
  user-select: none;
  width: fit-content;

  &__svg {
    border-radius: 8px;
    padding: 12px 24px 24px 12px;
    width: 100%;
    &--outlined {
      border: 1px solid grey;
    }
  }
  &__rect {
    height: 20px;
    stroke-width: 0.1;
    stroke: grey;
    width: 20px;
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
      stroke-dasharray: 2;
      stroke-width: 2;
      stroke: red;
    }
    &--no-hover {
      stroke: none;
      &:hover {
        stroke: none;
      }
    }
  }
  &__tooltip {
    background: white;
    border-radius: 8px;
    box-shadow: 0 6px 6px 2px rgba(0, 0, 0, 0.2);
    padding: 12px;
    color: black;
  }
  &__legend {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
