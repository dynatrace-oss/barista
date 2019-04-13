import { ElementAst, TemplateAst } from '@angular/compiler';

/**
 * Checks if given element is of type ElementAst and has the given name.
 * @param element - The element to check.
 * @param name – The name to check for.
 */
export function isElementWithName(element: TemplateAst, name: string): boolean {
  return element instanceof ElementAst && element.name === name;
}
