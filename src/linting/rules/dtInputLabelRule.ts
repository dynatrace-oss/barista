import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure,
  addParentElement,
  getAttribute,
  hasFormFieldParentWithLabel,
  hasTextContentAlternative,
  isElementWithName,
  ParentElement,
} from '../utils';

class DtFormControlVisitor extends BasicTemplateAstVisitor {

  formFields: ParentElement[] = [];

  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    // If the element is a form field, remember it.
    if (isElementWithName(element, 'dt-form-field')) {
      this.formFields = addParentElement(element, this.formFields);
    }

    if (getAttribute(element, 'dtInput') === undefined) {
      return;
    }

    // If the input has a form field parent element with a label, return.
    if (hasFormFieldParentWithLabel(element, this.formFields)) {
      return;
    }

    // If the input has no form field wrapper or a wrapper without label check for an aria-label.
    if (hasTextContentAlternative(element)) {
      return;
    }

    addFailure(this, element, 'A dtInput requires a wrapping form field with a dt-label or an aria-label or aria-labelledby attribute.');
  }
}

/**
 * The dtInputLabelRule ensures that a label or text alternatives are given for a dtInput.
 *
 * The following example passes the lint checks:

 *
 * For the following example the linter throws errors:

 */
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a label or text alternatives are given for a dtInput.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dtInput must have a label when used with the form field component or an aria-label or aria-labelledby attribute.',
    ruleName: 'dt-input-label',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtFormControlVisitor,
      })
    );
  }
}
