<template>
  <div>
    <h1 class="green--text text--lighten-4">Dashboard</h1>
    <div class="dashboard">
      <v-card :class="`dashboard-card ${isDarkMode ? '' : 'light-card'}`">
        <apexchart
          :options="itemsPerCategory"
          :series="itemsPerCategory.series"
          height="350px"
        ></apexchart>
      </v-card>

      <v-card
        :class="`dashboard-card span-2 ${isDarkMode ? '' : 'light-card'}`"
      >
        <apexchart
          :options="optionsItemsPerDate"
          :series="optionsItemsPerDate.series"
          height="350px"
        ></apexchart>
      </v-card>

      <v-card :class="`dashboard-card ${isDarkMode ? '' : 'light-card'}`">
        <h5 class="grey--text mb-3">Average item rating per category</h5>
        <div
          class="rating-wrapper"
          v-for="(category, i) in categories"
          :key="`strat_cat_${i}`"
        >
          <v-col>
            <v-row class="justify-center grey--text mb-0">
              <h6 :style="`color:${colors[i]}`">{{ category.name }}</h6>
            </v-row>
            <v-row class="align-center justify-center my-0">
              <span :style="`color:${colors[i]}`" class="rating">{{
                averageRatings[i].toFixed(1)
              }}</span>
              <v-rating
                :value="averageRatings[i]"
                :color="colors[i]"
                background-color="grey darken-3"
                half-increments
                readonly
              ></v-rating>
            </v-row>
          </v-col>
        </div>
      </v-card>

      <v-card :class="`dashboard-card ${isDarkMode ? '' : 'light-card'}`">
        <apexchart
          :options="itemsHistory"
          :series="itemsHistory.series"
          height="300px"
        ></apexchart>
      </v-card>

      <v-card :class="`dashboard-card ${isDarkMode ? '' : 'light-card'}`">
        <apexchart
          :options="optionsRadar"
          :series="optionsRadar.series"
          height="350px"
        ></apexchart>
      </v-card>

      <v-card
        :class="`dashboard-card span-3 ${isDarkMode ? '' : 'light-card'}`"
      >
        <apexchart
          :options="optionsTreemap"
          :series="optionsTreemap.series"
          height="350px"
        ></apexchart>
      </v-card>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "../store";

// TO DO: create a treemap of most frequent words, without useless words like 'and, or, is, has,'

