<template>
  <dialog ref="dialog" class="dialog" :open="open">
    <div class="dialog__body">
      <button @click="close()" class="dialog__button--close">
        <svg
          class="dialog__button__svg-close"
          style="width: 24px; height: 24px"
          viewBox="0 0 24 24"
        >
          <path
            fill="black"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </button>
      <slot></slot>
    </div>
  </dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Modal",
  components: {},
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
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

<style lang="scss" scoped>
.dialog {
  height: 200px;
  width: 400px;
  background: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  border: none;
  padding: 12px;
  box-shadow: 0px 10px 20px -10px rgba(128, 128, 128, 0.377);
  &_body {
    height: 100%;
    position: relative;
    width: 100%;
  }
  &__button {
    &--close {
      align-items: center;
      background-color: transparent;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      padding: 3px;
      position: absolute;
      right: 12px;
      top: 12px;
      &:hover {
        background-color: grey;
        .dialog {
          &__button {
            &__svg-close path {
              fill: white;
            }
          }
        }
      }
    }
  }
}
</style>
