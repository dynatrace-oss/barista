import { ElementAst, TextAst } from '@angular/compiler';
import { hasTextContent } from './hasTextContent';

/**
 * Check if the element has any content. If children only contain text nodes
 * that only contain whitespace characters, this does not count as content.
 * @param element - The element to check.
 * @returns Whether the given element contains any content.
 */
export function hasContent(element: ElementAst): boolean {
  if (!element.children) {
    return false;
  }

  return element.children.some((child) => {
    if (child instanceof TextAst) {
      return hasTextContent(child);
    }
    return true;
  })
}
