<template>
    <div
        class="donut-wordcloud"
        :style="`font-family: ${fontFamily}; width: 100%; max-width: 1000px`"
    >
        <!-- TITLE -->
        <div
            class="donut-wordcloud__title-wrapper"
            :style="
                `align-items:${title.position}; justify-content:${title.position}`
            "
        >
            <div
                class="donut-wordcloud__title"
                v-if="showTitle"
                :style="
                    `color:${title.color}; font-size:${title.fontSize}; font-weight:${title.fontWeight}`
                "
            >
                {{ title.label }}
            </div>
            <div
                class="donut-wordcloud__subtitle"
                v-if="showTitle && subtitle.label"
                :style="
                    `color:${subtitle.color}; font-size:${subtitle.fontSize}`
                "
            >
                {{ subtitle.label }}
            </div>
        </div>

        <!-- COMMON LEGEND -->
        <div
            class="donut-wordcloud__legend"
            v-if="showLegend && !individualLegend"
        >
            <div class="donut-wordcloud__legend__list">
                <div
                    class="donut-wordcloud__legend__item"
                    v-for="(legend, i) in legend.items"
                    :key="`legend_item_${i}`"
                    @click="selectLegend(i)"
                    :style="
                        `${
                            selectedLegend !== undefined
                                ? selectedLegend === i
                                    ? 'opacity:1'
                                    : 'opacity: 0.15'
                                : 'opacity:1'
                        }`
                    "
                >
                    <div
                        class="donut-wordcloud__legend__icon-wrapper"
                        v-html="legend.icon"
                    />
                    <div>
                        {{ legend.label }}
                        <strong v-if="selectedDonutIndex !== undefined">
                            :
                            <span
                                :style="
                                    `color: ${circles[selectedDonutIndex].series[i].color}`
                                "
                            >
                                {{
                                    circles[selectedDonutIndex].series[i].value
                                        .toFixed(0)
                                        .toLocaleString()
                                }}
                            </span>
                        </strong>
                    </div>
                </div>
            </div>
        </div>

        <!-- INDIVIDUAL LEGEND -->
        <div
            class="donut-wordcloud__legend"
            v-if="showLegend && individualLegend"
        >
            <div
                v-if="selectedDonutIndex === undefined"
                class="donut-wordcloud__legend__list"
            >
                <div
                    v-for="(legend, i) in sortedDataset[0].series"
                    :key="`legend_placeholder_${i}`"
                    style="color: transparent"
                >
                    &nbsp;
                </div>
            </div>
            <div class="donut-wordcloud__legend__list" v-else>
                <div
                    class="donut-wordcloud__legend__item"
                    v-for="(legend, i) in sortedDataset[selectedDonutIndex]
                        .series"
                    :key="`legend_item_${i}`"
                    :style="
                        `${
                            selectedLegend !== undefined
                                ? selectedLegend === i
                                    ? 'opacity:1'
                                    : 'opacity: 0.15'
                                : 'opacity:1'
                        }`
                    "
                >
                    <div>
                        {{ legend.name }}
                        <strong>
                            :
                            <span :style="`color: ${legend.color}`">
                                {{ legend.value.toFixed(0).toLocaleString() }}
                            </span>
                        </strong>
                    </div>
                </div>
            </div>
        </div>

        <!-- CHART -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            width="100%"
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        >
            <g
                v-for="(donut, i) in donuts"
                :key="`donut_${i}`"
                @click="selectDonut(i)"
                :style="
                    `${
                        typeof selectedDonutIndex === 'number' &&
                        selectedDonutIndex === i
                            ? 'opacity: 1'
                            : 'opacity: 0.3'
                    }; ${selectedDonutIndex === undefined ? 'opacity: 1' : ''}`
                "
            >
                <!-- DONUT SEGMENTS -->
                <template v-if="!justWords">
                    <path
                        v-for="(arc, j) in selectedDonutIndex === i
                            ? makeDonut(
                                  circles[i],
                                  circles[i].x,
                                  circles[i].y,
                                  zooming,
                                  zooming
                              )
                            : donut"
                        :key="`arc_${i}_${j}`"
                        :d="arc.path"
                        :stroke="arc.color"
                        :stroke-width="
                            selectedDonutIndex === i
                                ? donutWidth * 4
                                : donutWidth
                        "
                        :style="
                            `${selectedDonutIndex === i ? 'opacity: 0' : ''}; ${
                                selectedLegend !== undefined
                                    ? selectedLegend === j
                                        ? `opacity:1; stroke-width:${donutWidth *
                                              1.618}`
                                        : 'opacity: 0.15'
                                    : 'opacity:1'
                            }`
                        "
                    />
                </template>

                <!-- MARKER FOR SELECTED LEGEND -->
                <template
                    v-if="
                        selectedDonutIndex === undefined &&
                            selectedLegend !== undefined
                    "
                >
                    <foreignObject
                        id="markers"
                        v-for="(arc, k) in makeDonut(
                            circles[i],
                            circles[i].x,
                            circles[i].y,
                            circles[i].r,
                            circles[i].r
                        )"
                        :key="`arc_${k}`"
                        :x="circles[i].x + donutWidth"
                        :y="circles[i].y - circles[i].r / 2"
                        style="overflow: visible"
                    >
                        <div
                            v-if="selectedLegend === k"
                            :style="
                                `
                                align-items:center; 
                                background:white; 
                                border-radius: 12px; 
                                color: black;
                                border: 3px solid ${arc.color}; 
                                display: block; 
                                display: flex; 
                                font-size:2em; 
                                font-weight: bold; 
                                height: 70px !important; 
                                justify-content:center; 
                                margin-left:-50px; 
                                margin-top:-50px; 
                                padding: 12px; 
                                width: fit-content;
                                padding: 0 6px;
                                z-index:100;
                                `
                            "
                        >
                            {{ (arc.proportion * 100).toFixed(0) }}%
                        </div>
                    </foreignObject>
                </template>

                <!-- VERBATIM UNSELECTED STATE -->
                <foreignObject
                    v-if="i !== selectedDonutIndex"
                    :x="circles[i].x - circles[i].r"
                    :y="circles[i].y - circles[i].r"
                    :height="circles[i].r * 2"
                    :width="circles[i].r * 2"
                    :style="'overflow: visible;'"
                >
                    <div
                        :style="
                            `
                            align-items: center;
                            color: black;
                            display: flex;
                            font-size:${calcFontSize(
                                circles[i].r,
                                sortedDataset[i].verbatim
                            )}px;
                            font-height:${calcFontSize(
                                circles[i].r,
                                sortedDataset[i].verbatim
                            )}px;
                            font-weight: bold;
                            height: 100%;
                            justify-content: center;
                            overflow: hidden;
                            padding: 0 6px;
                            text-align: center;
                            text-overflow: ellipsis;
                            white-space:nowrap;
                            width:${circles[i].r * 2};
                            `
                        "
                    >
                        {{ sortedDataset[i].verbatim }}
                    </div>
                </foreignObject>
            </g>

            <g v-if="selectedDonutIndex !== undefined" @click="unselectDonut">
                <!-- OPAQUE HOLLOW -->
                <circle
                    :cx="circles[selectedDonutIndex].x"
                    :cy="circles[selectedDonutIndex].y"
                    :r="zooming - donutWidth * 2"
                    fill="white"
                />
                <!-- DONUT SEGMENTS SELECTED STATE -->
                <template>
                    <path
                        v-for="(arc, j) in makeDonut(
                            circles[selectedDonutIndex],
                            circles[selectedDonutIndex].x,
                            circles[selectedDonutIndex].y,
                            zooming,
                            zooming
                        )"
                        :key="`arc_${selectedDonutIndex}_${j}`"
                        :d="arc.path"
                        :stroke="arc.color"
                        :stroke-width="donutWidth * 4"
                    />
                </template>

                <!-- VERBATIM SELECTED STATE -->
                <foreignObject
                    :x="
                        circles[selectedDonutIndex].x - zooming - donutWidth * 2
                    "
                    :y="
                        circles[selectedDonutIndex].y - zooming - donutWidth * 2
                    "
                    :height="zooming * 2 + 71"
                    :width="zooming * 2 + 71"
                    :style="'overflow: visible;'"
                    id="selected"
                >
                    <div
                        :class="{ 'donut-gradient': gradient, 'donut-overlay' : overlay }"
                        :style="
                            `
                            align-items: center;
                            border-radius: 50%; font-weight: bold;
                            color: black;
                            display: flex;
                            font-size:66px;
                            height: 100%;
                            justify-content: center;
                            overflow: visible;
                            text-align: center;
                            width:100%;
                            `
                        "
                    >
                        <span class="zoomed-verbatim">{{
                            sortedDataset[selectedDonutIndex].verbatim
                        }}</span>
                    </div>
                </foreignObject>

                <!-- MARKERS -->
                <template>
                    <foreignObject
                        id="markers"
                        v-for="(arc, k) in makeDonut(
                            circles[selectedDonutIndex],
                            circles[selectedDonutIndex].x,
                            circles[selectedDonutIndex].y,
                            zooming,
                            zooming
                        )"
                        :key="`arc_${k}`"
                        :x="arc.center.endX"
                        :y="arc.center.endY"
                        :height="zooming"
                        :width="zooming"
                        style="overflow: visible"
                    >
                        <div
                            :style="
                                `
                                align-items:center; 
                                background:white; 
                                border-radius: 50%; 
                                box-shadow: 0 3px 6px rgba(0,0,0,0.31);
                                color: black; 
                                display: block; 
                                display: flex; 
                                font-size:3em; 
                                font-weight: bold; 
                                height: 100px !important; 
                                justify-content:center; 
                                margin-left:-50px; 
                                margin-top:-50px; 
                                padding: 12px; 
                                width: 100px !important; 
                                z-index:100;
                                `
                            "
                        >
                            {{ (arc.proportion * 100).toFixed(0) }}%
                        </div>
                    </foreignObject>
                </template>
            </g>
        </svg>
    </div>
