import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import {
  addFailure,
  hasContent,
  hasOnlyDtIconChildren,
  isElementWithName,
} from '../../utils';

class DtTileVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-tile-icon')) {
      return;
    }

    if (!hasContent(element)) {
      addFailure(
        this,
        element,
        'A dt-tile-icon must not be empty, but must contain a dt-icon element.'
      );
    }

    if (hasOnlyDtIconChildren(element)) {
      return;
    }

    addFailure(
      this,
      element,
      'A dt-tile-icon must contain dt-icon elements only. No other nested elements are allowed.'
    );
  }
}

/**
 * The dtTileIconNeedsIconRule ensures that a tile icon only contains dt-icon elements.
 *
 * The following example passes the lint checks:
 * <dt-tile-icon><dt-icon name="agent"></dt-icon></dt-tile-icon>
 *
 * For the following examples the linter throws an error:
 * <dt-tile-icon>some text</dt-tile-icon>
 * <dt-tile-icon> </dt-tile-icon>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a tile icon contains only dt-icon components.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A tile icon must only contain dt-icon components.',
    ruleName: 'dt-tile-icon-needs-icon',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtTileVisitor,
      })
    );
  }
}
