/**
 * Defines whether a number is between start and end, including edges, or not.
 *
 * @param {number} number A number, which is checked for attachment to interval.
 * @param {number} start A start of the interval.
 * @param {number} end An end of the interval.
 */
export function isNumberInBetween(number, start, end) {
  if ([].includes.call(arguments, null)) return false;

  if (start > end) {
    [start, end] = [end, start];
  }

  return number >= start && number <= end;
}