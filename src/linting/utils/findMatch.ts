import { ElementAst } from '@angular/compiler';
import { ParentElement } from './interfaces';

export function findMatch(parent: ParentElement, element: ElementAst): ElementAst | undefined {
  return parent.children.find((child) => {
    // There may be a better solution for comparing objects, but it works in this case.
    const childObj = JSON.stringify(child);
    const elementObj = JSON.stringify(element);
    if (childObj === elementObj) {
      return true;
    }
    return false;
  });
}

export function addParentElement(element: ElementAst, parents: ParentElement[]): ParentElement[] {
  const startLine = element.sourceSpan.start.line;
  const elementChildren = element.children.filter((child) => child instanceof ElementAst);
  if (elementChildren.length) {
    parents.push({
      name: element.name,
      startLine,
      children: elementChildren as ElementAst[],
    });
    // Sort by start line for later checks.
    if (parents.length > 1) {
      parents.sort((a, b) => a.startLine - b.startLine);
    }
  }

  return parents;
}

export function hasFormFieldParentWithLabel(element: ElementAst, parents: ParentElement[]): boolean {
  // Check if there is a form field that starts before the input.
  const inputStartLine = element.sourceSpan.start.line;
  let matchingFormField;
  parents.forEach((formField) => {
    if (formField.startLine <= inputStartLine) {
      matchingFormField = formField;
    }
  });

  // If the input has a form field wrapper, check if this one has a dt-label.
  if (matchingFormField) {
    const match = findMatch(matchingFormField, element);
    if (match) {
      const hasDtLabel = (matchingFormField as ParentElement).children.find((child) => child.name === 'dt-label');
      if (hasDtLabel) {
        return true;
      }
    }
  }

  return false;
}
