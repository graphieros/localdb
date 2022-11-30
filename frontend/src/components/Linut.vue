<template>
    <div style="width: 100%" class="linut__main" ref="linutMain" @click.self="closeDrawer">
        <!-- TOOLTIP type line -->
        <div 
            v-if="isTooltip && settings.hasTooltip && isLine && !isDrawerOpen" 
            :style="`top:${clientY + 20}px; left:${!showDonutTooltip ? clientX : clientX - 112}px; font-family:${fontFamily}`" 
            :class="{'linut__tooltip': !showDonutTooltip, 'linut__donut': showDonutTooltip}"
        >
            <b v-if="xLabels && xLabels.length && !showDonutTooltip">
              {{ xLabels[selectedIndex] }}
            </b>
            <hr v-if="xLabels && xLabels.length && !showDonutTooltip"/>

            <template v-if="showDonutTooltip">
                <svg 
                  class="linut__tooltip__donut" 
                  width="90px" 
                  viewBox="0 0 100 100" 
                  style="overflow: visible;"
                >
                    <foreignObject
                        :x="0"
                        :y="0"
                        height="100%"
                        width="100%"
                        :style="'overflow: visible;'"
                    >
                        <div
                            :style="
                                `
                                align-items: center;
                                border-radius: 50%; font-weight: bold;
                                color: black;
                                display: flex;
                                flex-direction: column;
                                font-size:16px;
                                height: 100%;
                                justify-content: center;
                                overflow: visible;
                                text-align: center;
                                width:100%;
                                margin-top: -60px;
                                margin-left: -20px;
                                `
                            "
                        >
                            <span style="font-size:1em; line-height: 1em;">
                                {{ xLabels[selectedIndex] }}
                            </span>

                        </div>
                    </foreignObject>

                    <path
                        v-for="(arc, j) in makeDonut(
                            createDonutSerie(selectedSeries),
                            30,
                            30,
                            60,
                            60
                        )"
                        :key="`arc_${j}`"
                        :d="arc.path"
                        :stroke="arc.color"
                        :stroke-width="50"
                        @click="segregate(j)"
                        style="fill:none;"
                    />
                    <!-- MARKERS -->

                    <foreignObject
                        id="markers"
                        v-for="(arc, k) in makeDonut(
                            createDonutSerie(selectedSeries),
                            35,
                            35,
                            60,
                            60
                        )"
                        :key="`arc_marker_${k}`"
                        :x="arc.center.endX"
                        :y="arc.center.endY"
                        :height="30"
                        :width="30"
                        style="overflow: visible"
                    >
                        <div
                            v-if="arc.proportion * 100 > 5"
                            :style="
                                `
                                align-items:center; 
                                background:white; 
                                border-radius: 50%; 
                                box-shadow: 0 3px 6px rgba(0,0,0,0.31);
                                color: black; 
                                display: block; 
                                display: flex; 
                                font-size:1em; 
                                font-weight: bold; 
                                height: 40px !important; 
                                justify-content:center; 
                                margin-left:-28px; 
                                margin-top:-28px; 
                                padding: 12px; 
                                width: 40px !important; 
                                z-index:100;
                                `
                            "
                        >
                            {{ (arc.proportion * 100).toFixed(0) }}%
                        </div>
                    </foreignObject>
                </svg>
            </template>

            <template v-else>
                <div 
                  v-for="(serie,i) in selectedSeries" 
                  class="linut__tooltip__item" 
                  :key="`serie_${i}`"
                >
                    <span 
                      class="linut__legend__marker--tooltip" 
                      :style="`color:${serie.color}`"
                    >       	
                        &#9679;
                    </span>
                    <span>
                        {{ serie.name }} :<b>&nbsp;{{ serie.data }}</b>&nbsp;({{ serie.ratio.toFixed(1) }}%)
                    </span>
            </div>
            </template>
        </div>

        <!-- TOOLTIP type donut -->
        <div
          v-if="isTooltip && settings.hasTooltip && !isLine && !isDrawerOpen"
          :style="`top:${clientY + 20}px; left: ${clientX - 112}px; font-family:${fontFamily};`"
          :class="{'linut__tooltip': true, 'linut__tooltip--regular': true}"
        >   
            <div style="width: 100%; text-align:left; margin-bottom: 3px;">
              <b v-if="xLabels && xLabels.length">
                {{ xLabels[selectedIndex] }}
              </b>
            </div>
            
            <hr v-if="xLabels && xLabels.length"/>
            <div class="linut__tooltip__donut-type-content" v-html="tooltipContent"></div>
        </div>

        <!-- CHART SVG -->
        <svg 
          class="linut" 
          ref="svgLine" 
          width="100%" 
          :viewBox="`0 0 ${width} ${height}`" 
          :style="`font-family:${fontFamily}; opacity:${isDrawerOpen ? '0.2': '1'};`"
        >
            <g class="linut__amenities">
                <g class="linut__title" v-if="title">
                    <text 
                      text-anchor="middle" 
                      :x="width / 2" 
                      :y="12" 
                      font-weight="bold" 
                      font-size="14"
                    >
                        {{ title }}
                    </text>
                </g>
                <!-- SWITCH control to swap chart modes -->
                <foreignObject 
                  :x="0" 
                  :y="16" 
                  width="100%" 
                  height="30px"
                  v-if="settings.showControls"
                >
                    <div class="linut__controls">
                      <label 
                        for="checkbox" 
                        class="linut__controls__label linut__controls__label--left"
                        >
                        <svg 
                          style="width:12px;height:12px; margin-bottom: -3.5px;" 
                          viewBox="0 0 24 24"
                          >
                            <path 
                              :fill="isLine ? '#aaa' : '#6376DD'" 
                              d="M13,2.05V5.08C16.39,5.57 19,8.47 19,12C19,12.9 18.82,13.75 18.5,14.54L21.12,16.07C21.68,14.83 22,13.45 22,12C22,6.82 18.05,2.55 13,2.05M12,19A7,7 0 0,1 5,12C5,8.47 7.61,5.57 11,5.08V2.05C5.94,2.55 2,6.81 2,12A10,10 0 0,0 12,22C15.3,22 18.23,20.39 20.05,17.91L17.45,16.38C16.17,18 14.21,19 12,19Z" 
                            />
                        </svg>
                      </label>
                      <label class="linut__switch">
                        <input 
                          id="checkbox" 
                          type="checkbox" 
                          name="checkbox" 
                          v-model="isLine" 
                          :checked="isLine"
                        >
                        <span class="linut__slider"></span>
                        </label>
                        <label 
                          for="checkbox" 
                          class="linut__controls__label linut__controls__label--right"
                        >
                          <svg 
                            style="width:12px;height:12px; margin-bottom:-3.5px;" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              :fill="!isLine ? '#aaa' : '#6376DD'" 
                              d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" 
                            />
                          </svg>
                      </label>
                    </div>
                </foreignObject>

                <!-- MID AXIS (0) -->
                <line
                    v-if="settings.showGrid && (isLine || (!isLine && min >= 0))"
                    class="linut__mid-axis"
                    :x1="xMargin"
                    :x2="width"
                    :y1="midCoordinate"
                    :y2="midCoordinate"
                />

                <!-- Y AXIS -->
                <g class="linut__yAxis" v-if="settings.showYLabels">
                    <line
                      class="linut__axis" 
                      :x1="xMargin" 
                      :x2="xMargin" 
                      :y1="maxCoordinate" 
                      :y2="minCoordinate" 
                    />
                    <circle
                      class="linut__tick" 
                      :cx="xMargin" 
                      :cy="maxCoordinate" 
                      r="1" 
                    />
                    <text 
                      v-if="isLine" 
                      :x="xMargin - 6" 
                      :y="maxCoordinate + 2" 
                      text-anchor="end" 
                      :font-size="8" 
                      font-weight="bold"
                    >
                        {{ max.toFixed(0) }}
                    </text>
                    <text 
                      v-if="isLine" 
                      :x="xMargin - 6" 
                      :y="minCoordinate + 2" 
                      text-anchor="end" 
                      :font-size="8" 
                      font-weight="bold"
                    >
                        {{ min.toFixed(0) }}
                    </text>
                    <circle
                      class="linut__tick" 
                      :cx="xMargin" 
                      :cy="minCoordinate" 
                      r="1" 
                    />
                </g>

                <!-- X AXIS GRID & LABELS -->
                <g 
                  class="linut__xTicks" 
                  v-if="settings.showGrid"
                >
                    <line 
                      v-for="(_xTick, i) in maxSeriesLength" 
                      class="linut__grid"
                      :key="`tick_${i}`"
                      :x1="((width - xMargin) * i) / maxSeriesLength + xMargin"
                      :x2="((width - xMargin) * i) / maxSeriesLength + xMargin" 
                      :y1="maxCoordinate" 
                      :y2="minCoordinate" 
                    />
                </g>

                <g 
                  class="linut__xLabels" 
                  v-if="settings.showXLabels"
                >
                    <text 
                      v-for="(_xLabel, i) in maxSeriesLength" 
                      text-anchor="middle"
                      :key="`xLabel_${i}`"
                      :x="((width - xMargin) * i) / maxSeriesLength + xMargin + donutSize()"
                      :y="height - legendMargin + 16" font-size="8"
                      >
                        {{ xLabels[i] }}
                    </text>
                </g>
            </g>

            <!-- LINE CHART -->
            <g 
              class="linut__plots" 
              v-if="isLine"
              >
                <g 
                  v-for="(serie, i) in plots" 
                  :key="`serie_plot_${i}`"
                  >
                    <g 
                      v-for="(plot,k) in serie.data" 
                      :key="`plot_circle_${i}_${k}`" 
                      @pointerenter="showTooltip(i)" 
                      @pointerleave="hideTooltip"
                      >
                        <circle
                          v-if="plot.value !== null && settings.showPlots && !segregated.includes(i)"
                          class="linut__plot"
                          :cx="plot.x"
                          :cy="plot.y"
                          :fill="serie.color"
                          :r="2"
                        />
                    </g>
                    <g 
                      v-for="(plot, k) in serie.data" 
                      :key="`plot_line_${i}_${k}`"
                      >
                        <line
                          class="linut__plot-line"
                          v-if="
                            k < serie.data.length - 1 &&
                            plot.value !== null &&
                            serie.data[k + 1].value !== null && !segregated.includes(i)
                          "
                          :x1="plot.x"
                          :x2="serie.data[k + 1].x"
                          :y1="plot.y"
                          :y2="serie.data[k + 1].y"
                          :stroke="serie.color"
                          :stroke-width="lineThickness"
                        />
                    </g>
                    <g v-if="settings.showPlotLabels && !segregated.includes(i)">
                        <g 
                          v-for="(plot,k) in serie.data" 
                          :key="`plot_label_${i}_${k}`"
                          >
                        <g 
                          v-if="plot.value !== null" 
                          @pointerenter="showTooltip(k)" 
                          @pointerleave="hideTooltip"
                          >
                            <rect
                                class="linut__plot-label__wrapper" 
                                rx="5" 
                                :x="plot.x - (applyMinSize(plot.value.toFixed(0).length * 7, 10) / 2)" 
                                :y="plot.y - 5"
                                :width="applyMinSize(plot.value.toFixed(0).length * 7, 10)" 
                                :height="10" 
                                :fill="serie.color"
                            />
                            <rect
                                class="linut__plot-label__wrapper--inside" 
                                rx="5" 
                                :x="(plot.x - (applyMinSize(plot.value.toFixed(0).length * 7, 10) / 2)) + 1" 
                                :y="plot.y - 4" 
                                :width="applyMinSize(plot.value.toFixed(0).length * 7, 10) - 2" 
                                :height="8" 
                                fill="white"
                            />
                            <text 
                                class="linut__plot-label" 
                                :x="plot.x" 
                                :y="plot.y + 2.5" 
                                text-anchor="middle"
                                >
                                {{ plot.value.toFixed(0) }}
                            </text>
                            </g>
                        </g>
                    </g>

                </g>
            </g>

            <!-- DONUT CHART -->
            <g v-if="!isLine">
                <g 
                  v-for="(donut, i) in donutDataset" 
                  :key="`donut_view_${i}`"
                  >
                    <g>
                        <line
                          class="linut__plot-line"
                          v-if="
                              !thickDonutLinks &&
                              i < donutDataset.length - 1 &&
                              donut.total &&
                              donutDataset[i + 1].total
                          "
                          :x1="xPosition(i)"
                          :x2="xPosition(i + 1)"
                          :y1="yPosition(donut)"
                          :y2="yPosition(donutDataset[i + 1])"
                          stroke="#aaa"
                        />
                        <path
                          class="linut__plot-line"
                          v-if="
                              thickDonutLinks &&
                              i < donutDataset.length - 1 &&
                              donut.total &&
                              donutDataset[i + 1].total
                          "
                          :d="`M ${xPosition(i) - donutSize() / 2}, ${yPosition(donut)} ${xPosition(i) + donutSize() / 2},${yPosition(donut)} ${xPosition(i+1) + donutSize() / 2},${yPosition(donutDataset[i+1])} ${xPosition(i+1) - donutSize() / 2},${yPosition(donutDataset[i+1])}Z`"
                          stroke="#eee"
                          fill="rgba(0,0,0,0.05)"
                        />
                        <circle
                          v-if="!donut.total"
                          class="linut__tick" 
                          :cx="xPosition(i)" 
                          :cy="yPosition(donut)" 
                          r="1" 
                        />
                    </g>

                    <g 
                      v-if="donut.total" 
                      @pointerover="showTooltip(i)" 
                      @pointerout="hideTooltip"
                      >
                       <path
                        v-for="(arc, j) in makeDonut(
                            donut,
                            xPosition(i),
                            yPosition(donut),
                            donutSize(-2),
                            donutSize(-2)
                        )"
                        :key="`arc_${j}`"
                        :d="arc.path"
                        :stroke="arc.color"
                        :stroke-width="5"
                        :style="`fill:none; ${fillSingleHollow && segregated.length === dataset.length - 1 ? 'opacity:0' : 'opacity:1'};`"
                        />
                        <defs>
                          <radialGradient id="hollowGradient">
                            <stop offset="10%" stop-color="white" />
                            <stop offset="95%" :stop-color="fillSingleHollow && segregated.length === dataset.length - 1 ? nonSegregated.color : 'white'" />
                          </radialGradient>
                        </defs>
                        <circle
                          :cx="xPosition(i)"
                          :cy="yPosition(donut)"
                          :r="donutSize(fillSingleHollow && segregated.length === dataset.length - 1 ? -2 : -3)"
                          fill="url(#hollowGradient)"
                        />
                    </g>
                    
                    <text
                        v-if="settings.showPlotLabels"
                        :x="xPosition(i)"
                        :y="yPosition(donut) - donutSize(donut.total ? 0 : -20) - 2"
                        text-anchor="middle"
                        font-size="7"
                        font-weight="bold"
                    >
                        {{ donut.total.toFixed(0).toLocaleString() }}
                    </text>
                </g>
            </g>

            <!-- LEGEND -->
            <g v-if="settings.showLegend">
                <foreignObject 
                  :x="0" 
                  :y="height - legendMargin / 2" 
                  width="100%" 
                  :height="`${legendMargin}px`"
                  >
                    <div class="linut__legend__wrapper">
                    <div 
                      v-for="(legend, i) in dataset" 
                      :key="`legend_${i}`" 
                      @click="segregate(i)" 
                      :class="{'linut__legend__item' : true, 'linut__legend__item--segregated': segregated.includes(i)}"
                      >
                        <span 
                          class="linut__legend__marker" 
                          :style="`color:${legend.color}`"
                        >       	
                          &#9679;
                        </span>
                        <span class="linut__legend__label">  
                        {{ legend.name }}
                        </span>
                    </div>
                    </div>
                </foreignObject>
            </g>
        </svg>

        <!-- OPTIONS -->
        <div 
          v-if="settings.showOptionsDrawer" 
          class="linut__options"
          >
          <div 
            v-show="!isDrawerOpen" 
            @click="isDrawerOpen = true" 
            :class="{'linut__options__drawer' : true, 'linut__options__drawer--closed': !isDrawerOpen}"
            >
            <svg 
              style="width:24px;height:24px" 
              viewBox="0 0 24 24"
              >
              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
            </svg>
          </div>
        </div>
        <!-- OPTIONS MODAL -->
          <div 
            v-if="isDrawerOpen" 
            class="linut__modal__overlay" 
            @click="isDrawerOpen = false"
          />
          <div 
            class="linut__modal" 
            id="optionsDrawerOpen" 
            v-if="isDrawerOpen"
            :class="{'linut__options__drawer--open': true}"
            >
            <div class="linut__options__drawer__content">
              <div 
                class="linut__options__drawer__close" 
                @click="isDrawerOpen = !isDrawerOpen"
                >
                <svg 
                  style="width:24px;height:24px;" 
                  viewBox="0 0 24 24"
                  >
                    <path 
                      fill="currentColor" 
                      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" 
                    />
                </svg>
              </div>
              <div class="linut__options__drawer__content__items">
                <div 
                  class="linut__options__drawer__content__items__item" 
                  v-for="(menuItem, i) in modalMenu" 
                  :key="`modal_menu_${i}`"
                  >
                  <input 
                    :id="menuItem.name" 
                    :name="menuItem.name" 
                    type="checkbox" 
                    :checked="settings[menuItem.reference]" 
                    v-model="settings[menuItem.reference]"
                    >
                  <label :for="menuItem.name">
                    {{ translations[menuItem.translation] }}
                  </label>
                </div>
              </div>
            </div>
          </div>
    </div>
