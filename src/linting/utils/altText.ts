import {
  AttrAst,
  BoundElementPropertyAst,
  ElementAst,
} from '@angular/compiler';
import { BasicTemplateAstVisitor, TemplateAstVisitorCtr } from 'codelyzer';

import { addFailure } from './addFailure';
import { isElementWithName } from './isElementWithName';

/**
 * Checks for attribute or bindings with given name.
 *
 * @param attrs element attributes.
 * @param inputs element inputs / attribute bindings.
 * @returns true if aria-labelledby attribute or binding is set, false otherwise.
 */
function hasAttributeValue(
  name: string,
  attrs: AttrAst[],
  inputs: BoundElementPropertyAst[],
): boolean {
  const hasAttr = attrs.some(
    attr => attr.name === name && attr.value.trim().length > 0,
  );
  const hasInput = inputs.some(input => input.name === name);
  // TODO: check reference if aria-labelledby given?

  return hasAttr || hasInput;
}

/**
 * Checks if the given element provides text alternatives in form of an aria-label
 * or aria-labelledby attribute.
 *
 * @param element the element to check.
 * @param attribute the attribute to look for (optional); aria-label and aria-labelledby when not given
 * @returns whether a text alternative is given.
 */
export function hasTextContentAlternative(
  element: ElementAst,
  attribute?: string, // TODO ChMa: remove this parameter and always assume the latter
): boolean {
  const attrs: AttrAst[] = element.attrs;
  const inputs: BoundElementPropertyAst[] = element.inputs;

  if (attribute === undefined) {
    return (
      hasAttributeValue('aria-label', attrs, inputs) ||
      hasAttributeValue('aria-labelledby', attrs, inputs)
    );
  }

  return hasAttributeValue(attribute, attrs, inputs);
}

/**
 * Creates a TemplateAstVisitor class that fails if the given element does have
 * the given element name and does not provide text alternatives in form of an
 * aria-label or aria-labelledby attribute.
 *
 * @param elementName The name of the element to check
 * @param attribute The attribute to look for (optional); aria-label and aria-labelledby when not specified TODO ChMa: remove this parameter and always assume the latter
 */
export function createAltTextVisitor(
  elementName: string,
  attribute?: string, // TODO ChMa: remove this parameter and always assume the latter
): TemplateAstVisitorCtr {
  return class AltTextVisitor extends BasicTemplateAstVisitor {
    visitElement(element: ElementAst, context: any): void {
      if (
        isElementWithName(element, elementName) &&
        !hasTextContentAlternative(element, attribute)
      ) {
        const errorMessage =
          attribute !== undefined
            ? `A ${elementName} must have an ${attribute} attribute.`
            : `A ${elementName} must either have an aria-label or an aria-labelledby attribute.`;

        addFailure(this, element, errorMessage);
      }

      super.visitElement(element, context);
    }
  };
}
