import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { addFailure, getAttribute, isElementWithName } from '../utils';

class DtMenuAndGroupVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-menu', 'dt-menu-group')) {
      return;
    }

    for (const child of element.children) {
      if (
        child instanceof ElementAst &&
        isElementWithName(child, 'button') &&
        getAttribute(child, 'disabled') !== undefined
      ) {
        addFailure(this, child, 'dt-menu-item must not be disabled.');
      }
    }
  }
}

/**
 * The dtMenuDisabledButtonsNotAllowedRule ensures that that dt-menu-items are never disabled.
 *
 * The following example passes the lint checks:
 * <dt-menu aria-label="Example Menu">
 *   <button dtMenuItem>Menu item</button>
 * </dt-menu>
 *
 * For the following example the linter throws errors:
 * <dt-menu aria-label="Example Menu">
 *   <button disabled dtMenuItem>Disabled menu item</button>
 * </dt-menu>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that dt-menu-items are never disabled.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale: 'There is no intended use case for disabled menu items.',
    ruleName: 'dt-menu-disabled-buttons-not-allowed',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtMenuAndGroupVisitor,
      }),
    );
  }
}
