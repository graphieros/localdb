<template>
  <SvgAnnotator fixedTools hideWhenFolded showPrint fontFamily="Jost">
    <div>
      <h1 class="green--text text--lighten-4">Dashboard</h1>
      <div class="dashboard">
        <v-card
          :class="`dashboard-card contribution-grid span-3 pa-6 ${
            isDarkMode ? '' : 'light-card'
          }`"
        >
          <div
            :class="{
              'grey--text': isDarkMode,
              'black--text': !isDarkMode,
              'mb-5': true,
            }"
          >
            Contribution grid
          </div>
          <ContributionGrid
            :dark="isDarkMode"
            showToday
            :dataset="contributionGridDataset"
          />
        </v-card>
        <v-card :class="`dashboard-card  ${isDarkMode ? '' : 'light-card'}`">
          <h5 class="grey--text mt-n6">Average estimate</h5>
          <div class="gauge__presentation">
            <FlexGauge
              acceleration="0.07"
              size="300"
              animated
              animationSpeed="2"
              showRefreshButton
              :dark="isDarkMode"
              darkColor="#18192C"
              :colors="gaugeColorsReversed"
              :msBeforeMount="0"
              :range="[10, 10, 10, 10, 10, 10, 10, 10, 10, 10]"
              :score="Number(averageEvaluation) / 2"
              :tooltipHtml="`<div class='custom-tooltip-wrapper'>Average estimate: <strong>${
                averageEvaluation / 2
              }</strong></div>`"
            />
          </div>
        </v-card>

        <v-card :class="`dashboard-card ${isDarkMode ? '' : 'light-card'}`">
          <div class="gauge__presentation">
            <SvgAnnotator>
              <Thermometer
                animated
                base10
                :dark="isDarkMode"
                :range="[10, 10, 10, 10, 10, 10, 10, 10, 10, 10]"
                :score="Number(averageEvaluation) / 2"
                :size="400"
                :colors="gaugeColorsReversed"
                :tooltipHtml="`Score: ${Number(averageEvaluation) / 2}`"
                :showRefreshButton="true"
              />
            </SvgAnnotator>
          </div>
        </v-card>

        <v-card :class="`dashboard-card ${isDarkMode ? '' : 'light-card'}`">
          <h5 class="grey--text mb-3">Average item estimate per category</h5>
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
                <span :style="`color:${colors[i]}`" class="rating mr-2">{{
                  averageRatings[i].toFixed(1)
                }}</span>
                <v-rating
                  size="20"
                  dense
                  :value="averageRatings[i]"
                  :color="colors[i]"
                  background-color="grey darken-3"
                  half-increments
                  readonly
                  length="10"
                ></v-rating>
              </v-row>
            </v-col>
          </div>
        </v-card>

        <v-card :class="`dashboard-card ${isDarkMode ? '' : 'light-card'}`">
          <SvgAnnotator >
            <Donut :dataset="donutType" gradient />
          </SvgAnnotator>
        </v-card>

        <v-card :class="`dashboard-card span-2 ${isDarkMode ? '' : 'light-card'}`">
            <Annotator>
            <apexchart
              :options="optionsItemsPerDate"
              :series="optionsItemsPerDate.series"
              height="350px"
            ></apexchart>
            </Annotator>
  
          <v-row class="justify-center align-center">
            <v-btn class="mx-2 grey" x-small @click="setStroke(-1)">Thinner</v-btn>
            <small class="grey--text">stroke width : {{ lineStroke }}px</small>
            <v-btn class="mx-2 grey" x-small @click="setStroke(1)">Thicker</v-btn>
          </v-row>
        </v-card>

        <v-card :class="`dashboard-card ${isDarkMode ? '' : 'light-card'}`">
          <WaffleChart
            class="mt-n15"
            funky
            :series="waffleComputing"
            size="250"
            title="Items per category"
            tooltip
          />
        </v-card>

        <v-card :class="`dashboard-card span-2 ${isDarkMode ? '' : 'light-card'}`">
          <v-row class="justify-end mb-1">
            <v-col class="col-3 dashboard-card__select">
              <v-select
                dark
                :items="categoriesNames"
                label="Select category"
                v-model="selectedTreeMap"
              ></v-select>
            </v-col>
            <v-col class="col-2 dashboard-card__select">
              <v-select
                dark
                :items="[10, 25, 50, 100, 200]"
                label="Select range"
                v-model="treemapRange"
              ></v-select>
            </v-col>
          </v-row>

          <SvgAnnotator>
            <apexchart
              id="treemap"
              :options="optionsTreemap"
              :series="optionsTreemap.series"
              height="350px"
              :key="treemapStep"
            ></apexchart>
          </SvgAnnotator>
        </v-card>

        <v-card
          :class="`dashboard-card span-3 ${isDarkMode ? '' : 'light-card'}`"
          style="padding: none !important"
        >
          <SvgAnnotator>
            <Quadrant
              :height="250"
              :width="800"
              axisArrows
              fontFamily="Jost"
              :datasets="quadrantDataset"
              xTitle="Completion time (mn)"
              yTitle="Story points"
              hideLabels
              :dark="isDarkMode"
              positive
              :showLegend="true"
            />
          </SvgAnnotator>
        </v-card>
        <v-row class="justify-end mb-1" style="width: 200px">
          <v-col class="col-2 dashboard-card__select" style="width: 200px">
            <v-select
              style="width: 200px"
              dark
              :items="[5, 10, 25, 50, 100, 200]"
              label="Select range"
              v-model="maxTreemap"
            ></v-select>
          </v-col>
        </v-row>

        <v-card
          :class="`dashboard-card span-3 ${isDarkMode ? '' : 'light-card'}`"
          style="padding: none !important"
        >
          <Treemap
            :wordcloud="false"
            :sorted="true"
            :showLabels="true"
            :width="1050"
            :dataset="treemapDataset"
            :bubbles="false"
            :justify="true"
            :impact="false"
            :max="maxTreemap"
            :title="{
              text: 'Stories Treemap',
              fontSize: '24px',
              fontWeight: '900',
              position: 'start',
            }"
          />
        </v-card>

        <v-card :class="`dashboard-card span-3 ${isDarkMode ? '' : 'light-card'}`">
          <div style="margin: 0 auto; width: 100%; max-width: 800px">
            <SvgAnnotator>
              <WordCloud :dataset="wordcloud" :key="`wc_${step}`" :limit="30" />
            </SvgAnnotator>
          </div>
        </v-card>
      </div>
    </div>
  </SvgAnnotator>
</template>

<script>
import SvgAnnotator from "svg-annotator";
import Annotator from "../components/Annotator.vue";
import ContributionGrid from "../components/ContributionGrid.vue";
import Donut from "../components/Donut.vue";
import FlexGauge from "../components/FlexGauge.vue";
import Gauge from "../components/Gauge.vue";
import GaugeBar from "../components/GaugeBar.vue";
import GaugeCanvas from "../components/GaugeCanvas.vue";
import Quadrant from "../components/Quadrant.vue";
import Thermometer from "../components/Thermometer.vue";
import Treemap from "../components/Treemap.vue";
import Vue from "vue";
import WaffleChart from "../components/WaffleChart.vue";
import WordCloud from "../components/WordCloud.vue";
import store from "../store";
import utils from "../utils/index.js";

export default Vue.extend({
  name: "Dashboard",
  components: {
    Annotator,
    SvgAnnotator,
    ContributionGrid,
    Donut,
    FlexGauge,
    Gauge,
    GaugeBar,
    GaugeCanvas,
    Quadrant,
    Thermometer,
    Treemap,
    WaffleChart,
    WordCloud,
  },
  data() {
    return {
      maxTreemap: 100,
      fakeScore: [1, 2],
      treemapTotal: 0,
      lineStroke: 3,
      selectedTreeMap: "All",
      treemapRange: 50,
      treemapStep: 0,
      gaugeColorsFour: ["red", "#ffae00", "greenyellow", "green"],
      gaugeColorsThree: ["#fa0202", "#ffae00", "#5cd65c"],
      gaugeColorsTwo: ["#fa0202", "#5cd65c"],
      gaugeColorsReversed: [
        "#5cd65c",
        "greenyellow",
        "#ccff33",
        "#ffff00",
        "#ffcc00",
        "#ffae00",
        "#ff9933",
        "#ff6600",
        "#ff3300",
        "red",
      ],
      gaugeColorsAll: [
        "red",
        "#ff3300",
        "#ff6600",
        "#ff9933",
        "#ffae00",
        "#ffcc00",
        "#ffff00",
        "#ccff33",
        "greenyellow",
        "#5cd65c",
        "#33cc69",
        "#33cc9e",
        "#33ccc9",
        "#33b3cc",
        "#33a6cc",
        "#3399cc",
        "#338acc",
        "#337dcc",
        "#3375cc",
        "#3366cc",
      ],
      step: 0,
    };
  },
  computed: {
    wordcloud() {
      let arr = [];

      store.state.storedCategories.forEach((category) => {
        category.items.forEach((item) => {
          let descr = item.description.split(" ");
          descr.forEach((dsc) => {
            if (dsc.length > 4) {
              let thatWord = utils.removePunctuation(dsc);
              if (thatWord[thatWord.length - 1] === "s") {
                thatWord = thatWord.slice(0, -1);
              }
              arr.push({
                verbatim: thatWord,
                weight: 1,
              });
            }
          });
          let title = item.title.split(" ");
          title.forEach((tit) => {
            if (tit.length > 3) {
              let thatWord = utils.removePunctuation(tit);
              if (thatWord[thatWord.length - 1] === "s") {
                thatWord = thatWord.slice(0, -1);
              }
              arr.push({
                verbatim: thatWord,
                weight: 1,
              });
            }
          });
        });
      });

      const count = {};
      for (const element of arr) {
        if (count[element.verbatim]) {
          count[element.verbatim] += 1;
        } else {
          count[element.verbatim] = 1;
        }
      }

      return Object.keys(count)
        .map((key) => {
          return {
            verbatim: key,
            weight: count[key],
          };
        })
        .sort((a, b) => b.weight - a.weight);
    },
    quadrantDataset() {
      return [
        {
          name: "Bug",
          series: this.completionTime
            .filter((ct) => ct.category === "DONE" && ct.type === "BUG")
            .map((el) => {
              return [Math.round(el.completionTime / 60000), el.rating];
            }),
          color: this.colors[0],
          radius: 5,
          shape: "triangle",
        },
        {
          name: "Feature",
          series: this.completionTime
            .filter((ct) => ct.category === "DONE" && ct.type === "FEATURE")
            .map((el) => {
              return [Math.round(el.completionTime / 60000), el.rating];
            }),
          color: this.colors[1],
          radius: 3,
          shape: "star",
        },
        {
          name: "Research",
          series: this.completionTime
            .filter((ct) => ct.category === "DONE" && ct.type === "RESEARCH")
            .map((el) => {
              return [Math.round(el.completionTime / 60000), el.rating];
            }),
          color: this.colors[2],
          radius: 5,
          shape: "square",
        },
      ];
    },
    completionTime() {
      const allStories = store.state.storedCategories
        .map((category) => {
          return category.items.map((item) => {
            return {
              type: item.type,
              category: category.name,
              completionTime: item.completionTime / item.rating,
              rating: item.rating,
              itemName: item.title,
            };
          });
        })
        .flat();
      return allStories.filter((story) => !isNaN(story.completionTime));
    },
    donutCompletionTime() {
      const series = this.completionTime.map((serie) => {
        return {
          name: serie.itemName,
          data: [serie.completionTime, serie.rating],
        };
      });

      return {
        chart: {
          type: "scatter",
          toolbar: {
            show: false,
          },
        },
        grid: {
          show: false,
        },
        markers: {
          size: 3,
        },
        series: [
          {
            name: "Completion",
            data: series.map((el) => el.data),
          },
        ],
        title: {
          text: "Point value in time",
          align: "center",
          style: {
            color: "#c4c4c4",
            fontFamily: "Roboto, sans-serif",
          },
        },
        tooltip: {
          custom: function ({ w, dataPointIndex }) {
            const point = series.map((el) => el.data)[dataPointIndex][1];
            const time = utils.msToTime(series.map((el) => el.data)[dataPointIndex][0]);
            let html = "";
            html += series.map((el) => el.name)[dataPointIndex];
            html += "<br>";
            html += point > 1 ? `${point} points` : `${point} point`;
            html += "<br>";
            html += `Average time per point: <strong>${time}</strong>`;
            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
        xaxis: {
          labels: {
            formatter: function (val) {
              return utils.msToTime(val);
            },
          },
        },
      };
    },
    estimateRate() {
      const allEvaluations = store.state.storedCategories
        .map((category) => {
          return category.items.map((item) => {
            return {
              rating: item.rating,
              max: 5,
            };
          });
        })
        .flat();
      const max = allEvaluations.reduce((a, b) => a + b.max, 0);
      const ratings = allEvaluations.reduce((a, b) => a + b.rating, 0);
      return (ratings / max) * 100;
    },
    ratingBarOptions() {
      let ratings = [];
      this.categories.map((category) => {
        const categoryRatings = category.items.map((item) => item.rating);
        ratings.push(categoryRatings);
      });
      const averageRatings = ratings.map(
        (ratingArray) => ratingArray.reduce((a, b) => a + b) / ratingArray.length
      );
      const series = [...this.categories]
        .map((category, i) => {
          return {
            x: category.name,
            y: averageRatings[i] * 2,
          };
        })
        .sort((a, b) => a.y - b.y);

      return {
        chart: {
          type: "bar",
          toolbar: {
            show: false,
          },
        },
        colors: ["#ccc"],
        plotOptions: {
          bar: {
            borderRadius: 3,
          },
        },
        series: [{ data: series }],
        tooltip: {
          followCursor: true,
          custom: function ({ dataPointIndex }) {
            let html = "";
            html += `${series[dataPointIndex].x} rates at ${series[dataPointIndex].y}`;
            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
      };
    },
    averageEvaluation() {
      const allEvaluations = store.state.storedCategories
        .map((category) => {
          return category.items.map((item) => {
            return item.rating;
          });
        })
        .flat();
      return Number(
        ((allEvaluations.reduce((a, b) => a + b, 0) / allEvaluations.length) * 2).toFixed(
          1
        )
      );
    },
    averageEvaluationGauge() {
      return {
        rating: this.averageEvaluation,
        translation: "Average estimate",
        colors: ["#eb4034", "#ebb134", "#20a82e"],
      };
    },
    waffleComputing() {
      let totalUnits = 0;
      if (store.state.storedCategories.length) {
        totalUnits = [...store.state.storedCategories]
          .map((category) => {
            return category.items.length;
          })
          .reduce((a, b) => a + b);
      }

      const result = store.state.storedCategories.map((category) => {
        return {
          color: category.color,
          name: category.name,
          quantity: category.items.length,
          total: totalUnits,
          value: Number(((category.items.length / totalUnits) * 100).toFixed(0)),
        };
      });
      return result;
    },
    averageRatings() {
      let ratings = [];
      this.categories.map((category) => {
        const categoryRatings = category.items.map((item) => item.rating);
        ratings.push(categoryRatings);
      });
      return ratings.map(
        (ratingArray) => ratingArray.reduce((a, b) => a + b) / ratingArray.length
      );
    },
    categories() {
      return store.state.storedCategories.filter((category) => category.items.length);
    },
    categoriesNames() {
      return [
        "All",
        ...store.state.storedCategories.map((category) => {
          return category.name;
        }),
      ];
    },
    colors() {
      return store.state.storedCategories.map((category) => category.color);
    },
    contributionGridDataset() {
      return store.state.storedLogs;
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
    treemapDataset() {
      return [...this.categories].map((category) => {
        return {
          name: category.name,
          value: category.items.length,
          color: category.color,
          id: category.name,
          children: category.items.map((item) => {
            return {
              name: item.title,
              value: item.rating,
              id: item.id,
              children: undefined,
            };
          }),
        };
      });
    },
    itemsHistory() {
      const that = this;
      let items = [];

      this.categories.forEach((category) => {
        category.items.forEach((item) => {
          items.push(item);
        });
      });

      const series = this.categories
        .map((category) => {
          return {
            name: category.name,
            data: category.items?.map((item) => item.createdAt),
            color: category.color,
          };
        })
        .sort((a, b) => b.data.length - a.data.length);

      const colors = series.map((serie) => serie.color);

      const seriesItemsNames = this.categories.map((category) => {
        return category.items.map((item) => {
          return {
            name: item.title ? item.title : item.name,
            content: item.title ? item.description : "",
          };
        });
      });

      const maxLen = Math.max(...series.map((serie) => serie.data.length));

      return {
        chart: {
          type: "heatmap",
          toolbar: {
            show: false,
          },
        },
        colors,
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
          text: "Items stack",
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
            html += `<strong style="color:${colors[seriesIndex]}">${
              series[seriesIndex] ? series[seriesIndex].name : ""
            }</strong>`;
            html += "<br>";
            html += `${new Date(
              series[seriesIndex].data[dataPointIndex]
            ).toLocaleDateString()}`;
            html += "<br>";
            html += `${
              seriesItemsNames[seriesIndex][dataPointIndex]
                ? seriesItemsNames[seriesIndex][dataPointIndex].name
                : ""
            }`;
            html += "<br>";
            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
        yaxis: {
          labels: {
            style: {
              colors,
            },
          },
        },
        xaxis: {
          min: 0,
          max: maxLen,
          tickAmount: maxLen,
        },
      };
    },

    donutType() {
      const donutType = {
        id: "donut_type",
        name: "Story types",
        series: [
          {
            name: "BUG",
            value: 0,
            color: this.colors[0],
            active: true,
          },
          {
            name: "FEATURE",
            value: 0,
            color: this.colors[1],
            active: true,
          },
          {
            name: "RESEARCH",
            value: 0,
            color: this.colors[2],
            active: true,
          },
        ],
      };

      const labels = store.state.itemTypes.map((el) => el.name);

      [...this.categories].forEach((category) => {
        category.items.forEach((item) => {
          labels.forEach((label) => {
            if (item.type === label) {
              donutType.series.find((el) => el.name === label).value += 1;
            }
          });
        });
      });

      return donutType;
    },

    itemsByType() {
      let series = {
        BUG: 0,
        FEATURE: 0,
        RESEARCH: 0,
      };
      const labels = store.state.itemTypes.map((el) => el.name);

      [...this.categories].forEach((category) => {
        category.items.forEach((item) => {
          labels.forEach((label) => {
            if (item.type === label) {
              series[label] += 1;
            }
          });
        });
      });

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
        colors: store.state.itemTypes.map((el) => el.color),
        labels,
        legend: this.legend,
        plotOptions: {
          pie: {
            donut: {
              size: "55%",
            },
          },
        },
        series: Object.values(series),
        stroke: {
          show: false,
        },
        title: {
          text: "Story types",
          align: "center",
          style: {
            color: "#c4c4c4",
            fontFamily: "Roboto, sans-serif",
          },
        },
      };
    },

    itemsPerCategory() {
      const that = this;
      const dataSet = this.categories
        .map((category) => {
          return {
            data: category.items.length,
            color: category.color,
            name: category.name,
          };
        })
        .sort((a, b) => b.data - a.data);
      const colors = dataSet.map((serie) => serie.color);
      const totalItems = dataSet.length ? dataSet.reduce((a, b) => a + b.data, 0) : 0;
      const labels = (dataSet || []).map((category) => category.name);

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
        colors,
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
        series: [...dataSet].map((serie) => serie.data),
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
              html += `<div class="custom-tooltip-marker" style="background: radial-gradient(white,${colors[i]})"></div>`;
              html += labels[i];
              html += ` : <strong>${dataSet[i].data}</strong>`;
              html += ` ${dataSet[i].data > 1 ? "items" : "item"}`;
              html += ` <span style="color:${colors[i]}">(${(
                (dataSet[i].data / totalItems) *
                100
              ).toFixed(0)}%)</span></div>`;
            });

            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
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
          size: 3,
          strokeWidth: 1,
        },
        series: this.itemsPerDate,
        stroke: {
          curve: "smooth",
          width: this.lineStroke,
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
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const hoverXaxis = w.globals.seriesX[seriesIndex][dataPointIndex];
            const hoverIndexes = w.globals.seriesX.map((seriesX) => {
              return seriesX.findIndex((xData) => xData === hoverXaxis);
            });

            let html = "";
            html += `<strong>${that.uniqueDates[dataPointIndex]}</strong>`;
            html += "<hr>";

            hoverIndexes.forEach((hoverIndex, seriesEachIndex) => {
              if (hoverIndex >= 0) {
                html += `<div class="custom-tooltip-item">`;
                html += `<div class="custom-tooltip-marker" style="background: linear-gradient(to bottom right, white,${
                  that.logColors[seriesEachIndex]
                })"></div><strong style="font-size: 1.1em; color:${
                  that.logColors[seriesEachIndex]
                }">${
                  series[seriesEachIndex][hoverIndex]
                    ? series[seriesEachIndex][hoverIndex]
                    : 0
                }</strong> ${w.globals.seriesNames[seriesEachIndex]}`;
                html += "</div>";
              }
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
      const that = this;
      const selection = this.treemapRange;
      const colorIndex = this.categoriesNames.findIndex((el) =>
        el.includes(this.selectedTreeMap)
      );
      const treemapColors = ["#ff8400", ...this.colors];
      const dataSet = this.wordsList
        .filter((set) => {
          return set.x !== "";
        })
        .slice(0, selection);
      this.treemapTotal = dataSet.length;
      const onlyY = dataSet.map((el) => {
        return el.y;
      });

      const maxVal = Math.max(...onlyY);

      return {
        chart: {
          type: "treemap",
          toolbar: {
            show: false,
          },
        },
        colors: [treemapColors[colorIndex]],
        dataLabels: {
          formatter: function (val, opts) {
            const count = opts.value;
            if (count > maxVal / 4) {
              return [val, count];
            } else {
              return val;
            }
          },
        },
        grid: {
          padding: {
            right: 36,
            left: 36,
          },
        },
        plotOptions: {
          treemap: {
            distributed: false,
            enableShades: true,
            shadeIntensity: 0.61803398875,
          },
        },
        series: [{ data: dataSet }],
        stroke: {
          width: 1,
          colors: ["#000"],
        },
        title: {
          align: "left",
          offsetX: 24,
          style: {
            color: "#c4c4c4",
            fontFamily: "Roboto, sans-serif",
          },
          text: `Top ${selection} most frequent topics in category "${this.selectedTreeMap}"`,
        },
        tooltip: {
          followCursor: true,
          custom: function (tooltipItem) {
            const dataPointIndex = tooltipItem.dataPointIndex;
            const dataPoint = tooltipItem.w.config.series[0].data[dataPointIndex];
            let html = "";

            html += `<i>${dataPoint.x} : ${dataPoint.y.toLocaleString()}</i><br>`;
            html += `<div style="color:${
              treemapColors[colorIndex]
            };font-size: 1.5em; text-align:center; width:100%;"><strong>${utils.computePercentage(
              dataPoint.y,
              that.treemapTotal,
              1
            )}</strong></div>`;
            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
      };
    },
    uniqueDates() {
      return [...new Set(this.logs.map((log) => log.date))];
    },
    wordsList() {
      let words = [];
      let stringThread = "";
      let itemDescription = [];

      if (this.selectedTreeMap === "All") {
        store.state.storedCategories.forEach((category) => {
          itemDescription = category.items.map((item) => item.description);
          words.push(itemDescription);
        });
      } else {
        const filteredCategory = store.state.storedCategories.filter((category) => {
          return category.name === this.selectedTreeMap;
        })[0];

        itemDescription = filteredCategory.items.map((item) => {
          return item.description;
        });
        words.push(itemDescription);
      }

      utils.removePunctuation(words.flat()).forEach((string) => (stringThread += string));

      return utils.convertStringToTreemap(
        utils.removeUndesirableWords(utils.removePunctuation(stringThread))
      );
    },
  },

  methods: {
    printAnnotations(htmlElement) {
      console.log(htmlElement);
    },
    async getVerbatims() {
      return store.getters.verbatims;
    },
    generateArrayOfSameUnits(n, segment) {
      const arr = [];
      for (let i = 0; i < n; i += 1) {
        arr.push(segment);
      }
      return arr;
    },
    getItemsPerDate(itemType) {
      const dictionary = this.itemsPerDatePreconditions[itemType];
      const result = Object.keys(dictionary).map((key) => {
        return [Number(key), dictionary[key]];
      });
      return result;
    },
    getGaugeRotation(value) {
      const val = Number(value) * 1.8;
      const min = -90; //equiv 0
      const max = 90; // equiv 100
      if (val < 90) {
        return min + val;
      } else if (val > 90) {
        return val - max;
      } else {
        return 0;
      }
    },
    setStroke(num) {
      this.lineStroke += num;
      if (this.lineStroke <= 0) {
        this.lineStroke = 1;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.apexcharts-radialbar-area {
  background: red !important;
}
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
  &-card {
    padding: 20px 0;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__select {
      align-self: end;
      margin-bottom: -60px;
      margin-right: 24px;
      z-index: 100;
    }
  }
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
  font-size: 1em;
  opacity: 1;
}

.span-2 {
  grid-column: 2 / span 2;
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
rect {
  rx: 3;
  ry: 3;
}
.contribution-grid {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
