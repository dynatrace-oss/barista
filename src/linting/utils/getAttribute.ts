import { AttrAst, ElementAst } from '@angular/compiler';

/**
 * Get the element's attribute with given name.
 * @param element - the current element.
 * @param attribute - attribute name.
 * @returns The attribute with given name or undefined when attribute is not found.
 */
export function getAttribute(element: ElementAst, attribute: string): AttrAst | undefined {
  return element.attrs.find((attr) => attr.name === attribute);
}
