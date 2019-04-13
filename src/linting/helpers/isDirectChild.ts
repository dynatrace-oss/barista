import { ElementAst, EmbeddedTemplateAst } from '@angular/compiler';
import { isElementWithName } from './isElementWithName';

/**
 * Checks if the given element has a child element with the given name.
 * If directives (like *ngIf) are set, the element's child becomes an EmbeddedTemplateAst
 * and the name of the element can be found when looking at its children.
 * @param element - The parent element.
 * @param childName - The name of the child element.
 * @returns Whether the child element could be found or not.
 */
export function isDirectChild(element: ElementAst, childName: string): boolean {
  const isChild = element.children
    .some((child) => isElementWithName(child, childName));

  if (isChild) {
    return true;
  }

  return element.children.some((child) => {
    if (child instanceof EmbeddedTemplateAst) {
      return child.children.some((grandchild) => isElementWithName(grandchild, childName));
    }
    return false;
  });
}
