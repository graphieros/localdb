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

export function convertStringToTreemap(string) {
  const array = string.split(" ");
  let counts = array.reduce(
    (acc, value) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1,
    }),
    {}
  );

  return Object.keys(counts)
    .map((key, i) => {
      return {
        x: key,
        y: counts[key],
      };
    })
    .sort((a, b) => b.y - a.y);
}

export function removeClutter(list) {
  const punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  if (typeof list === "object") {
    return list.map((item) => {
      return item.replace(punctuation, " ");
    });
  } else {
    return list.replace(punctuation, " ");
  }
}

export function removeUndesirableWords(string) {
  string = string.toLowerCase();
  string = string.replace(/  +/g, " ");
  string = string.replaceAll("\n", " ");
  string = string.replace(/[0-9]/g, "");

  undesirable.forEach((letter) => {
    string = string.replaceAll(letter, " ");
  });

  return string;
}

const utils = {
  computePercentage,
  convertStringToTreemap,
  removeClutter,
  removeUndesirableWords,
  sum,
  undesirable,
};

export default utils;
