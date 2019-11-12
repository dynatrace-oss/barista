/**
 * @internal
 * Clamps a range according to the provided max and min width constraints
 */
export function clampRange(
  range: { left: number; width: number },
  maxWidth: number,
  minWidth: number,
): { left: number; width: number } {
  let clampedLeft = range.left;
  let clampedWidth = range.width;

  if (range.left < 0) {
    clampedLeft = 0;
  }

  if (range.left + minWidth > maxWidth) {
    clampedLeft = maxWidth - minWidth;
  }

  if (range.width < minWidth) {
    clampedWidth = minWidth;
  }

  if (clampedWidth + clampedLeft > maxWidth) {
    clampedWidth = maxWidth - clampedLeft;
  }

  return { left: clampedLeft, width: clampedWidth };
}
