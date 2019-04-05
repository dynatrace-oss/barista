import { AttrAst, BoundElementPropertyAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { hasAriaLabel, hasAriaLabelledby, hasChildren } from '../helpers';

// tslint:disable-next-line:max-classes-per-file
class DtCheckboxVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (element.name !== 'dt-checkbox') {
      return;
    }

    // Children can be anything, i.e. a text node or another element that renders text,
    // so we can only check the existence of children in general.
    if (hasChildren(element)) {
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
    this.addFailureFromStartToEnd(startOffset, endOffset, 'When a dt-checkbox does not contain any content it must have an aria-label or an aria-labelledby attribute.');
  }
}

/**
 * The dtCheckboxAltTextRule ensures that a checkbox always has a text or an aria-label as alternative.
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
    // tslint:disable-next-line max-line-length
    description: 'Ensures that a checkbox always contains content or an aria-label as alternative.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A checkbox without content must have an aria-label or aria-labelledby attribute.',
    ruleName: 'dt-checkbox-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtCheckboxVisitor,
      }),
    );
  }
}
