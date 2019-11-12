export function randomize(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function generateData(
  amount: number,
  min: number,
  max: number,
  timestampStart: number,
  timestampTick: number,
): Array<[number, number]> {
  return Array.from(Array(amount).keys()).map(
    v =>
      [timestampStart + timestampTick * v, randomize(min, max)] as [
        number,
        number,
      ],
  );
}
