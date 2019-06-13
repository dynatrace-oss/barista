import { ElementAst, AttrAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, hasTextContentAlternative } from '../utils';

class DtInlineEditorVisitor extends BasicTemplateAstVisitor {

  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    const attrs: AttrAst[] = element.attrs;
    const isInlineEditor = attrs.some((attr) => attr.name === 'dt-inline-editor');
    if (!isInlineEditor) {
      return;
    }

    if (
      hasTextContentAlternative(element, 'aria-label-save') &&
      hasTextContentAlternative(element, 'aria-label-cancel')
    ) {
      return;
    }

    addFailure(this, element, 'An inline editor must provide alternative texts for the save and the cancel button.');
  }
}

/**
 * The dtInlineEditorAltTextRule ensures that text alternatives are given for the
 * save and cancel button of the inline editor.
 *
 * The following example passes the lint checks:
 * <em dt-inline-editor
 *   [(ngModel)]="sampleModel"
 *   aria-label-save="Save text"
 *   aria-label-cancel="Cancel and discard changes">
 * </em>
 * <span>model: <code>{{ sampleModel }}</code></span>
 *
 * For the following example the linter throws errors:
 * <em dt-inline-editor
 *   [(ngModel)]="sampleModel">
 * </em>
 * <span>model: <code>{{ sampleModel }}</code></span>
 */
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that text alternatives are given for the save and cancel button of the inline editor.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'The save and cancel button of the inline editor need additional attributes to provide text alternatives.',
    ruleName: 'dt-inline-editor-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtInlineEditorVisitor,
      })
    );
  }
}