</template>

<script>
export default {
    name: "DonutWordCloud",
    props: {
        dataset: {
            type: Array,
            default() {
                // The series of each datapoint can be of any size
                // Colors can be specific to each datapoint
                return [
                    {
                        id: "id1",
                        verbatim: "Lorem",
                        series: [
                            {
                                name: "insat",
                                value: 3,
                                color: "#F17171"
                            },
                            {
                                name: "neutral",
                                value: 3,
                                color: "#C4C4C4"
                            },
                            {
                                name: "sat",
                                value: 3,
                                color: "#15B300"
                            }
                        ]
                    },
                    {
                        id: "id2",
                        verbatim: "Ipsum",
                        series: [
                            {
                                name: "insat",
                                value: 10,
                                color: "#F17171"
                            },
                            {
                                name: "neutral",
                                value: 3,
                                color: "#C4C4C4"
                            },
                            {
                                name: "sat",
                                value: 4,
                                color: "#15B300"
                            }
                        ]
                    },
                    {
                        id: "id3",
                        verbatim: "Consectetur",
                        series: [
                            {
                                name: "insat",
                                value: 1,
                                color: "#F17171"
                            },
                            {
                                name: "neutral",
                                value: 2,
                                color: "#C4C4C4"
                            },
                            {
                                name: "sat",
                                value: 4,
                                color: "#15B300"
                            }
                        ]
                    }
                ];
            }
        },
        donutWidth: {
            type: Number,
            default: 16
        },
        fontFamily: {
            type: String,
            default: "Product Sans"
        },
        gradient: {
            type: Boolean,
            default: false
        },
        height: {
            type: Number,
            default: 0
        },
        individualLegend: {
            type: Boolean,
            default: false
        },
        justWords: {
            type: Boolean,
            default: false
        },
        legend: {
            type: Object,
            default() {
                return {
                    items: [
                        // Inline svg icon to be displayed v-html
                        {
                            icon:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15B300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
                            label: "Satisfait"
                        },
                        {
                            icon:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
                            label: "Neutre"
                        },
                        {
                            icon:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F17171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
                            label: "Insatisfait"
                        }
                    ]
                };
            }
        },
        overlay: {
            type: Boolean,
            default: false,
        },
        showLegend: {
            type: Boolean,
            default: false
        },
        showTitle: {
            type: Boolean,
            default: false
        },
        subtitle: {
            type: Object,
            default() {
                return {
                    color: "#dddddd",
                    fontSize: "14px",
                    label: ""
                };
            }
        },
        title: {
            type: Object,
            default() {
                return {
                    color: "black",
                    fontSize: "24px",
                    fontWeight: "bold",
                    label: "Title",
                    position: "center" // start | center | end,
                };
            }
        },
        width: {
            type: Number,
            default: 0
        },
        wordSizeRatio: {
            type: Number,
            default: 66 // set at 66 to be conservative; set at 300 for a wow effect
        },
        zooming: {
            type: Number,
            default: 200
        }
    },
    data() {
        return {
            beforeLastCircle: {},
            circles: [],
            cos: Math.cos,
            donuts: [],
            drawIteration: 0,
            firstCircle: {},
            index: 0,
            maxRadius: this.zooming,
            minRadius: this.zooming / 3,
            originalCircle: {},
            lastCircle: {},
            rowIndex: 0,
            selectedDonutIndex: undefined,
            selectedLegend: undefined,
            sin: Math.sin,
            starts: true,
            svgHeight: this.height,
            svgWidth: this.width
        };
    },
    computed: {
        allDonutsAreDrawn() {
            return this.drawIteration === this.dataset.length;
        },
        datasetSums() {
            return this.dataset.map(dset => {
                return dset.series
                    .map(serie => serie.value)
                    .reduce((a, b) => a + b, 0);
            });
        },
        hasReferenceRow() {
            return this.rows[this.rowIndex - 2];
        },
        indexIsEven() {
            return this.index % 2 === 0;
        },
        isBottomRow() {
            return this.rowIndex % 2 === 0 && this.rowIndex > 0;
        },
        isFirstCircleOfRow() {
            return this.index === 0;
        },
        isFirstRow() {
            return this.index <= this.maxItemsPerRow && this.rowIndex === 0;
        },
        isTopRow() {
            return this.rowIndex % 2 === 1;
        },
        max() {
            return Math.max(...this.datasetSums);
        },
        maxItemsPerRow() {
            return Math.floor(Math.sqrt(this.dataset.length));
        },
        rowHasEnded() {
            return this.index === this.maxItemsPerRow;
        },
        rows() {
            return [...this.sortedDataset].map(() => {
                return [];
            });
        },
        rowsHaveEvenItems() {
            return this.rows[0].length % 2 === 0;
        },
        sortedDataset() {
            return this.dataset
                .map(dset => {
                    return {
                        ...dset,
                        total: dset.series
                            .map(serie => serie.value)
                            .reduce((a, b) => a + b, 0)
                    };
                })
                .sort((a, b) => b.total - a.total);
        }
    },
    mounted() {
        this.sortedDataset.forEach((dset, i) => {
            const sum = dset.series
                .map(serie => serie.value)
                .reduce((a, b) => a + b, 0);
            const r = (sum / this.max) * this.maxRadius;
            this.generateCloud(r, dset);
        });
        this.sortedDataset
            .map(dset => {
                return {
                    ...dset,
                    total: dset.series
                        .map(serie => serie.value)
                        .reduce((a, b) => a + b, 0)
                };
            })
            .forEach((dset, i) => {
                if (dset && this.circles.length && this.circles[i]) {
                    this.donuts.push(
                        this.makeDonut(
                            dset,
                            this.circles[i].x,
                            this.circles[i].y,
                            this.circles[i].r,
                            this.circles[i].r
                        )
                    );
                }
            });
    },
    methods: {
        addCircleAndIterate(circle) {
            this.circles.push(circle);
            this.rows[this.rowIndex].push(circle);
            this.drawIteration += 1;
        },
        addFinalPadding() {
            this.svgHeight += this.circles[0].r;
            this.circles.forEach(c => {
                c.y += this.circles[0].r / 2;
            });
        },
        addVector([a1, a2], [b1, b2]) {
            return [a1 + b1, a2 + b2];
        },
        calcFontSize(radius, verbatim) {
            const size = (radius / verbatim.split("").length) * 3;
            return size < this.wordSizeRatio ? size : this.wordSizeRatio;
        },
        createArc([cx, cy], [rx, ry], [position, ratio], phi) {
            ratio = ratio % (2 * Math.PI);
            const rotMatrix = this.rotateMatrix(phi);
            const [sX, sY] = this.addVector(
                this.matrixTimes(rotMatrix, [
                    rx * this.cos(position),
                    ry * this.sin(position)
                ]),
                [cx, cy]
            );
            const [eX, eY] = this.addVector(
                this.matrixTimes(rotMatrix, [
                    rx * this.cos(position + ratio),
                    ry * this.sin(position + ratio)
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
                    eY
                ].join(" ")}`
            };
        },
        generateCloud(r, item) {
            const circle = {
                x: 0,
                y: 0,
                r: r < this.minRadius ? this.minRadius : r,
                ...item
            };
            this.starts && this.placeAtCenterAndResizeViewBox(circle);
            this.isFirstRow && this.placeOnFirstRow(circle);
            this.isTopRow && this.placeOnTopRow(circle);
            this.isBottomRow && this.placeOnBottomRow(circle);
            this.addCircleAndIterate(circle);
            this.rowHasEnded ? this.resetRow() : this.updateReferences(circle);
            if (this.allDonutsAreDrawn) {
                this.rowsHaveEvenItems && this.offsetEvenRows();
                this.addFinalPadding();
            }
        },
        makeDonut(item, cx, cy, rx, ry) {
            const { series } = item;
            const sum = [...series]
                .map(serie => serie.value)
                .reduce((a, b) => a + b, 0);
            const ratios = [];
            let acc = 0;
            for (let i = 0; i < series.length; i += 1) {
                const proportion = series[i].value / sum;
                const ratio = proportion * (Math.PI * 2);
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
                    ratio,
                    path,
                    startX,
                    startY,
                    endX,
                    endY,
                    center: this.createArc(
                        [cx, cy],
                        [rx * 1.3, ry * 1.3],
                        [acc, midRatio],
                        110
                    ) // center of the arc, to display the marker. rx & ry are larger to be displayed with a slight offset
                });
                acc += ratio;
            }
            return ratios;
        },
        matrixTimes([[a, b], [c, d]], [x, y]) {
            return [a * x + b * y, c * x + d * y];
        },
        offsetEvenRows() {
            this.circles.forEach(c => {
                c.x -= this.rows[0][0].r;
            });
        },
        placeOnFirstRow(circle) {
            if (
                this.isFirstCircleOfRow &&
                !this.lastCircle.hasOwnProperty("x")
            ) {
                circle.x = this.svgWidth / 2;
                circle.y = this.svgHeight / 2;
            } else {
                circle.y = this.originalCircle.y;
                if (this.indexIsEven) {
                    circle.x = this.placeDonutOnTheLeft(circle);
                } else {
                    if (this.beforeLastCircle.hasOwnProperty("x")) {
                        circle.x = this.placeDonutOnTheRightFromBeforeLast(
                            circle
                        );
                    } else {
                        circle.x = this.placeDonutOnTheRightFromLast(circle);
                    }
                }
            }
        },
        placeOnTopRow(circle) {
            if (this.isFirstCircleOfRow) {
                circle.x = this.originalCircle.x;
                if (this.hasReferenceRow) {
                    const refRow = this.hasReferenceRow[0];
                    circle.y = this.placeDonutOnTopOfReferenceRow(
                        circle,
                        refRow
                    );
                } else {
                    circle.y = this.placeDonutOnTopOfOriginalCircle(circle);
                }
                this.lastCircle = circle;
            } else {
                circle.y = this.lastCircle.y;
                if (this.indexIsEven) {
                    circle.x = this.placeDonutOnTheLeft(circle);
                } else {
                    if (this.beforeLastCircle.hasOwnProperty("x")) {
                        circle.x = this.placeDonutOnTheRightFromBeforeLast(
                            circle
                        );
                    } else {
                        circle.x = this.placeDonutOnTheRightFromLast(circle);
                    }
                }
            }
        },
        placeOnBottomRow(circle) {
            if (this.isFirstCircleOfRow) {
                circle.x = this.originalCircle.x;
                if (this.hasReferenceRow) {
                    const refRow = this.hasReferenceRow[0];
                    circle.y = this.placeDonutBelowReferenceRow(circle, refRow);
                } else {
                    circle.y = this.placeDonutBelowOriginalCircle(circle);
                }
                this.lastCircle = circle;
            } else {
                circle.y = this.lastCircle.y;
                if (this.indexIsEven) {
                    circle.x = this.placeDonutOnTheLeft(circle);
                } else {
                    if (this.beforeLastCircle.hasOwnProperty("x")) {
                        circle.x = this.placeDonutOnTheRightFromBeforeLast(
                            circle
                        );
                    } else {
                        circle.x = this.placeDonutOnTheRightFromLast(circle);
                    }
                }
            }
        },
        placeAtCenterAndResizeViewBox(circle) {
            this.svgWidth =
                (circle.r * 2 + this.donutWidth * 2) *
                (this.maxItemsPerRow + 2);
            this.svgHeight = this.svgWidth * 0.7;
            this.originalCircle = circle;
            this.starts = false;
        },
        placeDonutOnTheLeft(circle) {
            return (
                this.beforeLastCircle.x -
                this.beforeLastCircle.r -
                circle.r -
                this.donutWidth * 2
            );
        },
        placeDonutOnTheRightFromBeforeLast(circle) {
            return (
                this.beforeLastCircle.x +
                this.beforeLastCircle.r +
                this.donutWidth * 2 +
                circle.r
            );
        },
        placeDonutOnTheRightFromLast(circle) {
            return (
                this.lastCircle.x +
                this.lastCircle.r +
                this.donutWidth * 2 +
                circle.r
            );
        },
        placeDonutOnTopOfReferenceRow(circle, refRow) {
            return refRow.y - refRow.r - circle.r - this.donutWidth * 2;
        },
        placeDonutOnTopOfOriginalCircle(circle) {
            return (
                this.originalCircle.y -
                this.originalCircle.r -
                circle.r -
                this.donutWidth * 2
            );
        },
        placeDonutBelowReferenceRow(circle, refRow) {
            return refRow.y + refRow.r + circle.r + this.donutWidth * 2;
        },
        placeDonutBelowOriginalCircle(circle) {
            return (
                this.originalCircle.y -
                this.originalCircle.r -
                circle.r -
                this.donutWidth * 2
            );
        },
        resetRow() {
            this.rowIndex += 1;
            this.index = 0;
            this.lastCircle = {};
            this.beforeLastCircle = {};
        },
        rotateMatrix(x) {
            return [
                [this.cos(x), -this.sin(x)],
                [this.sin(x), this.cos(x)]
            ];
        },
        selectDonut(index) {
            if (index === this.selectedDonutIndex) {
                this.$nextTick(this.unselectDonut);
            }
            this.$nextTick(() => {
                this.selectedDonutIndex = index;
            });
            // expose selected data to parent
            this.$emit("selectVerbatim", {
                selected: this.sortedDataset[index]
            });
        },
        selectLegend(i) {
            if (i !== undefined && i !== this.selectedLegend) {
                this.selectedLegend = i;
            } else {
                this.selectedLegend = undefined;
            }
        },
        unselectDonut() {
            this.$nextTick(() => {
                this.selectedDonutIndex = undefined;
            });
        },
        updateReferences(circle) {
            this.beforeLastCircle = this.lastCircle;
            this.lastCircle = circle;
            this.index += 1;
        }
    }
};
</script>

<style lang="scss" scoped>
* {
    transition: all 0.3s ease-in-out;
}
.donut-wordcloud {
    position: relative;
    user-select: none;
    background: white;
    &__legend {
        color: black;
        align-items: start;
        background: white;
        display: flex;
        flex-direction: row;
        gap: 12px;
        padding: 12px 24px 0 24px;
        margin-bottom: -12px;
        width: inherit;
        height: fit-content;
        &__list {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: start;
            row-gap: 6px;
        }
        &__icon-wrapper,
        &__item {
            align-items: center;
            display: flex;
            justify-content: center;
        }
        &__icon-wrapper {
            margin-right: 3px;
        }
        &__item {
            cursor: pointer;
        }
    }
    &__title-wrapper {
        background: white;
        display: flex;
        flex-direction: column;
        padding: 12px 0 0 0;
        width: inherit;
    }
    &__tooltip {
        background: white;
        height: 100px;
        height: fit-content;
        width: 100px;
        &__foreignObject {
            overflow: visible;
        }
    }
    svg {
        background: transparent;
        overflow: visible;
    }
    path {
        fill: none;
    }
    g {
        cursor: pointer;
    }
    .zoomed-verbatim {
        text-shadow: 0 5px 20px white;
    }
    .donut-gradient {
        background: radial-gradient(
            rgba(255, 255, 255, 0.4),
            transparent,
            transparent,
            transparent,
            transparent,
            transparent,
            transparent,
            rgba(255, 255, 255, 0.6),
            rgba(0,0,0,0.1),
            transparent,
            transparent,
            transparent,
            transparent,
            transparent
        );
    }
    .donut-overlay {
        box-shadow: 0 300px 300px rgba(0,0,0,0.3);
    }
}
</style>