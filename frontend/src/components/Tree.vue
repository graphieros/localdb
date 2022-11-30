<template>
  <svg class="tree" width="100%" :viewBox="`0 0 ${width} ${height}`">
    <TreeNode :nodes="nodes"/>
  </svg>
</template>

<script>
import TreeNode from "../components/TreeNode.vue";
export default {
  name: "Tree",
  components: { TreeNode },
  props: {
  },
  data() {
    return {
        height: 400,
        width: 400,
        gapX: 20,
        gapY: 20
    };
  },
  computed: {

  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
svg {
    background: white;
    overflow: visible;
}
</style>
