import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { hasContentApartFrom, hasTextContentAlternative } from '../helpers';

class DtShowMoreVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }
  
  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (element.name !== 'dt-show-more') {
      return;
    }

    const showMoreChildren = [
      'dt-show-less-label'
    ];

    if (
      hasContentApartFrom(element, showMoreChildren) ||
      hasTextContentAlternative(element)
    ) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-show-more must always contain text or an aria-label/aria-labelledby attribute.');
  }
}

/**
 * The dtShowMoreNoEmpty ensures that a dt-show-more always contains content.
 *
 * The following examples pass the check:
 * <dt-show-more ...>
 *   Show more
 *   <dt-show-less-label>Show less</dt-show-less-label>
 * </dt-show-more>
 * <dt-show-more ... aria-label="Show more data"></dt-show-more>
 *
 * For the following example the linter throws an error:
 * <dt-show-more ...>
 *   <dt-show-less-label>Show less</dt-show-less-label>
 * </dt-show-more>
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dt-show-more always contains content or a text alternative.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dt-show-more must always contain content apart from the dt-show-less-label or a text alternative.',
    ruleName: 'dt-show-more-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtShowMoreVisitor,
      }),
    );
  }
}
