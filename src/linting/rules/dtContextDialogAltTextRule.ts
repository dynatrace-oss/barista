import { ElementAst, ASTWithSource } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import {
  addFailure,
  hasTextContentAlternative,
  isElementWithName,
} from '../utils';

class DtContextDialogVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _isCustomTrigger(element: ElementAst): boolean {
    const customTrigger = element.inputs.find(
      el => el.name === 'dtContextDialogTrigger'
    );

    if (
      customTrigger &&
      customTrigger.value &&
      customTrigger.value instanceof ASTWithSource
    ) {
      return true;
    }
    return false;
  }

  private _validateElement(element: ElementAst): any {
    if (this._isCustomTrigger(element)) {
      if (hasTextContentAlternative(element)) {
        return;
      } else {
        addFailure(
          this,
          element,
          'A context dialog trigger must have an aria-label or aria-labelledby attribute.'
        );
      }
    }

    if (isElementWithName(element, 'dt-context-dialog')) {
      if (
        hasTextContentAlternative(element, 'aria-label') &&
        hasTextContentAlternative(element, 'aria-label-close-button')
      ) {
        return;
      }

      addFailure(
        this,
        element,
        'A context dialog must provide alternative texts for the open and the close buttons. Use the aria-label and the aria-label-close-button input.'
      );
    }
  }
}

/**
 * The dtContextDialogAltTextRule ensures that text alternatives are given for
 * the open and the close button of a context dialog.
 *
 * The following example passes the lint checks:
 * <dt-context-dialog aria-label="Open more options" aria-label-close-button="Close context dialog">
 *   <p>Your dashboard "real user monitoring" is only visible to you</p>
 * </dt-context-dialog>
 *
 * For the following example the linter throws errors:
 * <dt-context-dialog>
 *   <p>Your dashboard "real user monitoring" is only visible to you</p>
 * </dt-context-dialog>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      "Ensures that text alternatives are given for the context dialog's open and close buttons.",
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'The open and the close button need additional attributes to provide text alternatives.',
    ruleName: 'dt-context-dialog-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtContextDialogVisitor,
      })
    );
  }
}
