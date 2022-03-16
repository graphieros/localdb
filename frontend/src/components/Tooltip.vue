<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
      <slot v-bind="attrs" v-on="on"></slot>
    </template>
    <span :style="tooltipStyle">
      {{ content }}
    </span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Tooltip",
  props: {
    color: String,
    content: String,
    direction: String,
  },
  components: {},
  computed: {
    tooltipStyle() {
      return `background:${this.color}`;
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped></style>