export default Vue.extend({
  name: "Dashboard",
  components: {},
  data() {
    return {};
  },
  computed: {
    averageRatings() {
      let ratings = [];
      this.categories.map((category) => {
        const categoryRatings = category.items.map((item) => item.rating);
        ratings.push(categoryRatings);
      });
      return ratings.map(
        (ratingArray) =>
          ratingArray.reduce((a, b) => a + b) / ratingArray.length
      );
    },
    categories() {
      return store.state.storedCategories.filter(
        (category) => category.items.length
      );
    },
    colors() {
      return ["#508a27", "#fcba03", "#299190", "#2c3d96", "#862c96", "#a83654"];
    },
    logColors() {
      return ["#508a27", "#fcba03", "#7853a6", "#d42f52", "#322378"];
    },
    fill() {
      return {
        type: "gradient",
      };
    },
    legend() {
      return {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        labels: {
          colors: undefined,
          useSeriesColors: true,
        },
        markers: {
          radius: 3,
        },
      };
    },
    logs() {
      const logs = store.state.storedLogs.map((log) => {
        return {
          date: new Date(log.logDate).toDateString(),
          type: log.type,
        };
      });
      return logs;
    },
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    itemsPerDatePreconditions() {
      const dictionary = {};

      this.logs.forEach((log) => {
        const date = new Date(log.date).getTime();

        if (!dictionary[log.type]) {
          dictionary[log.type] = {};
        }
        if (!dictionary[log.type][date]) {
          dictionary[log.type][date] = 0;
        }
        dictionary[log.type][date] += 1;
      });

      return dictionary;
    },
    itemsPerDate() {
      return this.itemTypes.map((type) => {
        return {
          name: type,
          data: this.getItemsPerDate(type),
        };
      });
    },

    itemTypes() {
      const types = this.logs.map((log) => log.type);
      return [...new Set(types)];
    },
    itemsHistory() {
      const that = this;
      let items = [];

      this.categories.forEach((category) => {
        category.items.forEach((item) => {
          items.push(item);
        });
      });

      const series = this.categories.map((category) => {
        return {
          name: category.name,
          data: category.items?.map((item) => item.createdAt),
        };
      });

      const seriesItemsNames = this.categories.map((category) => {
        return category.items.map((item) => {
          return {
            name: item.title ? item.title : item.name,
            content: item.title ? item.description : "",
          };
        });
      });

      return {
        chart: {
          type: "heatmap",
          toolbar: {
            show: false,
          },
        },
        colors: this.colors,
        dataLabels: {
          formatter: function (val) {
            return "";
          },
        },
        grid: {
          show: false,
        },
        plotOptions: {
          heatmap: {
            radius: 3,
          },
        },
        series,
        stroke: {
          show: false,
        },
        title: {
          text: "Items history",
          align: "center",
          style: {
            color: "#c4c4c4",
            fontFamily: "Roboto, sans-serif",
          },
        },
        tooltip: {
          followCursor: true,
          custom: function (tooltipItem) {
            const seriesIndex = tooltipItem.seriesIndex;
            const dataPointIndex = tooltipItem.dataPointIndex;

            let html = "";
            html += `<strong style="color:${that.colors[seriesIndex]}">${series[seriesIndex].name}</strong>`;
            html += "<br>";
            html += `${new Date(
              series[seriesIndex].data[dataPointIndex]
            ).toLocaleDateString()}`;
            html += "<br>";
            html += `${seriesItemsNames[seriesIndex][dataPointIndex].name}`;
            html += "<br>";
            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: this.colors,
            },
          },
        },
        xaxis: {
          min: 0,
          tickAmount: series.length,
        },
      };
    },

    itemsPerCategory() {
      const that = this;
      const dataSet = this.categories.map((category) => {
        return category.items.length;
      });
      const totalItems = dataSet.length ? dataSet.reduce((a, b) => a + b) : 0;
      const labels = (this.categories || []).map((category) => category.name);

      return {
        chart: {
          type: "donut",
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 3,
            color: "#000814",
            opacity: 1,
          },
          toolbar: {
            show: false,
          },
        },
        colors: this.colors,
        dataLabels: {
          formatter: function (value) {
            return `${value.toFixed(0)}%`;
          },
        },
        fill: this.fill,
        legend: this.legend,
        labels,
        plotOptions: {
          pie: {
            donut: {
              size: "55%",
            },
          },
        },
        series: [...dataSet],
        stroke: {
          show: false,
        },
        title: {
          text: "Items per category",
          align: "center",
          style: {
            color: "#c4c4c4",
            fontFamily: "Roboto, sans-serif",
          },
        },
        tooltip: {
          followCursor: true,
          custom: function (tooltipItem) {
            let html = "";

            dataSet.forEach((serie, i) => {
              html += `<div class="custom-tooltip-item">`;
              html += `<div class="custom-tooltip-marker" style="background: radial-gradient(white,${that.colors[i]})"></div>`;
              html += labels[i];
              html += ` : <strong>${dataSet[i]}</strong>`;
              html += ` ${dataSet[i] > 1 ? "items" : "item"}`;
              html += ` <span style="color:${that.colors[i]}">(${(
                (dataSet[i] / totalItems) *
                100
              ).toFixed(0)}%)</span></div>`;
            });

            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
      };
    },
    optionsRadar() {
      const that = this;
      const series = {
        name: "Categories",
        data: [],
      };
      this.categories.forEach((category) => {
        series.data.push(category.items.length);
      });
      let total = 1;
      if (series.data.length) {
        total = series.data.reduce((a, b) => a + b);
      }

      const seriesNames = [...this.categories].map((category) => {
        return category.name;
      });

      return {
        chart: {
          type: "radar",
          toolbar: {
            show: false,
          },
        },

        grid: {
          padding: {
            right: 54,
            left: 54,
          },
        },
        markers: {
          radius: 3,
          shape: "circle",
          size: 4,
          strokeWidth: 1,
        },
        series: [series],
        title: {
          text: "Category weight",
          align: "center",
          style: {
            color: "#c4c4c4",
            fontFamily: "Roboto, sans-serif",
          },
        },

        tooltip: {
          followCursor: true,
          custom: function (tooltipItem) {
            const dataPointIndex = tooltipItem.dataPointIndex;
            let html = "";

            html += `<strong style="color:${that.colors[dataPointIndex]}">${seriesNames[dataPointIndex]}</strong>`;
            html += ` : ${series.data[dataPointIndex]} item${
              series.data[dataPointIndex] > 1 ? "s" : ""
            }`;
            html += ` (${that.computePercentage(
              series.data[dataPointIndex],
              total
            )})`;
            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
        xaxis: {
          labels: {
            formatter: function (val, opts) {
              const dataPointIndex = opts.dataPointIndex;
              return seriesNames[dataPointIndex];
            },
          },
        },
        yaxis: {
          show: false,
        },
      };
    },
    optionsItemsPerDate() {
      const that = this;
      return {
        chart: {
          type: "line",
          toolbar: {
            show: false,
          },
        },
        colors: this.logColors,
        grid: {
          padding: {
            top: 0,
            right: 48,
            bottom: 0,
            left: 48,
          },
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        legend: this.legend,
        markers: {
          radius: 3,
          shape: "circle",
          size: 6,
          strokeWidth: 1,
        },
        series: this.itemsPerDate,
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Log history",
          align: "center",
          style: {
            color: "#c4c4c4",
            fontFamily: "Roboto, sans-serif",
          },
        },
        tooltip: {
          followCursor: true,
          custom: function (tooltipItem) {
            const seriesIndex = tooltipItem.seriesIndex;
            const dataPointIndex = tooltipItem.dataPointIndex;
            const series = tooltipItem.series;
            let html = "";
            html += `<strong>${that.uniqueDates[dataPointIndex]}</strong>`;
            html += "<hr>";

            that.itemsPerDate.forEach((log, i) => {
              html += `<div class="custom-tooltip-item">`;
              html += `<div class="custom-tooltip-marker" style="background: linear-gradient(to bottom right, white,${that.logColors[i]})"></div>`;
              html += `<strong style="font-size: 1.1em; color:${
                that.logColors[i]
              }">${
                series[i][dataPointIndex] ? series[i][dataPointIndex] : 0
              }</strong>`;
              html += ` ${log.name}`;

              html += "<br>";
            });
            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
        xaxis: {
          categories: this.uniqueDates,
          tickPlacement: "between",
          labels: {
            formatter: function (val) {
              if (val) {
                return new Date(val).toLocaleDateString();
              }
            },
            style: {
              colors: "#808080",
            },
          },
        },
        yaxis: {
          min: 0,
          forceNiceScale: true,
          labels: {
            style: {
              colors: "#808080",
            },
          },
        },
      };
    },
    optionsTreemap() {
      const dataSet = this.wordsList.filter((set) => {
        return set.x !== "";
      });
      return {
        chart: {
          type: "treemap",
          toolbar: {
            show: false,
          },
        },
        series: [{ data: dataSet }],
      };
    },
    uniqueDates() {
      return [...new Set(this.logs.map((log) => log.date))];
    },
    wordsList() {
      let words = [];
      let stringThread = "";
      store.state.storedCategories.forEach((category) => {
        const itemDescription = category.items.map((item) => item.description);
        words.push(itemDescription);
      });
      this.removeClutter(words.flat()).forEach(
        (string) => (stringThread += string)
      );
      stringThread = this.removeClutter(stringThread);
      stringThread = this.removeUndesirableWords(stringThread);
      return this.convertStringToTreemap(stringThread);
    },
  },
  methods: {
    computePercentage(num, total) {
      return `${((num / total) * 100).toFixed(0)}%`;
    },
    convertStringToTreemap(string) {
      const array = string.split(" ");
      let counts = array.reduce(
        (acc, value) => ({
          ...acc,
          [value]: (acc[value] || 0) + 1,
        }),
        {}
      );

      return Object.keys(counts)
        .map((key, i) => {
          return {
            x: key,
            y: counts[key],
          };
        })
        .sort((a, b) => b.y - a.y);
    },
    getItemsPerDate(itemType) {
      const dictionary = this.itemsPerDatePreconditions[itemType];
      const result = Object.keys(dictionary).map((key) => {
        return [Number(key), dictionary[key]];
      });
      return result;
    },
    removeClutter(list) {
      const punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
      if (typeof list === "object") {
        return list.map((item) => {
          return item.replace(punctuation, " ");
        });
      } else {
        return list.replace(punctuation, " ");
      }
    },
    removeUndesirableWords(string) {
      string = string.toLowerCase();
      string = string.replace(/  +/g, " ");
      string = string.replaceAll("\n", " ");
      string = string.replace(/[0-9]/g, "");

      const undesirable = [
        " a ",
        " b ",
        " c ",
        " d ",
        " e ",
        " f ",
        " g ",
        " h ",
        " i ",
        " j ",
        " k ",
        " l ",
        " m ",
        " n ",
        " o ",
        " p ",
        " q ",
        " r ",
        " s ",
        " t ",
        " u ",
        " v ",
        " w ",
        " x ",
        " y ",
        " z ",
        " & ",
        " the ",
        " to ",
        " and ",
        " on ",
        " be ",
        " is ",
        " if ",
        " with ",
        " or ",
        " its ",
        " can ",
        " in ",
        " not ",
        " for ",
        " by ",
        " ",
      ];
      undesirable.forEach((letter) => {
        string = string.replaceAll(letter, " ");
      });

      return string;
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  position: absolute;
  top: 15px;
  left: 80px;
  text-align: left;
}
.dashboard {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 120px;
  padding: 0 90px 0 130px;
  margin-bottom: 100px;
}

.dashboard-card {
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.light-card {
  background-color: white;
  box-shadow: 0px 10px 20px -10px grey !important;
}

.rating-wrapper {
  width: 100%;
}

span.rating {
  font-weight: bold;
  font-size: 2em;
  opacity: 0.5;
}

.span-2 {
  grid-column: 2 / span 3;
  width: 100% !important;
  div {
    width: 100% !important;
    div {
      width: 100% !important;
      svg {
        width: 100% !important;
      }
    }
  }
}

.span-3 {
  grid-column: 1 / span 3;
  width: 100% !important;
  div {
    width: 100% !important;
    div {
      width: 100% !important;
      svg {
        width: 100% !important;
      }
    }
  }
}

@media screen and(max-width: 1000px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
    padding-left: 72px;
  }
  .span-2,
  .span-3 {
    grid-column: 1;
  }
}
@media screen and(max-width: 800px) {
  .dashboard {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>

<style lang="scss">
.custom-tooltip-item {
  margin: 3px 0;
}
.custom-tooltip-wrapper {
  background: rgb(0, 0, 14);
  border-radius: 3px;
  color: lightgrey;
  padding: 24px;
  text-align: left;
  word-break: break-word;
}
.custom-tooltip-marker {
  border-radius: 3px;
  display: inline-block;
  height: 20px;
  margin-bottom: -5px;
  margin-right: 5px;
  width: 20px;
}
hr {
  background-color: grey;
  height: 1px;
  margin: 6px 0;
  opacity: 0.6;
}
</style>
