import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import {
  addFailure,
  getParentElement,
  hasFormFieldParentWithLabel,
  hasTextContentAlternative,
  isElementWithName,
  ParentElement,
} from '../utils';

class DtSelectVisitor extends BasicTemplateAstVisitor {
  formFields: ParentElement[] = [];

  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    // If the element is a form field, remember it.
    if (isElementWithName(element, 'dt-form-field')) {
      const parentElement = getParentElement(element, element.name);
      if (parentElement === undefined) {
        return;
      }
      this.formFields.push(parentElement);
      // Sort by start line for later checks.
      if (this.formFields.length > 1) {
        this.formFields.sort((a, b) => a.startLine - b.startLine);
      }
      return;
    }

    if (!isElementWithName(element, 'dt-select')) {
      return;
    }

    // If the select has a form field parent element with a label, return.
    if (hasFormFieldParentWithLabel(element, this.formFields)) {
      return;
    }

    // If the select has no form field wrapper or a wrapper without label check for an aria-label.
    if (hasTextContentAlternative(element)) {
      return;
    }

    addFailure(
      this,
      element,
      'A dt-select requires a wrapping form field with a dt-label or an aria-label or aria-labelledby attribute.'
    );
  }
}

/**
 * The dtSelectRequiresLabelRule ensures that a label or text alternatives are given for a dt-select.
 *
 * The following example passes the lint checks:
 * <dt-select placeholder="Choose your coffee" aria-label="Choose your coffee">
 *   <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
 *   <dt-option value="Affogato">Affogato</dt-option>
 * // ...
 * </dt-select>
 *
 * <dt-form-field>
 *   <dt-label>Your Coffee:</dt-label>
 *   <dt-select placeholder="Choose your coffee" required [(ngModel)]="selectedValue">
 *     <dt-option>No Coffee (Triggers an error)</dt-option>
 *     <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
 *     <dt-option value="Affogato">Affogato</dt-option>
 *     <dt-option value="Americano">Americano</dt-option>
 *   </dt-select>
 *  </dt-form-field>
 *
 * For the following example the linter throws errors:
 * <dt-select placeholder="Choose your coffee">
 *   <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
 *   <dt-option value="Affogato">Affogato</dt-option>
 * // ...
 * </dt-select>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a label or text alternatives are given for a dt-select.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-select must have a label when used with the form field component or an aria-label or aria-labelledby attribute.',
    ruleName: 'dt-select-requires-label',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtSelectVisitor,
      })
    );
  }
}
