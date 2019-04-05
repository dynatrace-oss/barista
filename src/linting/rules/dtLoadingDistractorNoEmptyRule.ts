import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { hasContent } from '../helpers';

class DtLoadingDistractorVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }
  
  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (
      element.name !== 'dt-loading-distractor' ||
      hasContent(element)
    ) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-loading-distractor must always contain text. Make sure this is the case even if you use nested components to render text.');
  }
}

/**
 * The dtLoadingDistractorNoEmptyRule ensures that a dt-loading-distractor always contains content.
 *
 * The following example passes the check:
 * <dt-loading-distractor>Loading …</dt-loading-distractor>
 *
 * For the following example the linter throws an error:
 * <dt-loading-distractor> </dt-loading-distractor>
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dt-loading-distractor always contains content.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dt-loading-distractor must always contain content.',
    ruleName: 'dt-loading-distractor-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtLoadingDistractorVisitor,
      }),
    );
  }
}
