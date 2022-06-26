<template>
  <div
    id="02"
    draggable="true"
    class="dragrid__draggable-item"
    @dragstart="dragme"
    @drag="$emit('dragging', $event)"
    @dragend="$emit('dragEnd', $event)"
  >
    <button @click="$emit('add', 1)">{{ num }}</button>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Dummy",
  props: {
    num: {
      type: Number,
      default: 0,
    },
    dragme: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  components: {},
  computed: {},
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped></style>
