<template>
  <v-icon :class="icoClass">{{ type }}</v-icon>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Ico",
  props: {
    type: String,
    color: String,
  },
  components: {},
  computed: {
    icoClass() {
      return this.color || "green--text";
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.rounded {
  border-radius: 2px;
}
</style>
