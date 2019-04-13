import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, hasContentApartFrom, isElementWithName } from '../../utils';
import { cardChildren } from './cardUtils';

class DtCardVisitor extends BasicTemplateAstVisitor {

  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-card')) {
      return;
    }

    if (hasContentApartFrom(element, cardChildren)) {
      return;
    }

    addFailure(this, element, 'A dt-card must always contain content apart from title, subtitle, icon and actions.');
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
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dt-card always contains content apart from title, subtitle, icon and actions.',
    // tslint:disable-next-line:no-null-keyword
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
      })
    );
  }
}
