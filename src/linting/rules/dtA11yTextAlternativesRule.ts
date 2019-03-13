import { AttrAst, BoundElementPropertyAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

interface FailureStrings {
  [key: string]: string;
}

/**
 * The dtA11yTextAlternativesRule ensures that text alternatives are given when needed.
 *
 * The following examples pass the a11y lint checks:
 * <button dt-icon-button variant="nested" aria-label="Install agent"><dt-icon name="agent"></dt-icon></button>
 *
 * For the following examples the linter throws errors:
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
    description: 'Ensures that text alternatives are given for elements that require alt, aria-label or aria-labelledby attributes.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'Elements without a text content need additional attributes to provide text alternatives.',
    ruleName: 'dt-a11y-text-alternatives',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtA11yTextAlternativesVisitor, // tslint:disable-line no-use-before-declare
      }),
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class DtA11yTextAlternativesVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this.validateElement(element);
    super.visitElement(element, context);
  }

  /**
   * Checks for aria-label attribute.
   * @param attrs element attributes
   * @param inputs element inputs / attribute bindings
   * @returns true if aria-label attribute or binding is set, false otherwise.
   */
  private hasAriaLabel(attrs: AttrAst[], inputs: BoundElementPropertyAst[]): boolean {
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
  private hasAriaLabelledby(attrs: AttrAst[], inputs: BoundElementPropertyAst[]): boolean {
    const hasAriaLabelledbyAttr = attrs.some((attr) => attr.name === 'aria-labelledby' && attr.value.trim().length > 0);
    const hasAriaLabelledbyInput = inputs.some((input) => input.name === 'aria-labelledby');
    // TODO: check reference if aria-labelledby given

    return hasAriaLabelledbyAttr || hasAriaLabelledbyInput;
  }

  /**
   * Checks if button has text alternatives when required.
   * @param element button or link element.
   * @returns True if button is valid, false otherwise.
   */
  private isButtonValid(element: ElementAst): boolean {
    const attrs: AttrAst[] = element.attrs;
    const inputs: BoundElementPropertyAst[] = element.inputs;

    const isIconButton = attrs.some((attr) => attr.name === 'dt-icon-button');
    if (!isIconButton) {
      return true;
    }

    if (this.hasAriaLabel(attrs, inputs) || this.hasAriaLabelledby(attrs, inputs)) {
      return true;
    }

    return false;
  }

  private isElementValid(element: ElementAst): boolean {
    switch (element.name) {
      case 'button':
      case 'a':
        return this.isButtonValid(element);
      default:
        return true;
    }
  }

  // tslint:disable-next-line no-any
  private validateElement(element: ElementAst): any {
    const elementName = element.name;
    if (Rule.ELEMENTS.indexOf(elementName) === -1) {
      return;
    }

    if (this.isElementValid(element)) {
      return;
    }

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;

    this.addFailureFromStartToEnd(startOffset, endOffset, Rule.FAILURE_STRINGS[elementName]);
  }
}
