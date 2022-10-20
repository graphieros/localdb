<template>
  <div>
    <h1 class="green--text text--lighten-4">Settings</h1>

    <v-container
      :class="{
        'transparent-bg settings-list px-10': isDarkMode,
        'white settings-list px-10': !isDarkMode,
      }"
    >
      <div class="setting">
        <v-switch
          :dark="isDarkMode"
          color="green"
          v-model="isLog"
          :label="
            isLogActive
              ? 'Log is active : all changes made to the record list are logged.'
              : 'Log is inactive : there will be no trace of changes made to the record list'
          "
          @click.prevent="toggleSetting('isLogActive', isLog)"
        ></v-switch>
      </div>
      <div class="setting">
        <v-switch
          :dark="isDarkMode"
          color="green"
          v-model="isDark"
          :label="
            isDarkMode
              ? 'Dark mode is on. We care for your eyes.'
              : 'Dark mode is off. At your own risks.'
          "
          @click.prevent="toggleSetting('isDarkMode', isDark)"
        ></v-switch>
      </div>
    </v-container>
    <div
      style="
        display: flex;
        width: 50%;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      "
    >
      <!-- <Thermometer
        :range="[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]"
        :score="50"
        :min="-100"
        :max="100"
        animated
        tooltipHtml="Score: 3"
        :showRefreshButton="true"
        :dark="isDarkMode"
      /> -->
      <!-- <SimpleThermometer
        :dataset="archived"
        :color="'green'"
        :gradient="false"
      /> -->
      <!-- <Quadrant
        axisArrows
        :showAverages="true"
        :showNames="true"
        :positive="false"
        fontFamily="Jost"
        xTitle="Some random long name"
        yTitle="Prix"
        :showLegend="true"
      /> -->
    </div>
      <v-btn absolute left @click="animate = !animate" class="my-5">Animate</v-btn>
    <div
      style="
        display: flex;
        width: 70%;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        margin-bottom: 300px;
      "
    >
      <Quadrant :datasets="quadrant.option2" xTitle="correlation" yTitle="moyenne"/>
      <!-- <Treemap
        :showJustNames="true"
        :wordcloud="false"
        :sorted="true"
        :showLabels="true"
        :width="700"
      /> -->
    
      <!-- <DonutWordCloud :individualLegend="true" :justWords="false" :wordSizeRatio="100" fontFamily="Jost" :subtitle="{label:'This is a subtitle', color:'#aaa'}" :showTitle="false" showLegend :dataset="randomCloud" :key="`dropstep_${dropstep}`"/> -->

      <!-- <WordCloud :dark="isDarkMode" :monochrome="true" :dataset="randomCloud" :key="`m_${dropstep}`" :randomColors="true" fontFamily="Impact" :bold="false" tooltipFont="Jost"/> -->
      <!-- <SpiralDonutWordCloud :dataset="randomCloud" gradient overlay/> -->
      <!-- <WaffleFace/> -->
      <!-- <RelationCircle fontFamily="Jost"/> -->
      
      <!-- <SimpleLine showVerticalLines /> -->
      <!-- <ScatterDonut gradient overlay/> -->
      <!-- <DonutEvolution gradient overlay fontFamily="Jost" title="Some title to test" :rounding="0"/> -->

      <!-- <div style="width: 800px; border:1px solid blue; padding: 12px;"> -->
        <!-- <Tree/> -->
        <!-- <MiniScoreChart fontFamily="Jost" :data="miniData"/> -->
              <!-- <TabMenu fontFamily="Jost" :data="tabz" @selectTab="selectTab"/>
               -->
        <!-- <RootBar :showTonality="true" fontFamily="Jost"/> -->
      <!-- </div> -->
      <div>
          <!-- <div class="temp-wrapper" style="width: 300px; padding: 12px;">
            <Linut 
              sparkLine
              :sizeRatio="0.725"
              fontFamily="Jost"
              :dataset="makeTwo(6)" 
              :lineThickness="8"
              />
          </div>
          <div class="temp-wrapper" style="width: 300px; padding: 12px;">
            <Linut 
              sparkLine
              :sizeRatio="0.725"
              fontFamily="Jost"
              :dataset="makeTwo(6)" 
              :showLineFirst="true"
              :lineThickness="8"
              />
          </div> -->
      </div>
      
      <!-- <div class="temp-wrapper" style="width: 800px; padding: 12px;">
        <Linut 
          :dataset="makeLinut(13)"
           title="Vue2 Linut chart" 
           fontFamily="Jost" 
           :xLabels="['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN']"
          />
      </div> -->

    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store";
