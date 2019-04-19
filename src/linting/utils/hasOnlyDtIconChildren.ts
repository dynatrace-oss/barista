import { ElementAst, EmbeddedTemplateAst, TemplateAst, TextAst } from '@angular/compiler';
import { isElementWithName } from './isElementWithName';
import { hasTextContent } from './hasContent';

// Filters TextAst elements that only contain whitespace characters.
function filterWhitespaceElements(element: TemplateAst): boolean {
  if (element instanceof TextAst) {
    return hasTextContent(element);
  }
  return true;
}

export function hasOnlyDtIconChildren(element: ElementAst) {
  return element.children
    .filter((child) => filterWhitespaceElements(child))
    .every((child) => {
      if (isElementWithName(child, 'dt-icon')) {
        return true;
      }

      if (child instanceof EmbeddedTemplateAst) {
        return child.children
          .every((grandchild) => isElementWithName(grandchild, 'dt-icon'));
      }

      return false;
    });
}
