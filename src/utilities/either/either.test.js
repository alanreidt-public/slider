import { either } from "./either";
import { makeTestClass, template } from "../../../tests/testUtilities";

describe("either", () => {
  const describeTest = template`return ${"expectation"} from ${0} and ${1}`;
  const TestClass = makeTestClass(either, describeTest);

  describe("shall return fallback parameter, if origin isn't correct", () => {
    const funcOptions = [
      [undefined, 500],
      [null, 500],
      [NaN, 500],
      [false, 500],
      ["", 500],
    ];
    const expectations = new Array(funcOptions.length).fill(500);
    const test = new TestClass();
    test.test(funcOptions, expectations);
  });

  describe("shall return origin, if it's correct", () => {
    const funcOptions = [
      [100, 500],
      [0, 500],
      [-100, 500],
      [0.5, 500],
      [Infinity, 500],
      [-Infinity, 500],
    ];
    const expectations = [100, 0, -100, 0.5, Infinity, -Infinity];
    const test = new TestClass();
    test.test(funcOptions, expectations);
  });

  describe("shall return fallback, if neither is true", () => {
    const funcOptions = [
      [undefined, null],
      [null, undefined],
      [NaN, ""],
      [false, false],
      ["", NaN],
    ];
    const expectations = [null, undefined, "", false, NaN];
    const test = new TestClass();

    test.test(funcOptions, expectations);
  });
});