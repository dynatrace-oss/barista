export function buildIndent(count: number): string {
  // tslint:disable-next-line:prefer-array-literal
  return '\n' + new Array(count + 1).join(' ');
}
