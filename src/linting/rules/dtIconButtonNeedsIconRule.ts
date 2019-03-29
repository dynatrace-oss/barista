import { AttrAst, ElementAst, TextAst, TemplateAst } from '@angular/compiler';
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

  // Filters TextAst elements that only contain whitespace characters.
  private _filterWhitespaceElements(element: TemplateAst): boolean {
    if (element instanceof TextAst) {
      const nonWhitespaceCharacters = element.value.match(/\S/g);
      if (nonWhitespaceCharacters !== null && nonWhitespaceCharacters.length > 1) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (!isButtonElement(element)) {
      return;
    }

    const attrs: AttrAst[] = element.attrs;
    const isIconButton = attrs.some((attr) => isIconButtonAttr(attr));

    // icon buttons must have exactly one dt-icon child element
    if (isIconButton) {
      const elementChildren = element.children.filter((child) => this._filterWhitespaceElements(child));
      if (
        elementChildren.length === 1 &&
        (elementChildren[0] instanceof ElementAst) &&
        (elementChildren[0] as ElementAst).name === 'dt-icon'
      ) {
        return;
      }

      const startOffset = element.sourceSpan.start.offset;
      const endOffset = element.sourceSpan.end.offset;
      this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-icon-button must contain one dt-icon element only. No other nested elements are allowed.');
    }
  }
}

/**
 * The dtIconButtonNeedsIconRule ensures that an icon button only contains one icon element.
 *
 * The following example passes the button lint checks:
 * <button dt-icon-button variant="secondary"><dt-icon name="agent"></dt-icon></button>
 *
 * For the following example the linter throws an error:
 * <button dt-icon-button variant="secondary"><dt-icon name="agent"></dt-icon> icon button</button>, only icon content is allowed
 * <button dt-icon-button variant="secondary">icon button</button>, icon content required
 * <button dt-icon-button variant="secondary"></button>, icon content required
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    // tslint:disable-next-line max-line-length
    description: 'Ensures that an icon button contains only one dt-icon component.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'An icon button must only contain one dt-icon component.',
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
