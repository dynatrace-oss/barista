import { AttrAst, BoundElementPropertyAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { hasAriaLabel, hasAriaLabelledby } from '../helpers';

// tslint:disable-next-line:max-classes-per-file
class DtRadioButtonVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (element.name !== 'dt-radio-button') {
      return;
    }

    // Children can be anything, i.e. a text node or another element that renders text,
    // so we can only check the existence of children in general.
    if (element.children && element.children.length > 0) {
      return;
    }

    // If the checkbox element does not have any children, check if there is
    // an aria-label or an aria-labelledby attribute.
    const attrs: AttrAst[] = element.attrs;
    const inputs: BoundElementPropertyAst[] = element.inputs;
    if (hasAriaLabel(attrs, inputs) || hasAriaLabelledby(attrs, inputs)) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, 'When a dt-radio-button does not contain any content it must have an aria-label or an aria-labelledby attribute.');
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
    // tslint:disable-next-line max-line-length
    description: 'Ensures that a radio button always contains content or an aria-label as alternative.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A radio button without content must have an aria-label or aria-labelledby attribute.',
    ruleName: 'dt-radio-button-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtRadioButtonVisitor,
      }),
    );
  }
}
