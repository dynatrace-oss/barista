import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { hasContentApartFrom } from '../helpers';

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

    const cardChildren = [
      'dt-card-title',
      'dt-card-subtitle',
      'dt-card-icon',
      'dt-card-title-actions',
      'dt-card-footer-actions',
    ];

    if (hasContentApartFrom(element, cardChildren)) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-card must always contain content apart from tilte, subtitle, icon and actions.');
  }
}

/**
 * The dtCardNoEmptyRule ensures that a dt-card always contains content
 * apart from a title, subtitle, actions etc.
 *
 * The following example passes the check:
 * <dt-card>
 *   <dt-card-title>Top 3 JavaScript errors</dt-card-title>
 *   <dt-card-subtitle>Detailed information about JavaScript errors</dt-card-subtitle>
 *   <p>This is some card content, and there is more to come.</p>
 *   // ...
 * </dt-card>
 *
 * For the following example the linter throws an error:
 * <dt-card>
 *   <dt-card-title>Top 3 JavaScript errors</dt-card-title>
 *   <dt-card-subtitle>Detailed information about JavaScript errors</dt-card-subtitle>
 * </dt-card>
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dt-card always contains content apart from title, subtitle, icon and actions.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dt-card must always contain content apart from title, subtitle, icon and actions.',
    ruleName: 'dt-card-no-empty',
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
