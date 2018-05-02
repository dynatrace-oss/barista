/**
 * function that merges and clones two objects
 */
export function mergeOptions<T>(a: T, b: T): T {
  // tslint:disable-next-line: no-object-literal-type-assertion
  const cloned = {} as T;
  Object.keys(a).forEach((key) => {
    cloned[key] = a[key];
  });
  if (b) {
    Object.keys(b).forEach((key) => {
      (typeof cloned[key] === 'object' && !Array.isArray(cloned[key])) ?
        cloned[key] = mergeOptions(cloned[key], b[key]) : cloned[key] = b[key];
    });
  }

  return cloned;
}
