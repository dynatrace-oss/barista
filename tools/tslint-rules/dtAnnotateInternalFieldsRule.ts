import { IRuleMetadata, RuleFailure, Rules, WalkContext } from 'tslint';
import { getJsDoc, hasModifier } from 'tsutils';
import * as ts from 'typescript';

type CheckedDeclaration =
  | ts.GetAccessorDeclaration
  | ts.SetAccessorDeclaration
  | ts.PropertyDeclaration
  | ts.MethodDeclaration;

function hasInternalAnnotation(declaration: CheckedDeclaration): boolean {
  const jsDoc = getJsDoc(declaration);

  for (const doc of jsDoc) {
    if (doc.tags) {
      for (const tag of doc.tags) {
        if (tag.tagName.text === 'internal') {
          return true;
        }
      }
    }
  }
  return false;
}

function verifyDeclaration(
  context: WalkContext<any>, // tslint:disable-line:no-any
  declaration: CheckedDeclaration,
): void {
  if (
    !hasModifier(
      declaration.modifiers,
      ts.SyntaxKind.PrivateKeyword,
      ts.SyntaxKind.ProtectedKeyword,
    ) &&
    declaration.name.kind === ts.SyntaxKind.Identifier &&
    declaration.name.text.charAt(0) === '_' &&
    !hasInternalAnnotation(declaration)
  ) {
    context.addFailureAtNode(
      declaration,
      `De-facto private member '${declaration.name.text}' is not annotated with @internal`,
    );
  }
}

// tslint:disable-next-line:no-any
function walk(context: WalkContext<any>): void {
  function checkNode(node: ts.Node): void {
    // TODO ChMa: can we optimize linting by aborting early for certain kinds of nodes?

    switch (node.kind) {
      case ts.SyntaxKind.GetAccessor:
        verifyDeclaration(context, node as ts.GetAccessorDeclaration);
        break;
      case ts.SyntaxKind.SetAccessor:
        verifyDeclaration(context, node as ts.SetAccessorDeclaration);
        break;
      case ts.SyntaxKind.PropertyDeclaration:
        verifyDeclaration(context, node as ts.PropertyDeclaration);
        break;
      case ts.SyntaxKind.MethodDeclaration:
        verifyDeclaration(context, node as ts.MethodDeclaration);
        break;
      default:
        ts.forEachChild(node, checkNode);
    }
  }

  ts.forEachChild(context.sourceFile, checkNode);
}

const MATCH_REGEX = /.+\.ts$/gm;

/**
 * The dtAnnotateInternalFieldsRule ensures that all public fields with names
 * that start with an underscore are annotated as `@internal`.
 *
 * The following example passes the lint checks:
 * /** @internal This field is internal *\/
 * _internalProperty = 'I am private';
 *
 * For the following example the linter throws errors:
 * _internalProperty = 'I am supposed to be private';
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that all public fields with names that start with an underscore are annotated as `@internal`.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'All members of a class or interface that start with an underscore should not be accessed from outside the library.',
    ruleName: 'dt-annotate-internal-fields',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: ts.SourceFile): RuleFailure[] {
    return sourceFile.fileName.match(MATCH_REGEX)
      ? this.applyWithFunction(sourceFile, walk, this.getOptions())
      : [];
  }
}
