<template>
  <div class="lds-roller">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  zoom: 80%;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.1, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;

  border-radius: 50%;
  background: #fff;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
  &:after {
    top: 63px;
    left: 63px;
    opacity: 0.3;
    width: 3px;
    height: 3px;
  }
}

.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
  &:after {
    top: 68px;
    left: 56px;
    opacity: 0.4;
    width: 4px;
    height: 4px;
  }
}

.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
  &:after {
    top: 71px;
    left: 48px;
    opacity: 0.5;
    width: 5px;
    height: 5px;
  }
}

.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
  &:after {
    top: 72px;
    left: 40px;
    opacity: 0.6;
    width: 6px;
    height: 6px;
  }
}

.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
  &:after {
    top: 71px;
    left: 32px;
    opacity: 0.7;
    width: 7px;
    height: 7px;
  }
}

.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
  &:after {
    top: 68px;
    left: 24px;
    opacity: 0.8;
    width: 8px;
    height: 8px;
  }
}

.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
  &:after {
    top: 63px;
    left: 17px;
    opacity: 0.9;
    width: 9px;
    height: 9px;
  }
}

.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
  &:after {
    top: 56px;
    left: 12px;
    width: 10px;
    height: 10px;
  }
}

@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
