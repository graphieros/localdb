export function sum(a, b) {
  return a + b;
}

/** Return a percent string
 *
 * @param {string | number} num - numerator (required)
 * @param {string | number } total - denominator (required)
 * @param {string | number} rounding - decimals (optional)
 * @returns the result of dividing num / total as a string with a % symbol
 */
export function computePercentage(num, total, rounding = 0) {
  return `${((Number(num) / Number(total)) * 100).toFixed(Number(rounding))}%`;
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
  " are ",
  " do ",
  "don't ",
  " don't ",
  " when ",
  " like ",
  " all ",
  " but ",
  " at ",
  " that ",
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

export function removePunctuation(list) {
  const punctuation = /[!"#$%&()*+,-./:;<=>?@[\]^_`{|}~]/g;
  if (typeof list === "object") {
    return list.map((item) => {
      item.replaceAll(" ", "");
      return item.replace(punctuation, "");
    });
  } else {
    list.replaceAll(" ", "");
    return list.replace(punctuation, "");
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

/** Checks for null values in object and returns undefined if the property does not exist
 *
 * @param {object} obj - the object we are searching
 * @param {string & number[]} arr - array of each nested property of the object (can be an index if one prop is an array)
 * @returns the value the last element provided in the array or undefined
 */
export function checkObject(obj, arr = []) {
  let result = undefined;
  let temp = obj || {};
  const last = arr.length - 1 || 0;

  arr.forEach((prop, i) => {
    if (typeof temp[prop] !== "undefined") {
      temp = temp[prop];
      if (i === last) {
        result = temp;
      }
    }
  });

  return result;
}

/** Split an array by chunks of same size
 *
 * @param {Array} array - An array
 * @param {number | string} chunkSize - the size of each chunk
 * @returns an array of arrays of the same size
 */
export function chunkArray(array, chunkSize) {
  let chunks = [];
  const arr = [...array];
  while (arr.length) {
    chunks.push(arr.splice(0, Number(chunkSize)));
  }
  return chunks;
}

export function getStarColor(rating) {
  switch (rating) {
    case 0:
      return "grey";
    case 0.5:
      return "#5cd65c";
    case 1:
      return "#5cd65c";
    case 1.5:
      return "#5cd65c";
    case 2:
      return "#adff2f";
    case 2.5:
      return "#adff2f";
    case 3:
      return "#ccff33";
    case 3.5:
      return "#ccff33";
    case 4:
      return "#ffff00";
    case 4.5:
      return "#ffff00";
    case 5:
      return "#ffcc00";
    case 5.5:
      return "#ffcc00";
    case 6:
      return "#ffae00";
    case 6.5:
      return "#ffae00";
    case 7:
      return "#ff9933";
    case 7.5:
      return "#ff9933";
    case 8:
      return "#ff6600";
    case 8.5:
      return "#ff6600";
    case 9:
      return "#ff3300";
    case 9.5:
      return "#ff3300";
    case 10:
      return "#FF0000";
    default:
      return "#CCCCCC";
  }
}

const utils = {
  checkObject,
  chunkArray,
  computePercentage,
  convertStringToTreemap,
  getStarColor,
  removePunctuation,
  removeUndesirableWords,
  sum,
  undesirable,
};

export default utils;
