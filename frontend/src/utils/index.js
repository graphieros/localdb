export function sum(a, b) {
  return a + b;
}

export function computePercentage(num, total, precision = 0) {
  return `${((num / total) * 100).toFixed(precision)}%`;
}

export const undesirable = [
  " a ",
  " b ",
  " c ",
  " d ",
  " e ",
  " f ",
  " g ",
  " h ",
  " i ",
  " j ",
  " k ",
  " l ",
  " m ",
  " n ",
  " o ",
  " p ",
  " q ",
  " r ",
  " s ",
  " t ",
  " u ",
  " v ",
  " w ",
  " x ",
  " y ",
  " z ",
  " & ",
  " an ",
  " and ",
  " as ",
  " be ",
  " by ",
  " can ",
  " for ",
  " from ",
  " if ",
  " in ",
  " into ",
  " is ",
  " it ",
  " its ",
  " not ",
  " of ",
  " on ",
  " or ",
  " out ",
  " such ",
  " the ",
  " then ",
  " this ",
  " through ",
  " to ",
  " which ",
  " with ",
];

const utils = {
  computePercentage,
  sum,
  undesirable,
};

export default utils;
