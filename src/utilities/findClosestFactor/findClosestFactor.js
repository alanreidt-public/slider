import { isDivisible } from "../isDivisible/isDivisible";

/**
 * If this can be done, returns the closest factor (natural number (positive integer))
 * of division (the bigger one, if controversial).
 * Otherwise, returns NaN.
 *
 * @param {number} dividend The number, that to be divided.
 * @param {number} divisor The number, that divides the dividend.
 *
 * @returns {number} The closest factor (natural number (positive integer)) of the division.
 */
export function findClosestFactor(dividend, divisor) {
  const isArgumentsCorrect =
    Number.isFinite(dividend) && Number.isFinite(divisor) && dividend > 0;

  if (!isArgumentsCorrect) {
    return NaN;
  }

  if (divisor <= 0) {
    return 1;
  }

  // condition works as insurance
  for (
    let nextDivisor = divisor, prevDivisor = divisor;
    nextDivisor !== dividend || prevDivisor !== 1;
    nextDivisor += 1, prevDivisor -= 1
  ) {
    if (isDivisible(dividend, nextDivisor)) {
      return nextDivisor;
    }

    if (isDivisible(dividend, prevDivisor)) {
      return prevDivisor;
    }
  }

  return dividend;
}