<template>
  <dialog
    ref="dialog"
    :class="{ dialog: true, 'dialog--fullscreen': fullScreen }"
    :style="dialogStyle"
    @keydown.esc="$emit('close')"
  >
    <div class="dialog__body">
      <button
        @click="close()"
        class="dialog__button--close"
        :style="`background:${buttonColorState}`"
        @mouseenter="hoverStyle(true)"
        @mouseleave="hoverStyle(false)"
        v-if="!hideCloseButton"
      >
        <svg
          class="dialog__button__svg-close"
          :style="`width: 24px; height: 24px`"
          viewBox="0 0 24 24"
        >
          <path
            :fill="iconColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </button>
      <div v-if="title" class="dialog__title">
        {{ title }}
      </div>
      <div class="dialog__user-content">
        <slot></slot>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Modal",
  props: {
    backgroundColor: {
      type: String,
      default: "#FFFFFF",
    },
    borderColor: {
      type: String,
      default: "",
    },
    borderRadius: {
      type: String,
      default: "12px",
    },
    borderWidth: {
      type: String,
      default: "",
    },
    buttonColor: {
      type: String,
      default: "#FF5252",
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "300px",
    },
    hideCloseButton: {
      type: Boolean,
      default: false,
    },
    iconColor: {
      type: String,
      default: "#000",
    },
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "400px",
    },
  },
  computed: {
    dialogStyle() {
      const backgroundColor = this.backgroundColor;
      const borderColor = this.borderColor;
      const borderWidth = this.borderWidth;
      const borderRadius = this.borderRadius;
      const height = this.height;
      const width = this.width;
      return `background-color:${backgroundColor};border:${borderWidth} solid ${borderColor};border-radius:${borderRadius};height:${height};width:${width}`;
    },
  },
  data() {
    return {
      buttonColorState: "transparent",
    };
  },
  destroyed() {
    const dialog = this.$refs.dialog;
    const that = this;
    this.$emit("close");
    dialog.removeEventListener("click", (event) => {
      that.closeOnClickOutside(event, dialog);
    });
  },
  mounted() {
    const dialog = this.$refs.dialog;
    const that = this;
    dialog.addEventListener("click", (event) => {
      that.closeOnClickOutside(event, dialog);
    });
  },
  watch: {
    open(val) {
      if (val === true) {
        this.openModal();
      } else {
        this.$emit("close");
        this.$refs.dialog.close();
      }
    },
  },
  methods: {
    close() {
      this.$emit("close");
      this.$refs.dialog.close();
    },
    closeOnClickOutside(event, dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        this.$emit("close");
      }
    },
    hoverStyle(isHovering) {
      this.buttonColorState = isHovering ? this.buttonColor : "transparent";
    },
    openModal() {
      this.$refs.dialog.showModal();
    },
  },
});
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 26px;
}
::-webkit-scrollbar-track {
  margin-top: 12px;
  margin-bottom: 12px;
  background: #eeeeee;
  border-radius: 100vw;
  border: 1px solid #cacaca;
  /** border & background-clip create a margin right on the scrollbar */
  border: 0.5em solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb {
  background: #c4c4c4;
  border-radius: 100vw;
  border: 0.5em solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
}
.dialog {
  border-radius: 12px;
  border: none;
  box-shadow: 0px 10px 20px -10px rgba(128, 128, 128, 0.377);
  left: 50%;
  padding: 24px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);

  /** The backdrop is only visible if the dialog is open using the showModal native method */
  &::backdrop {
    background: radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
  }
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
  &__title {
    font-weight: 700;
    font-size: 1.3rem;
    width: 100%;
    text-align: left;
    padding: 0px 24px 0px 0px;
    margin-bottom: 12px;
  }
  &__user-content {
    width: 100%;
    text-align: left;
  }
  &--fullscreen {
    height: 100% !important;
    width: 100% !important;
    border-radius: 0 !important;
  }
}
</style>