import VintageIcon from "../components/VintageIcon.vue";
import FlexGauge from "../components/FlexGauge.vue";
import DraGrid from "../components/DraGrid.vue";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import CarouselBar from "../components/CarouselBar.vue";
import Thermometer from "../components/Thermometer.vue";
import SimpleThermometer from "../components/SimpleThermometer.vue";
import Quadrant from "../components/Quadrant.vue";
import Treemap from "../components/Treemap.vue";
import DonutWordCloud from "../components/DonutWordCloud.vue";
import WordCloud from "../components/WordCloud.vue";
import SpiralDonutWordCloud from "../components/SpiralDonutWordCloud.vue";
import WaffleFace from "../components/WaffleFace.vue";
import RelationCircle from "../components/RelationCircle.vue";
import RootBar from "../components/RootBar.vue";
import SimpleLine from "../components/SimpleLine.vue";
import ScatterDonut from "../components/ScatterDonut.vue";
import DonutEvolution from "../components/DonutEvolution.vue";
import Donut from "../components/Donut.vue";
import Spread from "../components/Spread.vue";
import Game from "../components/Game.vue";
import Tree from "../components/Tree.vue";
import MiniScoreChart from "../components//MiniScoreChart.vue";
import TabMenu from "../components/TabMenu.vue";
import Linut from "../components/Linut.vue";

