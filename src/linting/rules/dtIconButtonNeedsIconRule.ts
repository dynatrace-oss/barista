import { AttrAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { isIconButtonAttr, isButtonElement } from '../helpers';

class DtButtonVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (!isButtonElement(element)) {
      return;
    }

    const attrs: AttrAst[] = element.attrs;
    const isIconButton = attrs.some((attr) => isIconButtonAttr(attr));

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;

    // icon buttons must have a dt-icon child element
    if (isIconButton) {
      const elementAstChildren = element.children.filter((child) => child instanceof ElementAst) as ElementAst[];
      if (!elementAstChildren.some((child) => child.name === 'dt-icon')) {
        // tslint:disable-next-line max-line-length
        this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-icon-button must always contain a dt-icon element.');
      }
    }

  }
}

/**
 * The dtIconButtonNeedsIconRule ensures that an icon button always contains an icon.
 *
 * The following example passes the button lint checks:
 * <button dt-icon-button variant="secondary"><dt-icon name="agent"></dt-icon></button>
 *
 * For the following example the linter throws an error:
 * <button dt-icon-button variant="secondary">icon button</button>, icon content required
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    // tslint:disable-next-line max-line-length
    description: 'Ensures that an icon button contains only a dt-icon component.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'An icon button must only contain a dt-icon component.',
    ruleName: 'dt-icon-button-needs-icon',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtButtonVisitor,
      }),
    );
  }
}
