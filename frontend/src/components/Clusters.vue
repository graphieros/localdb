<template>
  <svg width="100%" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">

    <rect 
        v-for="(cluster,i) in clusters" 
        :key="`cluster_${i}`"
        stroke="black"
        :x="cluster.x"
        :y="cluster.y"
        :height="cluster.size"
        :width="cluster.size"
        fill="none"
    />
  </svg>
</template>

<script>
export default {
  name: "Clusters",
  props: {
    dataset: {
        type: Object,
        default(){
            return {
                id: "01",
                name: "topic_1",
                series: [
                    {
                        name: "Positive",
                        value: 6,
                        color: "#15B300",
                    },
                    {
                        name: "Neutral",
                        value: 10,
                        color: "#ccc",
                    },
                    {
                        name: "Negative",
                        value: 19,
                        color: "#F17171",
                    },
                    {
                        name: "Mixed",
                        value: 3,
                        color: "#ebc034",
                    },
                    {
                        name: "Mixed",
                        value: 2,
                        color: "#ebc034",
                    }
                ]
            }
        }
    },
    height: {
        type: Number,
        default: 400
    },
    width: {
        type: Number,
        default: 400,
    }
  },
  data() {
    return {
        svgHeight: this.height,
        svgWidth: this.width,
    };
  },
  computed: {
    sortedDataset(){
        return {
                ...this.dataset,
                series: this.dataset.series.sort((s1,s2) => s2.value - s1.value)
            }
    },
    max(){
        return Math.max(...[...this.dataset.series].map((serie) => serie.value));
    },
    clusters(){
        const clusters = [];
        for(let i = 0; i < this.sortedDataset.series.length; i += 1){
            let val = this.sortedDataset.series[i].value;
            let size = this.getProportionTo(val, this.max) * this.width;
            let x = i === 0 ? 0 : i % 3 === 0 ? clusters[i - 1].x - size : i % 2 === 1 ? clusters[i - 1].x + clusters[i-1].size : clusters[i-1].x + clusters[i-1].size - size;
            let y = i === 0 ? 0 : i % 3 === 0 ? clusters[i - 1].y + clusters[i-1].size - size : i % 2 === 1 ? clusters[i - 1].y : clusters[i - 1].y + clusters[i - 1].size;
            clusters.push({
                val, size, x, y
            })
        }
        return clusters;
    }
  },
  methods: {
    getProportionTo(source, target){
        return source / target
    }
  },
};
</script>

<style lang="scss" scoped>
svg {
    background: white;
    overflow: visible
}
</style>
