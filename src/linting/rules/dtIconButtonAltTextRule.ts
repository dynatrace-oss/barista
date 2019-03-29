import { AttrAst, BoundElementPropertyAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { isButtonElement, isIconButtonAttr } from '../helpers';

interface FailureStrings {
  [key: string]: string;
}

// tslint:disable-next-line:max-classes-per-file
class DtButtonVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  /**
   * Checks for aria-label attribute.
   * @param attrs element attributes
   * @param inputs element inputs / attribute bindings
   * @returns true if aria-label attribute or binding is set, false otherwise.
   */
  private _hasAriaLabel(attrs: AttrAst[], inputs: BoundElementPropertyAst[]): boolean {
    const hasAriaLabelAttr = attrs.some((attr) => attr.name === 'aria-label' && attr.value.trim().length > 0);
    const hasAriaLabelInput = inputs.some((input) => input.name === 'aria-label');

    return hasAriaLabelAttr || hasAriaLabelInput;
  }

  /**
   * Checks for aria-labelledby attribute.
   * @param attrs element attributes.
   * @param inputs element inputs / attribute bindings.
   * @returns true if aria-labelledby attribute or binding is set, false otherwise.
   */
  private _hasAriaLabelledby(attrs: AttrAst[], inputs: BoundElementPropertyAst[]): boolean {
    const hasAriaLabelledbyAttr = attrs.some((attr) => attr.name === 'aria-labelledby' && attr.value.trim().length > 0);
    const hasAriaLabelledbyInput = inputs.some((input) => input.name === 'aria-labelledby');
    // TODO: check reference if aria-labelledby given

    return hasAriaLabelledbyAttr || hasAriaLabelledbyInput;
  }

  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (!isButtonElement(element)) {
      return;
    }

    const attrs: AttrAst[] = element.attrs;
    const isIconButton = attrs.some((attr) => isIconButtonAttr(attr));
    if (!isIconButton) {
      return;
    }

    const inputs: BoundElementPropertyAst[] = element.inputs;
    if (this._hasAriaLabel(attrs, inputs) || this._hasAriaLabelledby(attrs, inputs)) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, Rule.FAILURE_STRINGS[element.name]);
  }
}

/**
 * The dtIconButtonAltTextRule ensures that text alternatives are given for icon buttons.
 *
 * The following example passes the lint checks:
 * <button dt-icon-button variant="nested" aria-label="Install agent"><dt-icon name="agent"></dt-icon></button>
 *
 * For the following example the linter throws errors:
 * <a dt-icon-button variant="nested"><dt-icon name="agent"></dt-icon></a>, no text alternative given
 */
export class Rule extends Rules.AbstractRule {

  static readonly ELEMENTS = ['a', 'button'];
  static readonly FAILURE_STRINGS: FailureStrings = {
    a: 'An icon-button link must have an aria-label or an aria-labelledby attribute.',
    button: 'An icon-button must have an aria-label or an aria-labelledby attribute.',
  };

  static readonly metadata: IRuleMetadata = {
    // tslint:disable-next-line max-line-length
    description: 'Ensures that text alternatives are given for icon buttons.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'Buttons without a text content need additional attributes to provide text alternatives.',
    ruleName: 'dt-icon-button-alt-text',
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
