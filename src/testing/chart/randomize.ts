export function randomize(min: number, max: number): number {
  if (min > max) {
    throw new Error(
      `Min value (${min}) must not be larger than max value (${max})`,
    );
  }
  return Math.floor(Math.random() * (max - min) + min);
}
