<template>
    <div class="cockpit-mini-chart">
        <svg
            width="100%"
            :viewBox="`0 0 ${height * formatA} ${height}`"
            :style="`font-family:${fontFamily}`"
            @pointermove="setClientPosition($event)"
            class="main-svg"
        >
            <!-- CHARTS WITH A SINGLE DATA POINT -->
            <g v-if="isSingle">
                <!-- Title -->
                <foreignObject
                    style="overflow: visible;"
                    :x="0"
                    :y="10"
                    width="100%"
                    height="1em"
                >
                    <div
                        class="title"
                        :style="`font-family:${fontFamily} !important;`"
                    >
                        <!-- Titles for 'score-only & nps-only' use the label of the datapoint -->
                        <span
                            v-if="
                                isChartOfType('score-only') ||
                                    isChartOfType('nps-only')
                            "
                        >
                            {{ data.dataset[0].label }}
                        </span>
                        <!-- All other types of charts use the main title -->
                        <span v-else>
                            {{ data.title }}
                        </span>
                    </div>
                </foreignObject>

                <!-- Chart of type 'kpi-only' -->
                <g v-if="isChartOfType('kpi-only')">
                    <!-- Value & ratio -->
                    <foreignObject :x="0" :y="35" height="100" width="100%">
                        <div class="center-text">
                            <b class="score">
                                {{ data.dataset[0].kpi.value }}
                                <span
                                    v-if="data.dataset[0].kpi.showRatio"
                                    class="kpi-ratio"
                                >
                                    ({{ data.dataset[0].kpi.ratio }})
                                </span>
                            </b>
                        </div>
                        <div
                            class="kpi-comment"
                            style="text-align:center"
                            v-if="data.dataset[0].kpi.hasTarget"
                        >
                            {{ data.dataset[0].kpi.targetTranslation }} :
                            {{ data.dataset[0].kpi.target }}
                            <svg
                                width="8"
                                height="8"
                                viewBox="0 0 12 12"
                                fill="none"
                                style="margin-bottom: -2px"
                            >
                                <g v-if="data.dataset[0].kpi.isOnTarget">
                                    <path
                                        :d="thumbUp[0]"
                                        stroke="#15B300"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        :d="thumbUp[1]"
                                        stroke="#15B300"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </g>
                                <g v-else>
                                    <path
                                        :d="thumbDown[0]"
                                        stroke="#F17171"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        :d="thumbDown[1]"
                                        stroke="#F17171"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </g>
                            </svg>
                        </div>
                    </foreignObject>
                </g>

                <!-- Chart of type 'ranking-only' -->
                <g v-if="isChartOfType('ranking-only')">
                    <!-- Ranking & base -->
                    <foreignObject :x="0" :y="35" height="100" width="100%">
                        <div
                            :style="
                                `color:${
                                    colors.tonalities[
                                        getProgressName(
                                            data.dataset[0].progression
                                        )
                                    ]
                                } !important;`
                            "
                            class="center-text"
                        >
                            <b class="score">
                                {{ data.dataset[0].score.toLocaleString() }}
                            </b>
                            <b class="score-base">
                                /{{ data.dataset[0].scoreBase }}
                            </b>
                        </div>
                        <div class="ranking-progression-comment">
                            <b
                                :style="
                                    `color:${
                                        colors.tonalities[
                                            getProgressName(
                                                data.dataset[0].progression
                                            )
                                        ]
                                    } !important`
                                "
                            >
                                {{
                                    data.dataset[0].progression >= 0
                                        ? `+${data.dataset[0].progression}`
                                        : data.dataset[0].progression
                                }}
                            </b>
                            <span>
                                {{ data.dataset[0].label }}
                            </span>
                        </div>
                    </foreignObject>
                </g>

                <!-- Chart of type 'nps-only -->
                <g v-if="isChartOfType('nps-only')">
                    <!-- NPS Score -->
                    <foreignObject :x="0" :y="38" height="100" width="100%">
                        <div
                            :style="
                                `color:${getNpsColor(
                                    data.dataset[0].score
                                )};`
                            "
                            class="center-text"
                        >
                            <b class="score">
                                {{
                                    data.dataset[0].score >= 0
                                        ? `+${data.dataset[0].score.toLocaleString()}`
                                        : data.dataset[0].score.toLocaleString()
                                }}
                            </b>
                        </div>
                    </foreignObject>
                </g>

                <!-- Chart of type 'score-only' -->
                <g v-if="isChartOfType('score-only')">
                    <!-- Score & base -->
                    <foreignObject :x="0" :y="30" height="100" width="100%">
                        <div
                            :style="
                                `color:${getScoreColor(
                                    data.dataset[0].score
                                )};`
                            "
                            class="center-text"
                        >
                            <b class="score">
                                {{ data.dataset[0].score.toLocaleString() }}
                            </b>
                            <b class="score-base">
                                /{{ data.dataset[0].scoreBase }}
                            </b>
                        </div>
                        <div class="center-text">
                            <svg height="24" viewBox="0 0 29 29">
                                <path
                                    :stroke="
                                        getScoreColor(data.dataset[0].score)
                                    "
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    :d="
                                        smileys[
                                            getTonalityName(
                                                data.dataset[0].score
                                            )
                                        ]
                                    "
                                    fill="none"
                                />
                            </svg>
                        </div>
                    </foreignObject>
                </g>

                <!-- Chart of type 'score-ctl' -->
                <g v-if="isChartOfType('score-ctl')">
                    <!-- Score & base -->
                    <foreignObject :x="0" :y="30" height="100%" width="50%">
                        <div
                            :style="
                                `color:${getScoreColor(
                                    data.dataset[0].score
                                )};`
                            "
                            class="center-text"
                        >
                            <b class="score">
                                {{ data.dataset[0].score.toLocaleString() }}
                            </b>
                            <b class="score-base">
                                /{{ data.dataset[0].scoreBase }}
                            </b>
                        </div>
                        <div class="center-text">
                            <svg height="24" viewBox="0 0 29 29">
                                <path
                                    :stroke="
                                        getScoreColor(data.dataset[0].score)
                                    "
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    :d="
                                        smileys[
                                            getTonalityName(
                                                data.dataset[0].score
                                            )
                                        ]
                                    "
                                    fill="none"
                                />
                            </svg>
                        </div>
                    </foreignObject>
                    <foreignObject
                        :x="centerX - 5"
                        :y="40"
                        height="100%"
                        width="50%"
                    >
                        <div class="score-ctl-progression">
                            <b
                                :style="
                                    `color:${
                                        colors.tonalities[
                                            getProgressName(
                                                data.dataset[0].progression
                                            )
                                        ]
                                    } !important;`
                                "
                            >
                                {{
                                    data.dataset[0].progression >= 0
                                        ? `+${data.dataset[0].progression}`
                                        : data.dataset[0].progression
                                }}
                            </b>
                            <span>
                                {{ data.dataset[0].label }}
                            </span>
                        </div>
                    </foreignObject>
                </g>

                <!-- Chart of type 'score-tonality-single' -->
                <g v-if="isChartOfType('score-tonality')">
                    <!-- Score & base -->
                    <foreignObject :x="0" :y="26" height="32" width="100%">
                        <div
                            :style="
                                `color:${getScoreColor(
                                    data.dataset[0].score
                                )};`
                            "
                            class="center-text"
                        >
                            <b class="score">
                                {{ data.dataset[0].score.toLocaleString() }}
                            </b>
                            <b class="score-base">
                                /{{ data.dataset[0].scoreBase }}
                            </b>
                        </div>
                    </foreignObject>

                    <!-- Bar chart -->
                    <g
                        v-for="(tonality, i) in createTonalityBarChart(
                            data.dataset[0].tonalities
                        )"
                        :key="`tonality_selected_${i}`"
                    >
                        <rect
                            :fill="colors.tonalities[tonality.name]"
                            :x="tonality.x1 + 10"
                            :y="66"
                            :width="tonality.acc - tonality.x1"
                            height="5"
                        />
                    </g>
                    <g class="minibar-white-border">
                        <rect
                            rx="3.5"
                            stroke-width="2"
                            height="7"
                            width="120"
                            y="65"
                            x="10"
                            stroke="white"
                            fill="none"
                        />
                    </g>

                    <!-- Legend with smileys -->
                    <foreignObject :x="0" :y="80" height="32" width="100%">
                        <div class="legend__wrapper">
                            <div
                                class="legend__item"
                                v-for="(tonality, i) in formatTonalities(
                                    data.dataset[0].tonalities
                                )"
                                :key="`legend_tonality_${i}`"
                            >
                                <svg
                                    viewBox="0 0 29 29"
                                    height="16"
                                    width="16"
                                    style="margin-bottom:-3px"
                                >
                                    <path
                                        :d="smileys[tonality.name]"
                                        fill="none"
                                        :stroke="
                                            colors.tonalities[tonality.name]
                                        "
                                        stroke-linecap="round"
                                        stroke-width="2"
                                    />
                                </svg>
                                <b>{{ (tonality.ratio * 100).toFixed(0) }}%</b>
                            </div>
                        </div>
                    </foreignObject>
                </g>
            </g>

            <!-- CHARTS WITH MULTIPLE DATA POINTS -->
            <template v-else>
                <!-- Chart of type 'nps-only' with duo display -->
                <g v-if="isChartOfType('nps-only')">
                    <g
                        v-for="(datapoint, i) in data.dataset"
                        :key="`datapoint_${i}`"
                    >
                        <!-- Title -->
                        <foreignObject
                            style="overflow: visible; padding: 0 5px"
                            :x="i === 0 ? 0 : centerX"
                            :y="10"
                            width="50%"
                            height="1em"
                        >
                            <div
                                class="title center-text"
                                :style="
                                    `font-family:${fontFamily} !important;`
                                "
                            >
                                <!-- Title for 'score-only' uses the name of the datapoint -->
                                <span>
                                    {{ datapoint.label }}
                                </span>
                            </div>
                        </foreignObject>
                        <!-- NPS Score -->
                        <foreignObject
                            :x="i === 0 ? 0 : centerX"
                            :y="38"
                            height="100"
                            width="50%"
                        >
                            <div
                                :style="
                                    `color:${getNpsColor(
                                        datapoint.score
                                    )};`
                                "
                                class="center-text"
                            >
                                <b class="score">
                                    {{
                                        datapoint.score >= 0
                                            ? `+${datapoint.score.toLocaleString()}`
                                            : datapoint.score.toLocaleString()
                                    }}
                                </b>
                            </div>
                        </foreignObject>
                    </g>
                    <line
                        :x1="centerX"
                        :x2="centerX"
                        :y1="10"
                        :y2="height - 10"
                        stroke-width="0.6"
                        stroke="#E1E5E8"
                        stroke-linecap="round"
                    />
                </g>

                <!-- Chart of type 'score-only' with duo display -->
                <g v-if="isChartOfType('score-only')">
                    <g
                        v-for="(datapoint, i) in data.dataset"
                        :key="`datapoint_${i}`"
                    >
                        <!-- Title -->
                        <foreignObject
                            style="overflow: visible; padding: 0 5px"
                            :x="i === 0 ? 0 : centerX"
                            :y="10"
                            width="50%"
                            height="1em"
                        >
                            <div
                                class="title"
                                :style="`font-family:${fontFamily} !important;`"
                            >
                                <!-- Title for 'score-only' uses the name of the datapoint -->
                                <span>
                                    {{ datapoint.label }}
                                </span>
                            </div>
                        </foreignObject>
                        <!-- Score & base -->
                        <foreignObject
                            :x="i === 0 ? 0 : centerX"
                            :y="30"
                            height="100"
                            width="50%"
                        >
                            <div
                                :style="
                                    `color:${getScoreColor(
                                        datapoint.score
                                    )};`
                                "
                                class="center-text"
                            >
                                <b class="score">
                                    {{ datapoint.score.toLocaleString() }}
                                </b>
                                <b class="score-base">
                                    /{{ datapoint.scoreBase }}
                                </b>
                            </div>
                            <div class="center-text">
                                <svg height="24" viewBox="0 0 29 29">
                                    <path
                                        :stroke="getScoreColor(datapoint.score)"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        :d="
                                            smileys[
                                                getTonalityName(datapoint.score)
                                            ]
                                        "
                                        fill="none"
                                    />
                                </svg>
                            </div>
                        </foreignObject>
                    </g>
                    <line
                        :x1="centerX"
                        :x2="centerX"
                        :y1="10"
                        :y2="height - 10"
                        stroke-width="0.6"
                        stroke="#E1E5E8"
                        stroke-linecap="round"
                    />
                </g>

                <!-- Chart of type 'score-tonality-list' -->
                <g v-if="isChartOfType('score-tonality')">
                    <!-- Title -->
                    <foreignObject
                        style="overflow: visible;"
                        :x="0"
                        :y="5"
                        width="100%"
                        height="1em"
                    >
                        <div
                            class="title"
                            :style="`font-family:${fontFamily} !important;`"
                        >
                            {{ data.title }}
                        </div>
                    </foreignObject>

                    <!-- Bar charts -->
                    <g
                        v-for="(datapoint, i) in data.dataset"
                        :key="`datapoint_${i}`"
                    >
                        <g
                            v-for="(tonality, j) in createTonalityBarChart(
                                datapoint.tonalities
                            )"
                            :key="`tonality_selected_${j}`"
                        >
                            <rect
                                :fill="colors.tonalities[tonality.name]"
                                :x="tonality.x1 + 10"
                                :y="
                                    ((i + 1) * (height - 30)) /
                                        data.dataset.length +
                                        10
                                "
                                :width="tonality.acc - tonality.x1"
                                height="5"
                                @pointerover="
                                    tooltipActive = true;
                                    createTooltip(datapoint);
                                "
                                @pointerout="tooltipActive = false"
                            />
                        </g>
                        <g class="minibar-white-border">
                            <rect
                                rx="3"
                                stroke-width="2.5"
                                height="6"
                                width="120"
                                :y="
                                    ((i + 1) * (height - 30)) /
                                        data.dataset.length +
                                        10
                                "
                                x="10"
                                stroke="white"
                                fill="none"
                            />
                        </g>

                        <!-- datapoint name -->
                        <text
                            :x="10"
                            :y="
                                ((i + 1) * (height - 30)) /
                                    data.dataset.length +
                                    8
                            "
                            font-size="7"
                            fill="#4E5D78"
                        >
                            {{ datapoint.label }}
                        </text>
                    </g>
                </g>
            </template>
        </svg>

        <!-- TOOLTIP -->
        <div
            class="tooltip"
            v-if="tooltipActive"
            :style="
                `top:${clientY}px; left:${clientX}px; font-family:${fontFamily}`
            "
            v-html="tooltipContent"
        ></div>
    </div>
