import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

class DtCardVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }
  
  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (element.name !== 'dt-card') {
      return;
    }

    const hasDtCardTitle = element.children
      .some((child) => child instanceof ElementAst && child.name === 'dt-card-title');
    
    if (hasDtCardTitle) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-card must contain a dt-card-title element, that must be a direct child.');
  }
}

/**
 * The dtCardNeedsTitleRule ensures that a card always contains a title.
 *
 * The following example passes the lint checks:
 * <dt-card>
 *   <dt-card-title>Top 3 JavaScript errors</dt-card-title>
 *   // ...
 * </dt-card>
 *
 * For the following example the linter throws an error:
 * <dt-card>
 *   <dt-card-subtitle>Top 3 JavaScript errors</dt-card-subtitle>
 *   // ...
 * </dt-card>
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    // tslint:disable-next-line max-line-length
    description: 'Ensures that a card always has a title.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A card must always contain a dt-card-title.',
    ruleName: 'dt-card-needs-title',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtCardVisitor,
      }),
    );
  }
}
