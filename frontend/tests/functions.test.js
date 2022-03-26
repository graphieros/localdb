import utils from "../src/utils/index";

test("adds 1 + 2 equals 3", () => {
  expect(utils.sum(1, 2)).toBe(3);
});