export default Vue.extend({
  name: "Settings",
  components: {
    CarouselBar,
    DraGrid,
    DonutWordCloud,
    FlexGauge,
    WordCloud,
    SimpleThermometer,
    SkeletonLoader,
    Thermometer,
    VintageIcon,
    Quadrant,
    RelationCircle,
    Treemap,
    ScatterDonut,
    SimpleLine,
    SpiralDonutWordCloud,
    WaffleFace,
    RootBar,
    DonutEvolution,
    Donut,
    Spread,
    Game,
    Tree,
    MiniScoreChart,
    TabMenu,
    Linut
  },
  data() {
    return {
      isLog: true,
      isDark: true,
      icons: {},
      isLoading: false,
      colors: ["#ff3300", "#ffae00", "#ffff00", "greenyellow", "green"],
      dropstep:0,
      randomCloud: [],
      animate: false,
      quadrantSet: [
        {
          family: "VISITE",
          name:"VISITE-1",
          description: "Je me suis senti accueilli",
          average: 4.33333333333333,
          correlation: 0.638006711470186,
        },
        {
          family: "VISITE",
          name:"VISITE-2",
          description: "Magasin agréable à visiter",
          average: 4.61904761904762,
          correlation: 0.59910887093201,
        },
        {
          family: "VISITE",
          name:"VISITE-3",
          description: "Facilité de repérage (magasin)",
          average: 4.66666666666667,
          correlation: 0.522319727146011,
        },
        {
          family: "VISITE",
          name:"VISITE-4",
          description: "Facilité de circulation (magasin)",
          average: 4.76190476190476,
          correlation: 0.528476133639401,
        },
        {
          family: "RAYON",
          name:"RAYON-1",
          description: "Rayon bien tenu",
          average: 4.7,
          correlation: 0.606342691813388,
        },
        {
          family: "RAYON",
          name:"RAYON-2",
          description: "Produits facilement repérables",
          average: 4.42857142857143,
          correlation: 0.5618453238,
        },
        {
          family: "RAYON",
          name:"RAYON-3",
          description: "Informations pour choisir le produit",
          average: 4.33333333333333,
          correlation: 0.635692007894754,
        },
        {
          family: "RAYON",
          name:"RAYON-4",
          description: "Il y a un large choix de produits",
          average: 4.2,
          correlation: 0.508056616369488,
        },
        {
          family: "RAYON",
          name:"RAYON-5",
          description: "On y trouve toujours ce que l’on cherche",
          average: 3.85,
          correlation: 0.566601633761285,
        },
        {
          family: "VENTE",
          name:"VENTE-1",
          description: "Vendeur disponible rapidement",
          average: 4.53333333333333,
          correlation: 0.63733916557511,
        },
        {
          family: "VENTE",
          name:"VENTE-2",
          description: "Vendeur accueillant et attentionné",
          average: 4.6,
          correlation: 0.673731976641752,
        },
        {
          family: "VENTE",
          name:"VENTE-3",
          description: "Réponses aux questions et conseils",
          average: 4.4,
          correlation: 0.7182936157,
        },
        {
          family: "VENTE",
          name:"VENTE-4",
          description: "M’a appris quelque chose de nouveau lors de notre échange",
          average: 4.53846153846154,
          correlation: 0.624307631913134,
        },
        {
          family: "CAISSE",
          name:"CAISSE-1",
          description: "L'hôte(sse)  de caisse accueillante et attentionnée",
          average: 4.5,
          correlation: 0.5073026523,
        },
        {
          family: "CAISSE",
          name:"CAISSE-2",
          description: "L'hôte(sse) de caisse a été efficace",
          average: 4.6,
          correlation: 0.5335641775,
        },
        {
          family: "CAISSE",
          name:"CAISSE-3",
          description: "Temps d'attente raisonnable (caisse)",
          average: 4.533333333,
          correlation: 0.4615633447,
        },
        {
          family: "COMPTOIR",
          name:"COMPTOIR",
          description: "Satisfaction retrait magasin",
          average: 4.666666667,
          correlation: 0.5637033267,
        },
        {
          family: "COMPTOIR",
          name:"COMPTOIR-1",
          description: "Comptoir facilement repérable (Retrait comptoir)",
          average: 5,
          correlation: 0.4538565644,
        },
        {
          family: "COMPTOIR",
          name:"COMPTOIR-2",
          description: "Personnel accueillant et attentionné (Retrait comptoir)",
          average: 4.666666667,
          correlation: 0.516627062,
        },
        {
          family: "COMPTOIR",
          name:"COMPTOIR-3",
          description: "Le personnel a été efficace (Retrait comptoir)",
          average: 5,
          correlation: 0.5276051644,
        },
        {
          family: "COMPTOIR",
          name:"COMPTOIR-4",
          description: "La démarche était facile (Retrait comptoir)",
          average: 5,
          correlation: 0.5301707707,
        },
        {
          family: "COMPTOIR",
          name: "COMPTOIR-5",
          description: "Temps d'attente raisonnable (Retrait comptoir)",
          average: 4.666666667,
          correlation: 0.461045399,
        },
      ]
    };
  },
  computed: {
    quadrant(){
      function median(arr) {
        arr = arr.slice(0).sort(function(x, y) {
          return x - y;
        });
        const half = (arr.length + 1) / 2;
        return (arr.length % 2) ? arr[half - 1] : (arr[half - 1.5] + arr[half - 0.5]) / 2;
      }
      const medianY = median(this.quadrantSet.map(serie => {
        return serie.average;
      }));
      const medianX = median(this.quadrantSet.map(serie => {
        return serie.correlation;
      }));
      const shapes = ["circle", "triangle", "square", "pentagon", "hexagon", "star"];
      const colors = ["blue", "red", "green", "purple", "turquoise", "orange"];

      const allCalc = this.quadrantSet.map((serie) => {
        return {
          family: serie.family,
          label: serie.description,
          category: serie.name,
          x: serie.correlation - medianX,
          y: serie.average - medianY
        }
      });

      let seriesOption1 = [];
      allCalc.forEach(serie => {
        seriesOption1.push([
          serie.x,
          serie.y,
          serie.category,
        ])
      });

      const families = [...new Set(this.quadrantSet.map((serie) => {
        return serie.family;
      }))];

      let seriesOption2 = [];
      families.forEach((fam,i) => {
        let arr = [];
        allCalc.forEach((serie) => {
          if(serie.family === fam){
            arr.push(serie);
          }
        });
        seriesOption2.push(arr)
      });

      seriesOption2 = seriesOption2.map((el, i) => {
        return {
          name: el[0].family,
          series: el.map((e) => {
            return [e.x, e.y, e.category]
          }),
          color: colors[i],
          shape: shapes[i]
        }
      });

      console.log(seriesOption2)

      return {
        option1: [{
          name: "plot",
          series: seriesOption1,
          color: "blue",
          shape: "circle"
        }],
        option2: seriesOption2
      }
    },
    tabz(){
      return {
        activeTab: "01",
        actions: [
                    {
                        id: "01",
                        name: "Tab1",
                        tonalities: {
                            positive: 70,
                            neutral: 10,
                            negative: 20
                        },
                        count: 100,
                    },
                    {
                        id: "02",
                        name: "Tab2",
                        tonalities: {
                            positive: 120,
                            neutral: 50,
                            negative: 30,
                        },
                        count: 200,
                    },
                    {
                        id: "03",
                        name: "Tab3",
                        tonalities: {
                            positive: 150,
                            neutral: 30,
                            negative: 120
                        },
                        count: 300,
                    }
                ],
      }
    },
    miniData(){
      return {
        dataset: [
          {
            label: "VOC survey", // for types: score-tonality (legend name); score-ctl (progression description); ranking-only (progression description)
            score: 8, // for type score-ctl : must be most recent score
            scoreBase: 10, // for types: score-only; score-tonality; score-ctl; ranking-only (for total base)
            progression: 2, // for types: score-ctl (gain vs initial); ranking-only (places compared to previous period); all must be computed on the backEnd
            tonalities: {
              positive: 10, 
              neutral: 3, 
              negative: 5 
            },
            kpi: {
              hasTarget: true,
              isOnTarget: false,
              ratio: "5%",
              showRatio: true,
              target: "10%",
              targetTranslation: "GOAL",
              value: "34",
            }
          },
          // {
          //   label:"Benchmark survey",
          //   score: 7,
          //   scoreBase: 10,
          //   tonalities: {
          //     positive: 12, 
          //     neutral: 2, 
          //     negative: 4,
          //   }
          // },
          // {
          //   label:"Random thing",
          //   score: 8.4,
          //   scoreBase: 10,
          //   tonalities: {
          //     positive: 12, 
          //     neutral: 2, 
          //     negative: 0.5 
          //   }
          // }
        ],
        title: "Tone by touchpoint",
        type: "kpi-only",
      }
    },
    rand(){
      const range = 500;
      const arr = [];
      let r = 0;
      let g = 0;
      let b = 0;
      for(let i = 0; i < range; i += 1){
        arr.push({
          id: `0${i}`,
          name: `set_${i}`,
          value: i,
          color: `rgb(${r},${g},${b})`
        });
        r += 0.33;
        g += 0.4;
        b += 0.3;
      }
      return arr;
    },
    relationCircle(){
      const range = 12;
      const dataset = [];
      for(let i = 0; i < range; i += 1){
        const r = Math.random() * 200;
        const g = Math.random() * 200;
        const b = Math.random() * 200;
        function generateRelations(){
          let qty = Math.round(Math.random() * 100);
          let arr = [];
          for(let k = 0; k < qty; k += 1){
            arr.push(`verbatim_${Math.round(Math.random()*range)}`)
          }
          return arr;
        }
        dataset.push({
          id: `verbatim_${i}`,
          verbatim: `verbatim_${i}`,
          color: `rgb(${r},${g},${b})`,
          relations: generateRelations()
        })
      }
      return dataset
    },
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    isAppLoading() {
      return store.state.isLoading;
    },
    isLogActive() {
      return store.state.settings.isLogActive;
    },
    archive() {
      const logs = store.state.storedCategories.find(
        (cat) => cat.name === "DONE"
      );
      const base = logs ? logs.items.length : 1;
      const done = logs ? logs.items.filter((log) => log.archived).length : 0;
      const ratio = (done / base) * 100;
      return {
        base,
        done,
        ratio,
      };
    },
    randomTreemap() {
      const range = 50;
      const lorem =
        "Lorem ipsum dolor sit amet consectetur adipiscing elit Nulla vel accumsan metus Maecenas ac luctus nisi Aliquam ultricies enim ut blandit hendrerit Phasellus scelerisque malesuada dolor quis porta Vivamus eleifend risus quis ultricies maximus sapien risus imperdiet lorem ut commodo justo arcu sit amet ante Morbi quam magna euismod vel est sit amet sodales faucibus leo Aliquam dictum vulputate nisi imperdiet tempor Maecenas ullamcorper placerat nisi eu imperdiet dui vehicula vitae Curabitur sed consectetur erat in efficitur ligula Nullam volutpat mauris vel justo lacinia posuere Ut eu sagittis lorem a tempus orci Cras ac pretium odio et pharetra purus Nullam".split(
          " "
        );
      const dataset = [];
      for (let i = 0; i < range; i += 1) {
        dataset.push({
          name: lorem[i],
          area: Math.round(
            Math.round(Math.random() * 100) * Math.random() * 100
          ),
          // color: "transparent",
          color: `rgb(${Math.round(Math.random() * 200)},${Math.round(
            Math.random() * 200
          )},${Math.round(Math.random() * 200)})`,
        });
      }
      return dataset;
    },
    randomDataset() {
      const range = 20;
      const dataset = [[0, 0]];
      const dataset2 = [];
      const dataset3 = [];
      for (let i = 0; i < range; i += 1) {
        const isNeg1 = Math.random() > 0.5;
        const isNeg2 = Math.random() > 0.8;
        let x = Math.round(Math.random() * 100);
        let y = Math.round(Math.random() * 100);
        if (isNeg1) {
          x = -x;
        }
        if (isNeg2) {
          y = -y;
        }
        dataset.push([x, y]);
      }
      for (let i = 0; i < range; i += 1) {
        const isNeg1 = Math.random() > 0.2;
        const isNeg2 = Math.random() > 0.2;
        let x = Math.round(Math.random() * 100);
        let y = Math.round(Math.random() * 100);
        if (isNeg1) {
          x = -x;
        }
        if (isNeg2) {
          y = -y;
        }
        dataset2.push([x, y]);
      }
      for (let i = 0; i < range; i += 1) {
        const isNeg1 = Math.random() > 0.8;
        const isNeg2 = Math.random() > 0.1;
        let x = Math.round(Math.random() * 100);
        let y = Math.round(Math.random() * 100);
        if (isNeg1) {
          x = -x;
        }
        if (isNeg2) {
          y = -y;
        }
        dataset3.push([x, y]);
      }
      return [
        {
          name: "Gamme bleue",
          series: dataset,
          color: "orange",
          radius: 3,
          shape: "star",
        },
        {
          name: "Gamme rouge",
          series: dataset2,
          color: "red",
          radius: 3,
          shape: "triangle",
        },
        {
          name: "Gamme verte",
          series: dataset3,
          color: "green",
          radius: 3,
        },
      ];
    },
    cloud(){
      return [
        {
          verbatim: "One",
          breakdown: [
            {
              name: "bad",
              value: 10,
              color: "red"
            },
            {
              name: "avg",
              value: 7,
              color: "grey"
            },
            {
              name: "good",
              value: 3,
              color: "green"
            }
          ]
        },
        {
          verbatim: "Two",
          breakdown: [
            {
              name: "bad",
              value: 20,
              color: "red"
            },
            {
              name: "avg",
              value: 7,
              color: "grey"
            },
            {
              name: "good",
              value: 3,
              color: "green"
            }
          ]
        },
        {
          verbatim: "Three",
          breakdown: [
            {
              name: "bad",
              value: 30,
              color: "red"
            },
            {
              name: "avg",
              value: 7,
              color: "grey"
            },
            {
              name: "good",
              value: 3,
              color: "green"
            }
          ]
        }
      ]
    },
  },
  created() {
    setTimeout(() => {
      this.isDark = this.isDarkMode === true;
      this.isLog = this.isLogActive === true;
    }, 300);
    this.randomCloud = this.randomDonutCloud();
  },
  methods: {
    makeLinut(months){
      function rand(mult){
        let arr = [];
        for(let i = 0; i < months; i += 1){
          arr.push(Math.random() * mult);
        }
        return arr;
      }
      return [
          {
            id: "01",
            name: "Positive",
            color: "#15B300",
            data: rand(100),
          },
          {
            id: "02",
            name: "Negative",
            color: "#F17171",
            data: rand(50),
          },
          {
            id: "03",
            name: "Neutral",
            color: "#ccc",
            data: rand(25),
          },
          {
            id: "04",
            name: "Mixed",
            color: "#ebc034",
            data: rand(10),
          },
        ];
    },
    makeTwo(months){
      function rand(){
        let arr = [];
        for(let i = 0; i < months; i += 1){
          arr.push(Math.random() * 100);
        }
        return arr;
      }
      return [
          {
            id: "01",
            name: "Positive",
            color: "#15B300",
            data: rand(),
          },
          {
            id: "02",
            name: "Negative",
            color: "#F17171",
            data: rand(),
          },
        ];
    },
    makeOne(months){
      function rand(){
        let arr = [];
        for(let i = 0; i < months; i += 1){
          arr.push(Math.random() * 100);
        }
        return arr;
      }
      return [
          {
            id: "01",
            name: "Positive",
            color: "#15B300",
            data: rand(),
          },
        ];
    },
    selectTab(tab){
      console.log(tab)
    },
    updateDrop(){
      this.randomCloud = this.randomDonutCloud();
      this.dropstep += 1;
    },
    buttonClick() {
      console.log("TEST");
    },
    toggleModal() {
      this.isOpen = !this.isOpen;
    },
    toggleSetting(setting, value) {
      store.commit("CHANGE_SETTING", {
        setting,
        value,
      });
      store.dispatch("UPDATE_SETTINGS", store.state.settings);
    },
    getIcons(icons) {
      this.icons = icons;
    },
    fakeSet(){
      const range = 100;
      const arr = [];
      const words = "Loremipsumdolor consectetur adipiscing elit Vestibulum sit quam rutrum nisi cursus semper est dignissim fermentum hac habitasse platea dictumst Suspendisse potenti Curabitur tellus congue aliquam erat vitae dignissim tortor Nullam purus sapien varius non metus egestas accumsan tortor Aliquam lobortis enim nec euismod pellentesque Donec lacus magna volutpat faucibus dui eget volutpat Aliquam in sodales augue Cras fringilla ligula sed risus orci pellentesque vitae erat eleifend varius Aliquam tortor commodo ornare nunc vel tincidunt neque Nulla tincidunt eros facilisis posuere tortor sit amet faucibus dolor Vestibulum elementum ultricies urna vitae consectetur est congue Suspendisse turpis ligula pulvinar tortor semper ultricies rhoncus ipsum Aenean vel quam sed quam viverra tempor Pellentesque metus varius odio ullamcorper eleifend Fusce lacus justo Donec enim accumsan pellentesque felis vel tempus orci Praesent bibendum est Etiam lectus ligula malesuada massa vel vehicula consectetur augue Sed tristique tortor fermentum maximus ligula turpis pharetra felis efficitur enim quam felis pellentesque tellus felis convallis consectetur Aenean nec malesuada diam Morbi augue aliquam dignissim nisl Duis Loremipsumdolor consectetur adipiscing elit Vestibulum sit quam rutrum nisi cursus semper est dignissim fermentum hac habitasse platea dictumst Suspendisse potenti Curabitur tellus congue aliquam erat vitae dignissim tortor Nullam purus sapien varius non metus egestas accumsan tortor Aliquam lobortis enim nec euismod pellentesque Donec lacus magna volutpat faucibus dui eget volutpat Aliquam in sodales augue Cras fringilla ligula sed risus orci pellentesque vitae erat eleifend varius Aliquam tortor commodo ornare nunc vel tincidunt neque Nulla tincidunt eros facilisis posuere tortor sit amet faucibus dolor Vestibulum elementum ultricies urna vitae consectetur est congue Suspendisse turpis ligula pulvinar tortor semper ultricies rhoncus ipsum Aenean vel quam sed quam viverra tempor Pellentesque metus varius odio ullamcorper eleifend Fusce lacus justo Donec enim accumsan pellentesque felis vel tempus orci Praesent bibendum est Etiam lectus ligula malesuada massa vel vehicula consectetur augue Sed tristique tortor fermentum maximus ligula turpis pharetra felis efficitur enim quam felis pellentesque tellus felis convallis consectetur Aenean nec malesuada diam Morbi augue aliquam dignissim nisl Duis ".split(" ");
      for(let i = 0; i < range; i += 1){
        const r = Math.random()* 200;
        const g = Math.random()* 200;
        const b = Math.random()* 200;
        arr.push({
          verbatim: words[i],
          weight: Math.random()*1000
        })
      }
      return arr;
    },
    
    randomDonutCloud(){
      const range = 20;
           const words = "Loremipsumdolor sit amet consectetur adipiscing elit Vestibulum sit amet quam rutrum nisi cursus semper Sed ac est eu mi dignissim fermentum In hac habitasse platea dictumst Suspendisse potenti Curabitur a tellus congue aliquam erat vitae dignissim tortor Nullam purus sapien varius non metus eu egestas accumsan tortor Aliquam lobortis enim nec euismod pellentesque Donec id lacus magna Sed volutpat faucibus dui eget volutpat Aliquam in sodales augue Cras et fringilla ligula Ut sed risus orci In pellentesque vitae erat eleifend varius Aliquam ac tortor commodo ornare nunc vel tincidunt neque Nulla tincidunt eros facilisis posuere tortor sit amet faucibus dolor Vestibulum elementum ultricies urna vitae consectetur est congue id Suspendisse turpis ligula pulvinar ut tortor semper ultricies rhoncus ipsum Aenean vel quam sed quam viverra tempor Pellentesque ut metus varius odio ullamcorper eleifend Fusce id lacus justo Donec eu enim accumsan pellentesque felis vel tempus orci Praesent ut bibendum est Etiam lectus ligula malesuada ac massa vel vehicula consectetur augue Sed tristique tortor et fermentum maximus ligula turpis pharetra felis eu efficitur enim quam eu felis Ut pellentesque tellus et felis convallis consectetur Aenean nec malesuada diam Morbi id ex ac augue aliquam dignissim id eu nisl Duis Loremipsumdolor sit amet consectetur adipiscing elit Vestibulum sit amet quam rutrum nisi cursus semper Sed ac est eu mi dignissim fermentum In hac habitasse platea dictumst Suspendisse potenti Curabitur a tellus congue aliquam erat vitae dignissim tortor Nullam purus sapien varius non metus eu egestas accumsan tortor Aliquam lobortis enim nec euismod pellentesque Donec id lacus magna Sed volutpat faucibus dui eget volutpat Aliquam in sodales augue Cras et fringilla ligula Ut sed risus orci In pellentesque vitae erat eleifend varius Aliquam ac tortor commodo ornare nunc vel tincidunt neque Nulla tincidunt eros facilisis posuere tortor sit amet faucibus dolor Vestibulum elementum ultricies urna vitae consectetur est congue id Suspendisse turpis ligula pulvinar ut tortor semper ultricies rhoncus ipsum Aenean vel quam sed quam viverra tempor Pellentesque ut metus varius odio ullamcorper eleifend Fusce id lacus justo Donec eu enim accumsan pellentesque felis vel tempus orci Praesent ut bibendum est Etiam lectus ligula malesuada ac massa vel vehicula consectetur augue Sed tristique tortor et fermentum maximus ligula turpis pharetra felis eu efficitur enim quam eu felis Ut pellentesque tellus et felis convallis consectetur Aenean nec malesuada diam Morbi id ex ac augue aliquam dignissim id eu nisl Duis Loremipsumdolor sit amet consectetur adipiscing elit Vestibulum sit amet quam rutrum nisi cursus semper Sed ac est eu mi dignissim fermentum In hac habitasse platea dictumst Suspendisse potenti Curabitur a tellus congue aliquam erat vitae dignissim tortor Nullam purus sapien varius non metus eu egestas accumsan tortor Aliquam lobortis enim nec euismod pellentesque Donec id lacus magna Sed volutpat faucibus dui eget volutpat Aliquam in sodales augue Cras et fringilla ligula Ut sed risus orci In pellentesque vitae erat eleifend varius Aliquam ac tortor commodo ornare nunc vel tincidunt neque Nulla tincidunt eros facilisis posuere tortor sit amet faucibus dolor Vestibulum elementum ultricies urna vitae consectetur est congue id Suspendisse turpis ligula pulvinar ut tortor semper ultricies rhoncus ipsum Aenean vel quam sed quam viverra tempor Pellentesque ut metus varius odio ullamcorper eleifend Fusce id lacus justo Donec eu enim accumsan pellentesque felis vel tempus orci Praesent ut bibendum est Etiam lectus ligula malesuada ac massa vel vehicula consectetur augue Sed tristique tortor et fermentum maximus ligula turpis pharetra felis eu efficitur enim quam eu felis Ut pellentesque tellus et felis convallis consectetur Aenean nec malesuada diam Morbi id ex ac augue aliquam dignissim id eu nisl Duis".split(" ");
      const dataset = [];
      for (let i = 0; i < range; i += 1){
        dataset.push({
          id: `id_${i}`,
          verbatim: words[i],
          series: [
            {
              name: `promoteurs`,
              value: Math.random()*1000,
              color: "#15B300",
            },
            {
              name: `passifs`,
              value: Math.random()*1000,
              color: "#C4C4C4",
            },
            {
              name: `détracteurs`,
              value: Math.random()*1000,
              color: "#F17171",
            },
          ]
        })
      }
      return dataset;
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
.settings-list {
  margin: auto;
  margin-top: 80px;
  border-radius: 3px;
}
.button-showcase {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: 130px;
}
.showcase {
  margin-top: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 36px;
  margin-left: 200px;
}
.temp-wrapper{
  border: 1px dashed grey;
}
</style>
