import utils from "../src/utils/index";

test("adds 1 + 2 equals 3", () => {
  expect(utils.sum(1, 2)).toBe(3);
});

test("should check for null prop in a nested object and return its value or undefined", () => {
  const user = {
    base: {
      nested1: {
        nested2: "1",
      },
    },
  };
  const arr = ["base", "nested1", "nested2"];
  expect(utils.checkObject(user, arr)).toBe("1");
  expect(!!utils.checkObject(user, arr)).toBe(true);
  const user2 = {
    base: {
      nested1: {
        nested2: undefined,
      },
    },
  };
  expect(utils.checkObject(user2, arr)).toBe(undefined);
  const arr2 = ["base", "nested1", "nested2", "nested3"];
  expect(utils.checkObject(user, arr2)).toBe(undefined);
  expect(!!utils.checkObject(user, arr2)).toBe(false);
  const user3 = {
    base: {
      nested1: [
        {
          num: "1",
        },
        {
          num: "2",
        },
      ],
    },
  };
  const arr3 = ["base", "nested1", 1, "num"];
  expect(utils.checkObject(user3, arr3)).toBe("2");
  const complexObj = {
    a: {
      b: {
        c: {
          d: {
            e: {
              f: {
                g: {
                  h: [
                    {
                      i: {
                        j: "prop",
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  };
  const complexArr = ["a", "b", "c", "d", "e", "f", "g", "h", 0, "i", "j"];
  expect(utils.checkObject(complexObj, complexArr)).toBe("prop");
});

test("should remove all punctuation from an array of strings", () => {
  const list = [
    "I,",
    "am:",
    "testing",
    "this;",
    "function!",
    "or%",
    "am?",
    "I(",
  ];
  expect(utils.removePunctuation(list)).toStrictEqual([
    "I",
    "am",
    "testing",
    "this",
    "function",
    "or",
    "am",
    "I",
  ]);
});

test("should split an array into chunks of same size", () => {
  const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  expect(utils.chunkArray(numArray, 3)).toStrictEqual([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);

  expect(utils.chunkArray(numArray, 5)).toStrictEqual([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9],
  ]);

  const objArray = [
    { x: 1, y: "a" },
    { x: 2, y: "b" },
    { x: 3, y: "c" },
    { x: 4, y: "d" },
  ];
  expect(utils.chunkArray(objArray, 2)).toStrictEqual([
    [
      { x: 1, y: "a" },
      { x: 2, y: "b" },
    ],
    [
      { x: 3, y: "c" },
      { x: 4, y: "d" },
    ],
  ]);
});
