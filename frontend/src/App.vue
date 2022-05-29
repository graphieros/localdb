<template>
  <router-view />
</template>

<style lang="scss">
@font-face {
  font-family: "Product Sans";
  src: url("../../fonts/ProductSans.ttf") format("ttf");
}
#app {
  font-family: "Product Sans";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
}
</style>
