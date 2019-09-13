import {
  AttrAst,
  BoundElementPropertyAst,
  ElementAst,
} from '@angular/compiler';
import { BasicTemplateAstVisitor, TemplateAstVisitorCtr } from 'codelyzer';
import { isArray } from 'rxjs/internal-compatibility';

import { addFailure } from './addFailure';
import { isElementWithName } from './isElementWithName';

/**
 * Checks for attribute or bindings with given name.
 *
 * @param name The attribute name
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
  attribute?: string,
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
 * @param element The name of the element to check
 * @param attribute The attributes to look for (optional); aria-label and aria-labelledby when not specified
 */
export function createAltTextVisitor(
  element: string | string[],
  attribute?: string | string[],
): TemplateAstVisitorCtr {
  const matchesElement = (ast: ElementAst, elementName: string): boolean => {
    if (isElementWithName(ast, elementName)) {
      if (attribute === undefined) {
        return true;
      }
      if (isArray(attribute)) {
        return attribute.some(attr =>
          hasAttributeValue(attr, ast.attrs, ast.inputs),
        );
      }
      return hasAttributeValue(attribute, ast.attrs, ast.inputs);
    }
    return false;
  };
  const matches = (ast: ElementAst): boolean => {
    return isArray(element)
      ? element.some(el => matchesElement(ast, el))
      : matchesElement(ast, element);
  };
  const failureMessage = () => {
    let componentName;

    if (attribute !== undefined) {
      componentName = isArray(attribute) ? attribute[0] : attribute;
    } else {
      componentName = isArray(element) ? element[0] : element;
    }

    return `A ${componentName} must either have an aria-label or an aria-labelledby attribute.`;
  };

  return class AltTextVisitor extends BasicTemplateAstVisitor {
    visitElement(ast: ElementAst, context: any): void {
      if (matches(ast) && !hasTextContentAlternative(ast)) {
        // console.log(`Incorrect element detected: ${failureMessage()}`);

        addFailure(this, ast, failureMessage());
      }
      super.visitElement(ast, context);
    }
  };
}
