<template>
  <div class="components">
    <h1 class="components__title green--text text--lighten-4">Components</h1>
    <ComponentShowcase class="mt-5" />
  </div>
</template>

<script>
import store from "../store";
import ComponentShowcase from "../components/ComponentShowcase.vue";

import Vue from "vue";
export default Vue.extend({
  name: "Components",
  components: {
    ComponentShowcase,
  },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.components {
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
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 36px;
    margin: 76px 36px 0 90px;
    padding: 36px;
    &--dark {
      background: transparent;
    }
    &__description {
      width: 30%;
    }
    &__example {
      width: 40%;
    }
    &__controls {
      width: 30%;
      &__title {
        margin-bottom: 36px;
        width: 100%;
        text-align: left;
      }
      &--dark {
        color: white;
      }
      &--scroll {
        height: 500px;
        overflow-x: scroll;
        padding: 12px;
      }
    }

    &__description {
      &__title {
        margin-bottom: 12px;
      }
    }
    &__example {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__description {
      text-align: left;
      &--dark {
        color: lightgrey;
      }
      &--column {
        flex-direction: column;
        width: 100%;
      }
    }
  }
  &__title {
    left: 80px;
    position: absolute;
    text-align: left;
    top: 15px;
  }
  &__checkboxes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 36px);
    justify-content: center;
  }
}
</style>
