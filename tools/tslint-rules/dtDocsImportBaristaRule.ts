import { IOptions, IRuleMetadata, RuleFailure, Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';
// import { BinaryExpression, PropertyAccessExpression, SourceFile, SyntaxKind } from 'typescript';

const ORIGINAL_CLASS_NAME_IMPORT_DIR = '../../../core/decorators';

// tslint:disable-next-line:max-line-length
const FAILURE_STRING = `The imports in the docs/components/../exmaples folder have to be
from the same folder, or from the node_modules. In case that it get consumed from
htttp://barista.dynatrace.com/ as a flat folder structure.
Except the OriginalClassName import from '../../../core/decorators'! `;

class DocsImportRuleWalker extends RuleWalker {

    constructor(sourceFile: ts.SourceFile, options: IOptions) {
        super(sourceFile, options);
    }

    visitImportDeclaration(node: ts.ImportDeclaration) {
      const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
      if (
        !moduleSpecifier.match(ORIGINAL_CLASS_NAME_IMPORT_DIR) &&
        moduleSpecifier.match(/\.\./gm)
      ) {
        this.addFailureAt(node.getStart(), node.getWidth(), `${FAILURE_STRING}\n${node.getText()}`);
      }

      super.visitImportDeclaration(node);
    }
}

/**
 * Implementation of the dt-docs-import-barista rule.
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static metadata: IRuleMetadata = {
      description: 'Only import files from the same directory, or from node_modules in the docs!',
      // tslint:disable-next-line no-null-keyword
      options: null,
      optionsDescription: '',
      ruleName: 'dt-docs-import-barista',
      type: 'maintainability',
      typescriptOnly: true,
  };

  apply(sourceFile: ts.SourceFile): RuleFailure[] {
    if (sourceFile.fileName.match(/\/docs\/components\/[-\w]+\/examples\/.+\.ts$/gm)) {
      return this.applyWithWalker(new DocsImportRuleWalker(sourceFile, this.getOptions()));
    }
    return [];
  }
}
