import { JsonAstObject, JsonAstNode } from '@angular-devkit/core';

export function findJsonPropertyInAst(
  node: JsonAstObject,
  propertyName: string,
): JsonAstNode | null {
  let maybeNode: JsonAstNode | null = null;
  for (const property of node.properties) {
    if (property.key.value === propertyName) {
      maybeNode = property.value;
    }
  }

  return maybeNode;
}
