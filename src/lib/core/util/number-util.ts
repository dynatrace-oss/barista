/** Clamps a value to be between two numbers, by default 0 and 100. */
export function clamp(v: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, v));
}