</template>

<script>
export default {
    name: "MiniChart",
    props: {
        data: {
            type: Object,
            default() {
                /** EXAMPLES FOR EACH TYPE OF POSSIBLE CHARTS
                 *
                 *  1. 'kpi-only' (must be single datapoint)
                 *
                 *     {
                 *          dataset: [
                 *              {
                 *                  label: null,
                 *                  score: null,
                 *                  scoreBase: null,
                 *                  progression: null,
                 *                  tonalities: null,
                 *                  kpi: {
                 *                      hasTarget: true,
                 *                      isOnTarget: false,
                 *                      ratio: null,
                 *                      showRatio: false,
                 *                      target: "90%",
                 *                      targetTranslation: "GOAL",
                 *                      value: "84%"
                 *                  }
                 *              }
                 *          ],
                 *          title: "Processing time",
                 *          type: "kpi-only"
                 *     }
                 * ___________________________________________________
                 *
                 *  2. 'nps-only' (can be single or dual datapoints)
                 *
                 *      2.1 single datapoint
                 *
                 *      {
                 *          dataset: [
                 *              {
                 *                  label: "NPS Sales",
                 *                  score: 65,
                 *                  scoreBase: null,
                 *                  progression: null,
                 *                  tonalities: null,
                 *                  kpi: null,
                 *              }
                 *          ],
                 *          title: null,
                 *          type: "nps-only"
                 *      }
                 *
                 *      - - - - - - - - - - - - - - - - - - - - - - - -
                 *      2.2 dual datapoints
                 *
                 *      {
                 *          dataset: [
                 *              {
                 *                  label: "NPS Sales",
                 *                  score: 65,
                 *                  scoreBase: null,
                 *                  progression: null,
                 *                  tonalities: null,
                 *                  kpi: null,
                 *              },
                 *              {
                 *                  label: "NPS Service",
                 *                  score: -10,
                 *                  scoreBase: null,
                 *                  progression: null,
                 *                  tonalities: null,
                 *                  kpi: null,
                 *              }
                 *          ],
                 *          title: null,
                 *          type: "nps only"
                 *      }
                 * ___________________________________________________
                 *
                 *  3. 'ranking-only' (must be a single datapoint)
                 *
                 *      {
                 *          dataset: [
                 *              {
                 *                  label: "Places compared to last month",
                 *                  score: 1,
                 *                  scoreBase: 22,
                 *                  progression: 3,
                 *                  tonalities: null,
                 *                  kpi: null
                 *              }
                 *          ],
                 *          title: "Ranking - My country vs worldwide",
                 *          type: "ranking-only"
                 *      }
                 *
                 * ___________________________________________________
                 *
                 *  4. 'score-only' (can be single or dual datapoints)
                 *
                 *      4.1 single datapoint
                 *
                 *      {
                 *          dataset: [
                 *              {
                 *                  label: "OSAT My Country",
                 *                  score: 8.5,
                 *                  scoreBase: 10,
                 *                  progression: null,
                 *                  tonalities: null,
                 *                  kpi: null
                 *              }
                 *          ],
                 *          title: null,
                 *          type: "score-only"
                 *      }
                 *
                 *      - - - - - - - - - - - - - - - - - - - - - - - -
                 *      4.2 dual datapoints
                 *
                 *      {
                 *          dataset: [
                 *              {
                 *                  label: "OSAT My Country",
                 *                  score: 8.5,
                 *                  scoreBase: 10,
                 *                  progression: null,
                 *                  tonalities: null,
                 *                  kpi: null
                 *              },
                 *              {
                 *                  label: "OSAT Worldwide",
                 *                  score: 7,
                 *                  scoreBase: 10,
                 *                  progression: null,
                 *                  tonalities: null,
                 *                  kpi: null
                 *              }
                 *          ],
                 *          title: null,
                 *          type: "score-only"
                 *      }
                 * ___________________________________________________
                 *
                 *  5. 'score-ctl' (must be a single datapoint)
                 *
                 *      {
                 *          dataset: [
                 *              {
                 *                  label: "gain vs initial OSAT Score",
                 *                  score: 8,
                 *                  scoreBase: 10,
                 *                  progression: 2,
                 *                  tonalities: null,
                 *                  kpi: null
                 *              }
                 *          ],
                 *          title: "New OSAT score post CLF",
                 *          type: "score-ctl"
                 *      }
                 *
                 * ___________________________________________________
                 *
                 *  6. 'score-tonality' (can be single or multiple datapoints, max 3)
                 *
                 *      {
                 *          dataset: [
                 *              {
                 *                  label: "VOC survey",
                 *                  score: null,
                 *                  scoreBase: null,
                 *                  progression: null,
                 *                  tonalities: {
                 *                      positive: 10,
                 *                      neutral: 3,
                 *                      negative: 5
                 *                  },
                 *                  kpi: null
                 *              },
                 *              {
                 *                  label: "Benchmark survey",
                 *                  score: null,
                 *                  scoreBase: null,
                 *                  progression: null,
                 *                  tonalities: {
                 *                      positive: 12,
                 *                      neutral: 2,
                 *                      negative: 4
                 *                  },
                 *                  kpi: null
                 *              }
                 *          ],
                 *          title: "Tone by touchpoint",
                 *          type: "score-tonality"
                 *      }
                 */
                return {
                    /**
                     * DATASET ARRAY MUST HAVE THIS SHAPE:
                     * [
                     *  {
                     *      kpi: { // for type 'kpi-only'; set to null for other types
                     *          hasTarget: Boolean,
                     *          isOnTarget: Boolean | null,
                     *          ratio: String | null (ex:'10%' or '10d'...),
                     *          showRatio: Boolean | null, (to show ratio between parenthesis after value)
                     *          target: String | null (ex: '25%' or '25d'...),
                     *          targetTranslation: String | null (ex: 'GOAL', 'OBJECTIF'...),
                     *          value: String (ex: '10' or '10%' or '10d'... )
                     *
                     *      },
                     *      label: String, // for types:
                     *                      nps-only (titles in duo mode)
                     *                      score-tonality (legend label);
                     *                      score-ctl (progression label);
                     *                      ranking-only (progression label);
                     *                      score-only (titles in duo mode);
                     *
                     *      score: Number, // for all types (score or ranking)
                     *      scoreBase: Number | null, // for all types (score or ranking)
                     *      progression: Number | null, // for types ranking-only & score-ctl
                     *      tonalities: { // for types score-tonality; set to null for other types
                     *          positive: Number | null,
                     *          neutral: Number  | null,
                     *          negative: Number | null,
                     *      }
                     *  }
                     * ]
                     */
                    dataset: [],
                    title: "Title",
                    /* POSSIBLE TYPES:
                     * kpi-only
                     * nps-only
                     * ranking-only
                     * score-only (single or duo with vertical separation)
                     * score-ctl (with comparison between first & last answerings)
                     * score-tonality (single or list, depending on data.dataset length)
                     */
                    type: ""
                };
            }
        },
        fontFamily: {
            type: String,
            default: "Product Sans"
        }
    },
    data() {
        return {
            clientX: undefined,
            clientY: undefined,
            colors: {
                nps: {
                    promoter: "#15B300",
                    passive: "#E4793C",
                    detractor: "#EE4F4F"
                },
                tonalities: {
                    positive: "#15B300",
                    neutral: "#C4C4C4",
                    negative: "#F17171"
                }
            },
            formatA: 1.414285714285714,
            height: 100,
            smileys: {
                positive:
                    "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                neutral:
                    "M9.172 15.170a0 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                negative:
                    "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            },
            thumbDown: [
                "M6.15813 8.48703L6.06613 9.43464C6.02973 9.81544 5.67412 10.0738 5.31492 9.98104C4.77451 9.84104 4.39491 9.33904 4.39491 8.76343L4.39491 7.54942C4.39491 7.27942 4.39491 7.14422 4.33651 7.04541C4.30331 6.98901 4.25771 6.94141 4.20331 6.90741C4.10731 6.84701 3.97651 6.84701 3.7153 6.84701L3.5569 6.84701C2.87569 6.84701 2.53529 6.84701 2.32569 6.69101C2.16849 6.57381 2.05769 6.40221 2.01369 6.20781C1.95529 5.9478 2.08609 5.6226 2.34809 4.97299L2.47849 4.64899C2.55413 4.46134 2.58508 4.25866 2.56889 4.05698C2.47609 2.90737 3.3877 1.93896 4.50211 2.00256L8.67175 2.24217C9.12736 2.26817 9.35496 2.28137 9.56056 2.46337C9.76657 2.64537 9.80537 2.83297 9.88257 3.20778C10.0469 4.00514 10.0394 4.82836 9.86057 5.6226C9.74737 6.12181 9.27056 6.39061 8.77816 6.32661C7.47254 6.15861 6.28893 7.13422 6.15813 8.48663L6.15813 8.48703Z",
                "M8.00015 6.19995L8.05495 6.01715C8.40971 4.83454 8.39057 3.57123 8.00015 2.39991"
            ],
            thumbUp: [
                "M5.84187 3.51297L5.93387 2.56536C5.97027 2.18456 6.32588 1.92616 6.68508 2.01896C7.22549 2.15896 7.60509 2.66096 7.60509 3.23657V4.45058C7.60509 4.72058 7.60509 4.85578 7.66349 4.95459C7.69669 5.01099 7.74229 5.05859 7.79669 5.09259C7.89269 5.15299 8.02349 5.15299 8.2847 5.15299H8.4431C9.12431 5.15299 9.46471 5.15299 9.67431 5.30899C9.83151 5.42619 9.94231 5.59779 9.98631 5.79219C10.0447 6.0522 9.91391 6.3774 9.65191 7.02701L9.52151 7.35101C9.44587 7.53866 9.41492 7.74134 9.43111 7.94302C9.52391 9.09263 8.6123 10.061 7.49789 9.99744L3.32825 9.75783C2.87264 9.73183 2.64504 9.71863 2.43944 9.53663C2.23344 9.35463 2.19463 9.16703 2.11743 8.79222C1.95313 7.99486 1.96063 7.17164 2.13943 6.3774C2.25264 5.87819 2.72944 5.60939 3.22185 5.67339C4.52746 5.84139 5.71107 4.86578 5.84187 3.51337V3.51297Z",
                "M3.99985 5.80005L3.94505 5.98285C3.59029 7.16546 3.60943 8.42877 3.99985 9.60009"
            ],
            tooltipActive: false,
            tooltipContent: ""
        };
    },
    computed: {
        centerX() {
            return (this.height * this.formatA) / 2;
        },
        isSingle() {
            return this.data.dataset.length === 1;
        }
    },
    methods: {
        createTonalityBarChart(tonalities) {
            const values = Object.values(tonalities);
            const names = Object.keys(tonalities);
            const total = values.reduce((a, b) => a + b, 0);
            let bars = [];
            let acc = 0;
            for (let i = 0; i < values.length; i += 1) {
                const t = values[i];
                const x1 = acc;
                const x2 = (t / total) * (this.height * this.formatA - 22);
                acc += x2;
                bars.push({
                    ...t,
                    x1,
                    x2,
                    ratio: x2,
                    total,
                    acc,
                    name: names[i],
                    value: values[i]
                });
            }
            return bars;
        },
        createTooltip({ tonalities }) {
            const values = Object.values(tonalities);
            const keys = Object.keys(tonalities);
            const total = values.reduce((a, b) => a + b, 0);
            const legendArray = values.map((v, i) => {
                return {
                    value: v,
                    name: keys[i],
                    ratio: v / total,
                    icon: `<svg height="29" viewBox="0 0 29 29">
                                <path 
                                    d="${this.smileys[keys[i]]}" 
                                    fill="none"
                                    stroke-linecap="round" 
                                    stroke-width="2" 
                                    stroke="${this.colors.tonalities[keys[i]]}" 
                                />
                            </svg>`
                };
            });
            let html = "";
            legendArray.forEach((legend, i) => {
                html += `
                <div style="width: 100%; display: flex;">
                    ${legend.icon}
                    <span>
                        <b>${(legend.ratio * 100).toFixed(0)}%</b> 
                        <span>( ${legend.value} )</span>
                    </span>
                </div>
            `;
            });
            this.tooltipContent = html;
        },
        formatTonalities(tonalities) {
            const values = Object.values(tonalities);
            const names = Object.keys(tonalities);
            const total = values.reduce((a, b) => a + b, 0);
            return values.map((v, i) => {
                return {
                    value: v,
                    name: names[i],
                    ratio: v / total
                };
            });
        },
        getNpsColor(score) {
            switch (true) {
                case score > 0:
                    return this.colors.nps.promoter;
                case score === 0:
                    return this.colors.tonalities.neutral;
                case score < 0:
                    return this.colors.nps.detractor;
                default:
                    this.colors.tonalities.neutral;
            }
        },
        getProgressName(progression) {
            switch (true) {
                case progression > 0:
                    return "positive";
                case progression === 0:
                    return "neutral";
                case progression < 0:
                    return "negative";
                default:
                    return "neutral";
            }
        },
        getScoreColor(score) {
            switch (true) {
                case score <= 6:
                    return this.colors.nps.detractor;
                case score > 6 && score < 8:
                    return this.colors.nps.passive;
                case score >= 8:
                    return this.colors.nps.promoter;
                default:
                    return this.colors.nps.passive;
            }
        },
        getTonalityName(score) {
            switch (true) {
                case score <= 6:
                    return "negative";
                case score > 6 && score < 8:
                    return "neutral";
                case score >= 8:
                    return "positive";
                default:
                    return "neutral";
            }
        },
        isChartOfType(type) {
            return this.data.type.includes(type);
        },
        setClientPosition({ clientX, clientY }) {
            this.clientX = clientX - 125;
            this.clientY = clientY + 12;
        }
    }
};
</script>

<style lang="scss" scoped>
svg {
    background: white;
    overflow: visible;
    position: relative;
}
.legend {
    &__item {
        align-items: center;
        color: #2d353c;
        display: flex;
        flex-direction: row;
        font-size: 0.5em;
        justify-content: center;
    }
    &__wrapper {
        align-items: center;
        display: flex;
        flex-direction: row;
        gap: 12px;
        justify-content: center;
        width: 100%;
    }
}
.center-text {
    text-align:center;
}
.cockpit-mini-chart {
    height: fit-content;
    max-width: 400px;
    position: relative;
    width: 100%;
}
.kpi-comment,
.ranking-progression-comment {
    font-size: 0.45em;
    margin-top: 12px;
}
.ranking-progression-comment {
    text-align: center;
}
.kpi-ratio {
    font-size: 0.45em;
}
.score {
    font-size: 1.2em;
}
.score-base {
    font-size: 0.618em;
    margin-left: -0.4em;
}
.title {
    color: #2d353c;
    font-size: 8px !important;
    font-weight: 400;
    line-height: 10px;
    width: 100%;
    text-align: center;
}
.tooltip {
    background: white;
    border-radius: 12px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.11);
    padding: 16px 12px 12px 24px;
    position: fixed;
    width: 250px;
}
.score-ctl-progression {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    b {
        font-size: 0.6em;
    }
    span {
        font-size: 0.4em;
    }
}
</style>