import { AttrAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, isIconButtonAttr, isButtonElement } from '../../utils';

class DtButtonVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isButtonElement(element)) {
      return;
    }

    const attrs: AttrAst[] = element.attrs;
    const isNestedVariant = attrs.some(
      attr => attr.name === 'variant' && attr.value === 'nested'
    );
    const isIconButton = attrs.some(attr => isIconButtonAttr(attr));

    // dt-icon-button attribute required for nested buttons
    if (isNestedVariant && !isIconButton) {
      addFailure(
        this,
        element,
        'A nested button variant must always be a dt-icon-button.'
      );
    }
  }
}

/**
 * The dtNestedButtonIsIconButtonRule ensures that a nested button is always an icon-button.
 *
 * The following example passes the button lint checks:
 * <button dt-icon-button variant="nested"><dt-icon name="agent"></dt-icon></button>
 *
 * For the following example the linter throws errors:
 * <button dt-button variant="nested">...</button>, dt-icon-button attribute required
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a nested button is always an icon button.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A nested button must always be an icon button.',
    ruleName: 'dt-nested-button-is-icon-button',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtButtonVisitor,
      })
    );
  }
}
