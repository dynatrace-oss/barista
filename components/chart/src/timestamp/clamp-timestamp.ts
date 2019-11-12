/**
 * @internal
 * Clamps a timestamp according to the provided max and min width constraints
 */
export function clampTimestamp(
  timestamp: number,
  maxWidth: number,
  minWidth: number = 0,
): number {
  let clamped = timestamp;

  if (timestamp < minWidth) {
    clamped = minWidth;
  }

  if (timestamp > maxWidth) {
    clamped = maxWidth;
  }

  return clamped;
}
