import { ElementAst, TemplateAst } from '@angular/compiler';

/**
 * Checks if given element is of type ElementAst and has the given name.
 *
 * @param element - The element to check
 * @param names – The name(s) to check for
 */
export function isElementWithName(
  element: TemplateAst,
  ...names: string[] // tslint:disable-line:trailing-comma
): boolean {
  return element instanceof ElementAst && names.includes(element.name);
}
