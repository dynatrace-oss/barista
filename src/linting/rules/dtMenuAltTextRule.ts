import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import {
  addFailure,
  hasTextContentAlternative,
  isElementWithName,
} from '../utils';

class DtMenuVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-menu')) {
      return;
    }

    if (hasTextContentAlternative(element, 'aria-label')) {
      return;
    }

    addFailure(this, element, 'A dt-menu must have an aria-label.');
  }
}

/**
 * The dtMenuAltTextRule ensures that a dt-menu always has an aria-label set.
 *
 * The following example passes the lint checks:
 * <dt-menu aria-label="Example Menu">
 *   <a dtMenuItem>Menu item</a>
 * </dt-menu>
 *
 * For the following example the linter throws errors:
 * <dt-menu>
 *   <a dtMenuItem>Menu item</a>
 * </dt-menu>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dt-menu always has an aria-label set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale: 'A dt-menu must have an aria-label that describes the menu.',
    ruleName: 'dt-menu-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtMenuVisitor,
      }),
    );
  }
}
