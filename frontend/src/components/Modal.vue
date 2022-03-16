<template>
  <v-dialog :value="show" id="form" width="500" @click:outside="close()">
    <v-card :class="`pa-5`" :style="customStyle"
      ><v-btn
        x-small
        fab
        absolute
        top
        right
        outlined
        @click="close()"
        class="mt-9 error--text"
      >
        <Ico class="error--text" type="mdi-close" />
      </v-btn>
      <v-card-title class="mt-n4 ml-n4">
        <Ico :class="'grey--text mr-2'" :type="iconTitle" />

        {{ title }}
      </v-card-title>
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Ico from "@/components/Ico.vue";

export default Vue.extend({
  name: "Modal",
  components: { Ico },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    bgColor: String,
    borderColor: String,
    iconTitle: String,
    textColor: String,
    title: String,
  },
  components: {},
  computed: {
    show() {
      return this.dialog;
    },
    customStyle() {
      return `background-color:${this.bgColor}; border: 1px solid ${this.borderColor}; color:${this.textColor}`;
    },
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
});
</script>

<style lang="scss" scoped></style>
