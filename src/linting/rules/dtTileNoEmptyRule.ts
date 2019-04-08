import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { hasContentApartFrom } from '../helpers';

class DtTileVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }
  
  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (element.name !== 'dt-tile') {
      return;
    }

    const tileChildren = [
      'dt-tile-icon',
      'dt-tile-title',
      'dt-tile-subtitle',
    ];

    if (hasContentApartFrom(element, tileChildren)) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-tile must always contain content apart from title, subtitle and icon.');
  }
}

/**
 * The dtCardNoEmptyRule ensures that a dt-tile always contains content
 * apart from a title, subtitle, actions etc.
 *
 * The following example passes the check:
 * <dt-tile>
 *   <dt-tile-title>L-W8-64-APMDay3</dt-tile-title>
 *   <dt-tile-subtitle>Linux (x84, 64-bit)</dt-tile-subtitle>
 *   Network traffic
 * </dt-tile>
 *
 * For the following example the linter throws an error:
 * <dt-tile>
 *   <dt-tile-title>L-W8-64-APMDay3</dt-tile-title>
 *   <dt-tile-subtitle>Linux (x84, 64-bit)</dt-tile-subtitle>
 * </dt-tile>
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dt-tile always contains content apart from title, subtitle and icon.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dt-tile must always contain content apart from title, subtitle and icon.',
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
