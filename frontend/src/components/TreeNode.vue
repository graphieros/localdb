<template>
  <g class="treenode">
    <circle :cx="nodes.x" :cy="nodes.y" r="3" fill="grey"/>
    <!-- TODO: node styling & position -->
      <TreeNode v-for="node in nodes" :nodes="node.nodes" :key="node.id"></TreeNode>
  </g>
</template>

<script>
export default {
  name: "TreeNode",
  props: {
    nodes: {
        type: Object,
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

