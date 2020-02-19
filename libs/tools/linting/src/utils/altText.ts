/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AttrAst,
  BoundElementPropertyAst,
  ElementAst,
} from '@angular/compiler';
import { BasicTemplateAstVisitor, TemplateAstVisitorCtr } from 'codelyzer';

import { addFailure } from './addFailure';
import { isElementWithName } from './isElementWithName';

/**
 * Returns <code>true</code> if an input or an attribute exists. If the value
 * of an attribute only consists of whitespace, it is considered empty.
 *
 * @param attrs Element attributes
 * @param inputs Element inputs / attribute bindings
 * @param name The name of the attribute to check for
 * @param requireValue Whether the attribute must also have a non-empty value
 * @returns <code>true</code> if the input or attribute has been found
 */
function hasAttribute(
  attrs: AttrAst[],
  inputs: BoundElementPropertyAst[],
  name: string,
  requireValue: boolean = true,
): boolean {
  return (
    attrs.some(
      attr =>
        attr.name === name && (!requireValue || attr.value.trim().length > 0),
    ) || inputs.some(input => input.name === name)
  );
}

/**
 * Checks if the given element provides text alternatives in form of an
 * aria-label or aria-labelledby attribute.
 *
 * @param element The element to check.
 * @param attribute The attribute to look for (optional); aria-label and
 *   aria-labelledby when not given
 * @returns <code>true</code> if the element provides a text alternative
 */
export function hasTextContentAlternative(
  element: ElementAst,
  attribute?: string,
): boolean {
  const checkForAttribute = (name: string) =>
    hasAttribute(element.attrs, element.inputs, name);

  if (attribute === undefined) {
    return (
      checkForAttribute('aria-label') ||
      checkForAttribute('attr.aria-label') ||
      checkForAttribute('attr.aria-labelledby') ||
      checkForAttribute('aria-labelledby')
    );
  }
  return checkForAttribute(attribute);
}

/**
 * Creates a TemplateAstVisitor class that fails if the given element does have
 * the given element name and does not provide text alternatives in form of an
 * aria-label or aria-labelledby attribute.
 *
 * @param elements The name(s) of the element(s) to check for
 * @param attributes The attribute(s) to look for (optional)
 */
export function createAltTextVisitor(
  elements: string | string[],
  attributes?: string | string[],
): TemplateAstVisitorCtr {
  const matchesElement = (ast: ElementAst, elementName: string): boolean => {
    if (isElementWithName(ast, elementName)) {
      if (attributes === undefined) {
        return true;
      }

      const checkForAttribute = (name: string) =>
        hasAttribute(ast.attrs, ast.inputs, name, false);

      return Array.isArray(attributes)
        ? attributes.some(checkForAttribute)
        : checkForAttribute(attributes);
    }
    return false;
  };
  const matches = (ast: ElementAst): boolean =>
    Array.isArray(elements)
      ? elements.some(elementName => matchesElement(ast, elementName))
      : matchesElement(ast, elements);
  const failureMessage = () => {
    let componentName;

    // tslint:disable-next-line:prefer-conditional-expression
    if (attributes !== undefined) {
      componentName = Array.isArray(attributes) ? attributes[0] : attributes;
    } else {
      componentName = Array.isArray(elements) ? elements[0] : elements;
    }
    return `A ${componentName} must either have an aria-label or an aria-labelledby attribute.`;
  };

  return class AltTextVisitor extends BasicTemplateAstVisitor {
    visitElement(ast: ElementAst, context: any): void {
      if (matches(ast) && !hasTextContentAlternative(ast)) {
        addFailure(this, ast, failureMessage());
      }
      super.visitElement(ast, context);
    }
  };
}
