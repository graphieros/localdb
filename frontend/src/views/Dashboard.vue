<template>
  <div>
    <h1 class="green--text text--lighten-4">Dashboard</h1>
    <div class="dashboard">
      <v-card class="dashboard-card">
        <apexchart
          :options="itemsPerCategory"
          :series="itemsPerCategory.series"
        ></apexchart>
      </v-card>
      <v-card class="dashboard-card span-2">
        <apexchart
          :options="itemsHistory"
          :series="itemsHistory.series"
          height="300px"
        ></apexchart>
      </v-card>
      <v-card class="dashboard-card">
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

          <!-- {{ averageRatings[i] }} -->
        </div>
      </v-card>
      <v-card class="dashboard-card"> </v-card>
      <v-card class="dashboard-card"> </v-card>
      <v-card class="dashboard-card"> </v-card>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "../store";

export default Vue.extend({
  name: "Dashboard",
  components: {},
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
      return store.state.storedCategories;
    },
    colors() {
      return ["#508a27", "#fcba03", "#299190", "#2c3d96", "#862c96", "#a83654"];
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
            return new Date(val).toLocaleDateString();
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
            const seriesIndex = tooltipItem.seriesIndex;
            const serieValue = dataSet[seriesIndex];
            const seriePercent = (serieValue / totalItems) * 100;

            let html = "";
            html += `<div class="custom-tooltip-marker" style="background: radial-gradient(white,${that.colors[seriesIndex]})"></div>`;
            html += labels[seriesIndex];
            html += ` : <strong>${serieValue}</strong>`;
            html += ` ${serieValue > 1 ? "items" : "item"}`;
            html += ` <span style="color:${
              that.colors[seriesIndex]
            }">(${seriePercent.toFixed(0)}%)</span>`;
            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
      };
    },
    options() {
      return {
        chart: {
          type: "donut",
        },
        series: [1, 2, 3],
      };
    },
  },
  data() {
    return {};
  },
  methods: {},
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
}

.dashboard-card {
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

@media screen and(max-width: 1000px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and(max-width: 800px) {
  .dashboard {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>

<style>
.custom-tooltip-wrapper {
  background: rgb(0, 0, 14);
  padding: 10px;
  border-radius: 3px;
  color: white;
  word-break: break-word;
}
.custom-tooltip-marker {
  border-radius: 3px;
  height: 20px;
  width: 20px;
  display: inline-block;
  margin-bottom: -5px;
  margin-right: 5px;
}
</style>
