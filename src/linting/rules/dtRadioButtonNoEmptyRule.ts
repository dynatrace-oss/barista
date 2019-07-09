import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import {
  addFailure,
  hasContent,
  hasTextContentAlternative,
  isElementWithName,
} from '../utils';

class DtRadioButtonVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-radio-button')) {
      return;
    }

    if (hasContent(element) || hasTextContentAlternative(element)) {
      return;
    }

    addFailure(
      this,
      element,
      'When a dt-radio-button does not contain any content it must have an aria-label or an aria-labelledby attribute.'
    );
  }
}

/**
 * The dtRadioButtonAltTextRule ensures that a radio button always has a text or an aria-label as alternative.
 *
 * The following example passes the lint checks:
 * <dt-radio-button value="aberfeldy">Aberfeldy</dt-radio-button>
 * <dt-radio-button value="aberfeldy" aria-label="Aberfeldy"></dt-radio-button>
 *
 * For the following example the linter throws errors:
 * <dt-radio-button></dt-radio-button>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a radio button always contains content or an aria-label as alternative.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'A radio button without content must have an aria-label or aria-labelledby attribute.',
    ruleName: 'dt-radio-button-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtRadioButtonVisitor,
      })
    );
  }
}
