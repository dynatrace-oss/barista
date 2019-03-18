import { AttrAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

class DtButtonVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this.validateElement(element);
    super.visitElement(element, context);
  }

  private readonly isIconButtonAttr = (attr: AttrAst) => attr.name === 'dt-icon-button';
  private readonly isButtonAttr = (attr: AttrAst) => attr.name === 'dt-button';

  private isButtonElement(element: ElementAst): boolean {
    const elementName = element.name;
    if (elementName !== 'button' && elementName !== 'a') {
      return false;
    }

    if (elementName === 'a' &&
      !element.attrs.some((attr) => (this.isButtonAttr(attr) || this.isIconButtonAttr(attr)))) {
      return false;
    }

    return true;
  }

  // tslint:disable-next-line no-any
  private validateElement(element: ElementAst): any {
    if (!this.isButtonElement(element)) {
      return;
    }

    const attrs: AttrAst[] = element.attrs;
    const isNestedVariant = attrs.some((attr) => attr.name === 'variant' && attr.value === 'nested');
    const isIconButton = attrs.some((attr) => this.isIconButtonAttr(attr));
    const isButton = attrs.some((attr) => this.isButtonAttr(attr));

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;

    // dt-icon-button attribute required for nested buttons
    if (isNestedVariant && !isIconButton) {
      this.addFailureFromStartToEnd(startOffset, endOffset, 'The dt-icon-button attribute is required for nested buttons.');
    }

    // icon buttons must have a dt-icon child element
    if (isIconButton) {
      const elementAstChildren = element.children.filter((child) => child instanceof ElementAst) as ElementAst[];
      if (!elementAstChildren.some((child) => child.name === 'dt-icon')) {
        // tslint:disable-next-line max-line-length
        this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-icon-button must always contain a dt-icon element.');
      }
    }

    if (isButton) {
      if (element.children.length < 1) {
        // tslint:disable-next-line max-line-length
        this.addFailureFromStartToEnd(startOffset, endOffset, 'A dt-button must always contain text. Make sure that this is the case even if you use nested components to render text.');
      }
    }
  }
}

/**
 * The dtButtonRule ensures that a button is used correctly.
 *
 * The following examples pass the button lint checks:
 * <button dt-icon-button variant="nested"><dt-icon name="agent"></dt-icon></button>
 * <button dt-button>Button text</button>
 *
 * For the following examples the linter throws errors:
 * <button dt-button variant="nested">...</button>, dt-icon-button attribute required
 * <button dt-icon-button variant="nested">icon button</button>, icon content required
 * <button dt-button></button>, text required
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    // tslint:disable-next-line max-line-length
    description: 'Ensures that a button is used correctly.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A button must use the correct combination of attributes and nested icons/text.',
    ruleName: 'dt-button',
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
