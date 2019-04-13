import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, hasContent, hasTextContentAlternative, isElementWithName } from '../utils';

class DtCheckboxVisitor extends BasicTemplateAstVisitor {

  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-checkbox')) {
      return;
    }

    if (
      hasContent(element) ||
      hasTextContentAlternative(element)
    ) {
      return;
    }

    addFailure(this, element, 'When a dt-checkbox does not contain any content it must have an aria-label or an aria-labelledby attribute.');
  }
}

/**
 * The dtCheckboxNoEmptyRule ensures that a checkbox always has a text or an aria-label as alternative.
 *
 * The following example passes the lint checks:
 * <dt-checkbox>Subscribe to newsletter</dt-checkbox>
 * <dt-checkbox aria-label="When checked you agree to subscribe to our newsletter."></dt-checkbox>
 *
 * For the following example the linter throws errors:
 * <dt-checkbox></dt-checkbox>
 */
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a checkbox always contains content or an aria-label as alternative.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A checkbox without content must have an aria-label or aria-labelledby attribute.',
    ruleName: 'dt-checkbox-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtCheckboxVisitor,
      })
    );
  }
}
