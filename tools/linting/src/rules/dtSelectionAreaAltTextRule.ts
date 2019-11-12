import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import {
  addFailure,
  hasTextContentAlternative,
  isElementWithName,
} from '../utils';

class DtSelectionAreaVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-selection-area')) {
      return;
    }

    if (
      hasTextContentAlternative(element, 'aria-label-selected-area') &&
      hasTextContentAlternative(element, 'aria-label-left-handle') &&
      hasTextContentAlternative(element, 'aria-label-right-handle') &&
      hasTextContentAlternative(element, 'aria-label-close-button')
    ) {
      return;
    }

    addFailure(
      this,
      element,
      'A selection area must provide alternative texts for both handles, the selected area and the close button.',
    );
  }
}

/**
 * The dtSelectionAreaAltTextRule ensures that text alternatives are given for the
 * selection area's handles, close button and area.
 *
 * The following example passes the lint checks:
 * <dt-selection-area #area="dtSelectionArea"
 *   (changed)="handleChange($event)"
 *   aria-label-selected-area="Text that describes the content of the selection area."
 *   aria-label-left-handle="Resize selection area to the left."
 *   aria-label-right-handle="Resize selection area to the right."
 *   aria-label-close-button="Close the selection area."
 * >
 *   // selection area content
 * </dt-selection-area>
 *
 * For the following example the linter throws errors:
 * <dt-selection-area #area="dtSelectionArea" (changed)="handleChange($event)">
 *   // selection area content
 * </dt-selection-area>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that text alternatives are given for handles, the close button and the area of the selection area.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'Handles, the close button and the area of the selection area need additional attributes to provide text alternatives.',
    ruleName: 'dt-selection-area-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtSelectionAreaVisitor,
      }),
    );
  }
}
