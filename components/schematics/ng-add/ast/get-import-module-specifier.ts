import * as ts from 'typescript';

/**
 * Retrieves a nodes import-declarations
 * @param node Current node
 */
export function getImportModuleSpecifier(
  node: ts.ImportDeclaration,
): string | null {
  if (ts.isStringLiteral(node.moduleSpecifier)) {
    return node.moduleSpecifier.text;
  }
  return null;
}
