<template>
  <div class="vintage-icon">
    <div
      :class="{
        'vintage-icon__entity': true,
        'vintage-icon__entity--shadow': shadow,
      }"
      v-html="vintageIcon"
      :style="iconStyle"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
//reference: https://www.htmlsymbols.xyz/
import Vue from "vue";
export default Vue.extend({
  name: "VintageIcon",
  components: {},
  props: {
    color: {
      type: String,
      default: "black",
    },
    entity: {
      type: String,
      default: undefined,
    },
    icon: {
      type: String,
      default: "",
    },
    rem: {
      type: String | Number,
      default: 1.6,
    },
    rotation: {
      type: String | Number,
      default: 0,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icons: {
        arrow: "&#129082;",
        asterisk: "&#10018;",
        ballotCheck: "&#128505;",
        burger: "&#119064;",
        checkedBox: "&#9746;",
        circle: "&#9675;",
        circleCross: "&#11199;",
        cloud: "&#9729;",
        doubleBurger: "&#119065;",
        emptyBox: "&#9744;",
        emptyHex: "&#9108;",
        emptyStar: "&#9734;",
        envelope: "&#9993;",
        fatBallot: "&#10008;",
        fatCheck: "&#10004;",
        fatClose: "&#10006;",
        fatCross: "&#10010;",
        filledHex: "&#11043;",
        filledStar: "&#9733;",
        flower: "&#10047;",
        heavyCheck: "&#10004;",
        nib: "&#10002;",
        pencil: "&#9999;",
        pentagon: "&#11202;",
        pointer: "&#9205;",
        quote: "&#10077;",
        reset: "&#8634;",
        roundedTriangle: "&#128710;",
        slimBallot: "&#10007;",
        slimCheck: "&#10003;",
        slimClose: "&#10005;",
        slimCross: "&#10011;",
        square: "&#11200;",
        sun: "&#9788;",
        triangle: "&#11205;",
        warning: "&#9888;",
      },
    };
  },
  computed: {
    iconStyle() {
      return `color:${this.color};
              font-size:${this.rem}rem;
              transform:rotate(${this.rotation}deg)`;
    },
    vintageIcon() {
      if (this.entity) {
        return this.entity;
      }
      return this.icons[this.icon];
    },
  },
  methods: {
    // emit icons to make the list visible to the parent
    getIcons() {
      this.$emit("getIcons", this.icons);
    },
  },
  created() {
    this.getIcons();
  },
});
</script>

<style lang="scss" scoped>
.vintage-icon {
  display: flex;
  align-items: center;
  &__entity {
    &--shadow {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
