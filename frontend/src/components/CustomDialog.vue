<template>
  <div class="custom-dialog">
    <div class="custom-dialog__overlay" v-if="open"></div>
    <div class="custom-dialog__box" ref="customDialog" v-if="open">
      <div class="custom-dialog__title" v-if="title">
        {{ title }}
      </div>
      <div class="custom-dialog__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
// implementation:
/* <CustomDialog :open="open1" title="Test">
      <v-btn @click.prevent="open1 = false">CLOSE</v-btn>
    </CustomDialog>

    <v-btn @click="open1 = true">OPEN</v-btn>
 */

import Vue from "vue";
export default Vue.extend({
  name: "CustomDialog",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  components: {},
  computed: {},
  data() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.custom-dialog {
  &__box {
    align-items: center;
    background: white;
    border-radius: 12px;
    border: none;
    box-shadow: 0px 10px 20px -10px rgba(200, 200, 200, 0.6);
    display: flex;
    height: 300px;
    justify-content: center;
    left: 50%;
    padding: 36px;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    z-index: 100001;
  }
  &__overlay {
    background: rgba(100, 100, 100, 0.2);
    display: block;
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 100000;
  }
  &__title {
    font-size: 1.5rem;
    left: 0;
    padding: 36px;
    position: absolute;
    top: 0;
  }
  &__content {
    background-color: grey;
  }
}
</style>
