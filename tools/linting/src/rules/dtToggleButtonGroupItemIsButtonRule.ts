import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { addFailure, isElementWithName } from '../utils';

class DtToggleButtonGroupVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!element.attrs) {
      return;
    }

    const isToggleButtonItem = element.attrs.some(
      attr => attr.name === 'dt-toggle-button-item',
    );
    if (!isToggleButtonItem) {
      return;
    }

    if (isElementWithName(element, 'button')) {
      return;
    }

    addFailure(
      this,
      element,
      'A toggle button group item must always be a button.',
    );
  }
}

/**
 * The dtToggleButtonGroupItemButton ensures that a toggle button group item is always a btuton.
 *
 * The following examples pass the lint checks:
 * <button dt-toggle-button-item value="1">
 *   // ...
 * </button>
 *
 * For the following example the linter throws an error:
 * <a dt-toggle-button-item value="1">
 *   // ...
 * </a>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a toggle button group item is always a button.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A toggle button group item must always be a button.',
    ruleName: 'dt-toggle-button-group-item-is-button',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtToggleButtonGroupVisitor,
      }),
    );
  }
}