</template>

<script >
export default {
  name: "Linut",
  props: {
    dataset: {
      type: Array,
      default() {
        return [
          {
            id: "01",
            name: "Positive",
            color: "#15B300",
            data: [1, 23, 12, 10, 20, 21, 18, 20, 21, 14, 6, 16],
          },
          {
            id: "02",
            name: "Negative",
            color: "#F17171",
            data: [1, 13, 3, 2, 1, 1.3, 2, 3, 5, 1, 2, 7],
          },
          {
            id: "03",
            name: "Neutral",
            color: "#ccc",
            data: [1, 0.2, 1, 4, 5, 3, 4, 5, 8, 3, 2, 2],
          },
          {
            id: "04",
            name: "Mixed",
            color: "#ebc034",
            data: [1, 1, 3.5, 1.3, 4, 7, 5, 8, 3, 9, 11, 11],
          },
        ];
      },
    },
    fillSingleHollow: {
      type: Boolean,
      default: false,
    },
    fontFamily: {
      type: String,
      default: "Product Sans",
    },
    lineThickness: {
      type: Number,
      default: 2
    },
    showLineFirst: {
      type: Boolean,
      default: false,
    },
    showDonutTooltip: {
      type: Boolean,
      default: true,
    },
    showGrid: {
      type: Boolean,
      default: true,
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
    showPlotLabels: {
      type: Boolean,
      default: true,
    },
    showPlots: {
      type: Boolean,
      default: true,
    },
    hasTooltip: {
      type: Boolean,
      default: true,
    },
    showControls: {
      type: Boolean,
      default: true,
    },
    showOptionsDrawer: {
      type: Boolean,
      default: true,
    },
    showXLabels: {
      type: Boolean,
      default: true,
    },
    showYLabels: {
      type: Boolean,
      default: true,
    },
    sizeRatio: {
      type: Number,
      default: 0.618,
    },
    sparkLine: {
      type: Boolean,
      default: false,
    },
    thickDonutLinks: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    xLabels: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      clientX: 0,
      clientY: 0,
      height: 300 * this.sizeRatio,
      isDrawerOpen: false,
      isLine: this.showLineFirst,
      isTooltip: false,
      modalMenu: [
        {
          name: "cb_showControls",
          reference: "showControls",
          translation: "controls"
        },
        {
          name: "cb_showLegend",
          reference: "showLegend",
          translation: "legend"
        },
        {
          name: "cb_showGrid",
          reference: "showGrid",
          translation: "grid"
        },
        {
          name: "cb_hasTooltip",
          reference: "hasTooltip",
          translation: "tooltip"
        },
        {
          name: "cb_showPlotLabels",
          reference: "showPlotLabels",
          translation: "plotLabels"
        },
        {
          name: "cb_showXLabels",
          reference: "showXLabels",
          translation: "timeLabels"
        },
        {
          name: "cb_showYLabels",
          reference: "showYLabels",
          translation: "valueLabels"
        },
      ],
      segregated: [],
      selectedIndex: undefined,
      selectedSeries: [],
      settings: {
        hasTooltip: this.hasTooltip,
        showPlots: this.showPlots,
        showPlotLabels: this.showPlotLabels,
        showGrid: this.showGrid,
        showLegend: this.showLegend,
        showXLabels: this.showXLabels,
        showYLabels: this.showYLabels,
        showControls: this.showControls,
        showOptionsDrawer: this.showOptionsDrawer,
      },
      titleMargin: 50,
      tooltipContent: "",
      translations: {
        grid: "Grid",
        legend: "Legend",
        tooltip: "Tooltip",
        plotLabels: "Plot labels",
        timeLabels: "Time labels (x)",
        valueLabels: "Value labels (y)",
        controls: "Chart switch"
      },
      width: 300,
    };
  },
  created() {
    window.addEventListener("pointermove", (e) => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    });
    if(this.sparkLine){
      this.settings = {
        hasTooltip: false,
        showPlots: false,
        showPlotLabels: false,
        showGrid: false,
        showLegend: false,
        showXLabels: false,
        showYLabels: false,
        showControls: false,
        showOptionsDrawer: false,
      }
    }
  },
  destroyed() {
    window.removeEventListener("pointermove", (e) => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    });
  },
  computed: {
    nonSegregated(){
      return this.dataset.find((el,i) => {
        return !this.segregated.includes(i);
      })
    },
    xMargin(){
      if(this.settings.showYLabels && this.isLine){
        return 30;
      }
      return 0;
    },
    donutDataset() {
      const arr = [];
      for (let i = 0; i < this.maxSeriesLength; i += 1) {
        let sumAtIndex = this.dataset
          .flatMap((serie) => {
            return serie.data[i];
          })
          .reduce((a, b) => Math.abs(a) + Math.abs(b), 0);

        if (sumAtIndex === 0) {
          sumAtIndex = 1;
        }
        arr.push(
          this.createDonutSerie(
            this.dataset
              .map((serie) => {
                return {
                  ...serie,
                  data: serie.data[i],
                  ratio: (Math.abs(serie.data[i]) / sumAtIndex) * 100,
                };
              })
              .filter((_serie, i) => {
                return !this.segregated.includes(i);
              })
          )
        );
      }
      return arr;
    },
    graphicHeight() {
      return this.minCoordinate - this.maxCoordinate;
    },
    legendMargin(){
      if(this.settings.showLegend){
        return 40;
      }
      return 10;
    },
    max() {
      return this.getMax(this.dataset.filter((_serie, i) => {
          return !this.segregated.includes(i);
        }))
    },
    maxCoordinate() {
      return this.titleMargin - (!this.settings.showControls ? 16 : 0);
    },
    maxDonutData() {
      return Math.max(...this.donutDataset.map(({ total }) => total));
    },
    maxNormalProportion() {
      return this.maxProportion / this.minMaxTotalProportion;
    },
    maxProportion() {
      return Math.abs(this.max) / this.graphicHeight;
    },
    maxSeriesLength() {
      return this.calcMax(this.dataset);
    },
    midCoordinate() {
      if(this.min > 0) return this.minCoordinate;
      return this.maxCoordinate + this.graphicHeight * this.maxNormalProportion;
    },
    min() {
      if(this.getMin(this.dataset) > 0) return 0;
      return this.getMin(this.dataset);
    },
    minCoordinate() {
      return this.height - this.legendMargin + (!this.settings.showXLabels ? 12 : 0);
    },
    minMaxTotalProportion() {
      return this.minProportion + this.maxProportion;
    },
    minProportion() {
      return Math.abs(this.min) / this.graphicHeight;
    },
    plots() {
      return this.dataset.map((serie) => {
        return {
          ...serie,
          data: serie.data.map((value, i) => {
            return {
              value,
              x: this.xMargin + i * ((this.width - this.xMargin) / serie.data.length) + ((this.width - this.xMargin) / serie.data.length) /2,
              y: this.normalize({
                value,
                midCoordinate: this.midCoordinate,
                max: this.max,
                maxCoordinate: this.maxCoordinate,
              }),
            };
          }),
        };
      });
    },
  },
  methods: {
    closeDrawer(){
      if(this.isDrawerOpen){
        this.isDrawerOpen = false;
      }
    },
    // GETTERS
    donutSize(precision = 0){
      const size = (this.width - this.xMargin) / this.maxSeriesLength / 2 + precision;
      if(size > 15 ? 15 + precision : size + precision < 0){
         return 15 + precision; 
      }
      return size > 15 ? 15 + precision : size + precision;
    },
    xPosition(index){
      return this.xMargin + index * ((this.width - this.xMargin) / this.maxSeriesLength) + ((this.width - this.xMargin) / this.maxSeriesLength / 2)

    },
    yPosition(donut){
      return (this.minCoordinate - this.donutSize(-6)) - ((donut.total / this.maxDonutData) * (this.graphicHeight - this.donutSize(6)))
    },
    // CALCULATORS
    applyMinSize(size, minSize) {
      if (size < minSize) {
        return minSize;
      }
      return size;
    },
    calcMax(serie) {
      return Math.max(
        ...serie.map((s) => {
          return s.data.length;
        })
      );
    },
    getMax(serie) {
      return Math.max(
        ...serie.flatMap((s) => {
          return s.data;
        })
      );
    },
    getMin(serie) {
      return Math.min(
        ...serie.flatMap((s) => {
          return s.data;
        })
      );
    },
    normalize({ value, midCoordinate, max, maxCoordinate }) {
      return midCoordinate - (value / max) * (midCoordinate - maxCoordinate);
    },
    // TOGGLES
    hideTooltip() {
      this.isTooltip = false;
      this.selectedIndex = undefined;
    },
    segregate(index) {
      if (this.segregated.includes(index)) {
        this.segregated = this.segregated.filter((val) => val !== index);
      } else {
        this.segregated.push(index);
      }
      if (this.segregated.length === this.dataset.length) {
        this.segregated = [];
      }
    },
    showTooltip(index) {
      this.isTooltip = true;
      this.selectedIndex = index;
      let sumAtIndex = this.dataset
        .flatMap((serie) => {
          return serie.data[this.selectedIndex];
        })
        .filter((_serie, i) => {
          return !this.segregated.includes(i);
        })
        .reduce((a, b) => Math.abs(a) + Math.abs(b), 0);

      if (sumAtIndex === 0) {
        sumAtIndex = 1;
      }

      this.selectedSeries = this.dataset
        .map((serie) => {
          return {
            ...serie,
            data: serie.data[this.selectedIndex],
            ratio:
              (Math.abs(serie.data[this.selectedIndex]) / sumAtIndex) * 100,
          };
        })
        .filter((_serie, i) => {
          return !this.segregated.includes(i);
        });
      let html = "";

      this.selectedSeries.forEach(serie => {
        html += `
          <div>
            <span style="color:${serie.color}; font-size:1.6em;">&#9679;</span>
            <span>${serie.name} : </span>
            <b>${serie.data ? serie.data.toFixed(0) : 0}</b>
            <span>(${serie.ratio.toFixed(1)}%)</span>
          </div>
        `;
      })

      this.tooltipContent = html;
    },
    // UTILS
    sumDonut(donut) {
      return donut.series
        .map((serie) => serie.value)
        .reduce((a, b) => a + b, 0);
    },
    // DONUT GENERATION
    addVector([a1, a2], [b1, b2]) {
      return [a1 + b1, a2 + b2];
    },
    createArc([cx, cy], [rx, ry], [position, ratio], phi) {
      ratio = ratio % (2 * Math.PI);
      const rotMatrix = this.rotateMatrix(phi);
      const [sX, sY] = this.addVector(
        this.matrixTimes(rotMatrix, [
          rx * Math.cos(position),
          ry * Math.sin(position),
        ]),
        [cx, cy]
      );
      const [eX, eY] = this.addVector(
        this.matrixTimes(rotMatrix, [
          rx * Math.cos(position + ratio),
          ry * Math.sin(position + ratio),
        ]),
        [cx, cy]
      );
      const fA = ratio > Math.PI ? 1 : 0;
      const fS = ratio > 0 ? 1 : 0;
      return {
        startX: sX,
        startY: sY,
        endX: eX,
        endY: eY,
        path: `M${sX} ${sY} A ${[
          rx,
          ry,
          (phi / (2 * Math.PI)) * 360,
          fA,
          fS,
          eX,
          eY,
        ].join(" ")}`,
      };
    },
    createDonutSerie(source) {
      return {
        id: `donut_${Math.random()}`,
        name: `donut_${Math.random()}`,
        series: source.map(({ name, color, data }) => {
          return {
            name,
            color,
            value: Math.abs(data),
            valueLabel: data,
          };
        }),
        total: source
          .map(({ data }) => data)
          .reduce((a, b) => Math.abs(a) + Math.abs(b), 0),
      };
    },
    matrixTimes([[a, b], [c, d]], [x, y]) {
      return [a * x + b * y, c * x + d * y];
    },
    makeDonut(item, cx, cy, rx, ry) {
      let { series } = item;
      if (!series)
        return {
          ...series,
          proportion: 0,
          ratio: 0,
          path: "",
          startX: 0,
          startY: 0,
          endX: 0,
          center: {},
        };
      const sum = [...series]
        .map((serie) => serie.value)
        .reduce((a, b) => a + b, 0);
      const ratios = [];
      let acc = 0;
      for (let i = 0; i < series.length; i += 1) {
        let proportion = series[i].value / sum;
        const ratio = proportion * (Math.PI * 1.9999); // (Math.PI * 2) fails to display a donut with only one value > 0 as it goes full circle again
        // midProportion & midRatio are used to find the midpoint of the arc to display markers
        const midProportion = series[i].value / 2 / sum;
        const midRatio = midProportion * (Math.PI * 2);
        const { startX, startY, endX, endY, path } = this.createArc(
          [cx, cy],
          [rx, ry],
          [acc, ratio],
          110
        );
        ratios.push({
          ...series[i],
          proportion,
          ratio: ratio,
          path,
          startX,
          startY,
          endX,
          endY,
          center: this.createArc(
            [cx, cy],
            [rx * 1.45, ry * 1.45],
            [acc, midRatio],
            110
          ), // center of the arc, to display the marker. rx & ry are larger to be displayed with a slight offset
        });
        acc += ratio;
      }
      return ratios;
    },
    rotateMatrix(x) {
      return [
        [Math.cos(x), -Math.sin(x)],
        [Math.sin(x), Math.cos(x)],
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
hr {
  border-top: 1px solid #ccc;
}

.linut {
  background: white;
  border-radius: inherit;
  overflow: visible;
  padding: 2% 5% 3% 5%;
  user-select: none;

  &__axis {
    stroke-width: 0.5;
    stroke: grey;
  }

  &__controls {
    align-items: center;
    display: flex;
    height: 16px;
    justify-content: center;
    &__label {
      font-size: 8px;
      &--left {
        margin-right: -10px;
      }
      &--right {
        margin-left: -10px;
      }
    }
  }

  &__main {
    position: relative;
  }

  &__mid-axis,
  &__grid {
    stroke-dasharray: 1;
    stroke-width: 0.3;
    stroke: grey;
  }

  &__legend {
    &__item {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      gap: 3px;
      justify-content: center;
      &--segregated {
        opacity: 0.4;
      }
    }

    &__label {
      font-size: 9px;
      line-height: 10px;
      text-align:left;
    }

    &__marker {
      font-size: 14px;

      &--tooltip {
        font-size: 18px;
      }
    }

    &__wrapper {
      align-items: center;
      display: flex;
      flex-wrap: nowrap;
      gap: 12px;
      justify-content: center;
      width: 100%;
    }
  }

  &__options {
    z-index: 2;
    &__drawer {
      &__content{
        max-width: 300px;
        position: relative;
        user-select: none;
        width: fit-content;
        &__items {
          align-items:start;
          display: flex;
          flex-direction: column;
          padding: 24px 24px 12px 24px;
          &__item{
            align-items:center;
            display: flex;
            gap: 6px;
            justify-content: center;
          }
        }
      }
      &__close{
        cursor: pointer;
        position: absolute;
        right:0;
        top: 0;
      }
      &--closed {
        align-items:center;
        background: white;
        border-radius: 50%;
        border: 1px solid rgb(196, 196, 196);
        cursor: pointer;
        display: flex;
        justify-content:center;
        padding: 6px;
        position: absolute;
        right: 6px;
        top: 6px;
        svg{
          fill: grey;
        }
        &:hover {
          // box-shadow: 0px 3px 6px #6375dd7c;
          border: 1px solid #6376dd;
          svg {
            fill: #6376dd;
          }
        }
      }
      &--open {
        background: white;
        border-radius: 8px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        right: 3px;
        padding: 12px;
        position: absolute;
        top: 3px;
        // transform: translate(-50%,-50%);
      }
    }
  }

  &__modal {
    animation: modal 0.2s ease-in-out;
    transition: transform 0.2s ease-in;
    &__overlay {
      background: transparent;
      display: block;
      height: 100%;
      left: 0;
      position: absolute;
      top:0;
      width: 100%;
    }
  }

  @keyframes modal {
    from {
      transform: scale(0.6,0.9) translateX(100px);
      opacity: 0;
    }
    to {
      transform: scale(1,1) translateX(0);
      opacity: 1;
    }
  }

  &__plot-label {
    font-size: 7px;
    font-weight: bold;
  }

  &__switch {
    display: inline-block;
    height: 28px;
    position: relative;
    transform: scale(0.4, 0.4);
    width: 54px;
    input {
      height: 0;
      opacity: 0;
      width: 0;
    }
    input + .linut__slider {
      background-color: #6376dd;
    }
    input:focus + .linut__slider {
      box-shadow: 0 0 1px #6376dd;
    }
    input:checked + .linut__slider:before {
      -ms-transform: translateX(26px);
      -webkit-transform: translateX(26px);
      transform: translateX(26px);
    }
  }

  &__slider {
    -webkit-transition: 0.4s;
    background-color: #ccc;
    border-radius: 15px;
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.4s;
    &::before {
      -webkit-transition: 0.4s;
      background-color: white;
      border-radius: 50%;
      bottom: 4px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
      content: "";
      height: 20px;
      left: 4px;
      position: absolute;
      transition: 0.4s;
      width: 20px;
    }
  }

  &__tick {
    fill: grey;
  }

  &__tooltip {
    background: white;
    border-radius: 8px;
    border: 1px solid #eee;
    box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.3);
    display: block;
    padding: 12px;
    position: fixed;
    width: fit-content;
    z-index: 10000;
    &__donut {
      margin-left: 32px;
      margin-top: 32px;
      padding: 6px;
    }
    &__donut-type-content{
      align-items:start;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 18px;
      padding: 12px 0;
    }
    &--regular {
      padding: 12px 24px;
    }
  }
  &__donut {
    align-items: center;
    background: white;
    border-radius: 50%;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    display: flex;
    height: 200px;
    justify-content: center;
    padding: 12px;
    position: fixed;
    width: 200px;
  }
}
rect {
  /** TODO: make it a class depending on an animateRescale prop */
  transition: all 0.2s ease-in-out;
}
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
