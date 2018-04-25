export function mergeOptions<T>(a: T, b: T): T {
  Object.keys(b).forEach((key) => {
    (typeof a[key] === 'object' && !Array.isArray(a[key])) ? a[key] = mergeOptions(a[key], b[key]) : a[key] = b[key];
  });

  return a;
}
