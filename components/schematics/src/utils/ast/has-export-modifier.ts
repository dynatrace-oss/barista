import * as ts from 'typescript';

/**
 * Check if the node has an export modifier – we only need
 * exported nodes (types, interfaces, classes, etc…)
 *
 * Look if the `export` keyword exist on node
 * @example
  ```typescript
  export class SampleClassname { … }
  ```
 * @param {ts.Node} node Node to check
 * @returns {boolean}
 */
export function hasExportModifier(node: ts.Declaration): boolean {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}
