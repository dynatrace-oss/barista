import {
  ElementAst,
  EmbeddedTemplateAst,
  TemplateAst,
  TextAst,
} from '@angular/compiler';
import { isElementWithName } from './isElementWithName';
import { hasTextContent } from './hasContent';

/**
 * Filters whitespace text elements.
 * @param element - the current element.
 * @returns false if the element is a text node and contains only whitespace characters.
 */
function filterWhitespaceElements(element: TemplateAst): boolean {
  if (element instanceof TextAst) {
    return hasTextContent(element);
  }
  return true;
}

/**
 * Checks if all child nodes are dt-icon elements.
 * @param element - the current element.
 * @returns whether the element contains only dt-icon elements.
 */
export function hasOnlyDtIconChildren(element: ElementAst): boolean {
  return element.children
    .filter(child => filterWhitespaceElements(child))
    .every(child => {
      if (isElementWithName(child, 'dt-icon')) {
        return true;
      }

      if (child instanceof EmbeddedTemplateAst) {
        return child.children.every(grandchild =>
          isElementWithName(grandchild, 'dt-icon'),
        );
      }

      return false;
    });
}
