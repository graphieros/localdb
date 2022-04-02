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
  " the ",
  " to ",
  " and ",
  " on ",
  " be ",
  " is ",
  " if ",
  " with ",
  " or ",
  " its ",
  " can ",
  " in ",
  " not ",
  " for ",
  " by ",
  " this ",
  " into ",
  " out ",
  " which ",
  " of ",
  " then ",
  " such ",
  " as ",
  " an ",
  " through ",
  " from ",
];

const utils = {
  computePercentage,
  sum,
  undesirable,
};

export default utils;
