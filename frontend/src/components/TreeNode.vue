<template>
  <g class="treenode">
    <circle :cx="nodes.x" :cy="nodes.y" r="3" fill="grey"/>
    <!-- TODO: node styling & position -->

  </g>
</template>

<script>
export default {
  name: "TreeNode",
  props: {
    nodes: {
        type: Array,
        default(){
            return {}
        }
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>

