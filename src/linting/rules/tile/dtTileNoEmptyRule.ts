import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import {
  addFailure,
  hasContentApartFrom,
  isElementWithName,
} from '../../utils';

class DtTileVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-tile')) {
      return;
    }

    const tileChildren = ['dt-tile-icon', 'dt-tile-title', 'dt-tile-subtitle'];

    if (hasContentApartFrom(element, tileChildren)) {
      return;
    }

    addFailure(
      this,
      element,
      'A dt-tile must always contain content apart from title, subtitle and icon.',
    );
  }
}

/**
 * The dtCardNoEmptyRule ensures that a dt-tile always contains content
 * apart from a title, subtitle and an icon.
 *
 * The following example passes the check:
 * <dt-tile>
 *   <dt-tile-icon><dt-icon name="agent"></dt-icon></dt-tile-icon>
 *   <dt-tile-title>L-W8-64-APMDay3</dt-tile-title>
 *   <dt-tile-subtitle>Linux (x84, 64-bit)</dt-tile-subtitle>
 *   Network traffic
 * </dt-tile>
 *
 * For the following example the linter throws an error:
 * <dt-tile>
 *   <dt-tile-icon><dt-icon name="agent"></dt-icon></dt-tile-icon>
 *   <dt-tile-title>L-W8-64-APMDay3</dt-tile-title>
 *   <dt-tile-subtitle>Linux (x84, 64-bit)</dt-tile-subtitle>
 * </dt-tile>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-tile always contains content apart from title, subtitle and icon.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-tile must always contain content apart from title, subtitle and icon.',
    ruleName: 'dt-tile-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtTileVisitor,
      }),
    );
  }
}
