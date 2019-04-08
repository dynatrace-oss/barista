import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { isDirectChild } from '../helpers';

class DtCopyToClipboardVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }
  
  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (
      element.name !== 'dt-copy-to-clipboard' ||
      isDirectChild(element, 'dt-copy-to-clipboard-label')
    ) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-copy-to-clipboard must contain a dt-copy-to-clipboard-label element, that must be a direct child.');
  }
}

/**
 * The dtCopyToClipboardNoEmptyRule ensures that the copy to clipboard component
 * always contains a dt-copy-to-clipboard-label as direct child.
 *
 * The following example passes the lint checks:
 * <dt-copy-to-clipboard>
 *   <textarea dtInput>https://defaultcopy.dynatrace.com/</textarea>
 *   <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
 * </dt-copy-to-clipboard>
 *
 * For the following example the linter throws an error:
 * <dt-copy-to-clipboard>
 *   <textarea dtInput>https://defaultcopy.dynatrace.com/</textarea>
 *   Copy
 * </dt-copy-to-clipboard>
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that the dt-copy-to-clipboard component always has a label, that is a direct child.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'The copy-to-clipboard component must always contain a dt-copy-to-clipboard-label, that is a direct child of dt-copy-to-clipboard.',
    ruleName: 'dt-copy-to-clipboard-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtCopyToClipboardVisitor,
      }),
    );
  }
}
