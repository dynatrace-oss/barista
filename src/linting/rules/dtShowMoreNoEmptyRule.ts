import { AttrAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, hasContent, isButtonElement } from '../utils';

class DtShowMoreVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isButtonElement(element)) {
      return;
    }

    const attrs: AttrAst[] = element.attrs;
    const isShowMore = attrs.some(attr => attr.name === 'dt-show-more');

    if (!isShowMore) {
      return;
    }

    if (hasContent(element)) {
      return;
    }

    addFailure(
      this,
      element,
      'A dt-show-more must always contain text content.',
    );
  }
}

/**
 * The dtShowMoreNoEmpty ensures that a dt-show-more always contains content.
 *
 * The following examples pass the check:
 * <button dt-show-more ...>
 *   Show more
 * </button>
 *
 * For the following example the linter throws an error:
 * <button dt-show-more ...>
 * </button>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-show-more always contains content as a button label.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dt-show-more must always contain content as a button label.',
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
