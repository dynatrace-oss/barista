import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import {
  addFailure,
  hasTextContentAlternative,
  isElementWithName,
} from '../utils';

class DtConsumptionIconVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-consumption-icon')) {
      return;
    }

    if (hasTextContentAlternative(element, 'aria-label')) {
      return;
    }

    addFailure(this, element, 'A dt-consumption-icon must have an aria-label.');
  }
}

/**
 * The dtConsumptionIconAltTextRule ensures that a dt-consumption-icon always has an aria-label set.
 *
 * The following example passes the lint checks:
 * <dt-consumption>
 *   <dt-consumption-icon aria-label="Host">
 *     <dt-icon name="host"></dt-icon>
 *   </dt-consumption-icon>
 * </dt-consumption>
 *
 * For the following example the linter throws errors:
 * <dt-consumption>
 *   <dt-consumption-icon>
 *     <dt-icon name="host"></dt-icon>
 *   </dt-consumption-icon>
 * </dt-consumption>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-consumption-icon always has an aria-label set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-consumption-icon must have an aria-label that describes the icon.',
    ruleName: 'dt-consumption-icon-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtConsumptionIconVisitor,
      }),
    );
  }
}
