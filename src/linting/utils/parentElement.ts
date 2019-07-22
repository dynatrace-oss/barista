import { ElementAst } from '@angular/compiler';
import { isEqual } from 'lodash';

export interface ParentElement {
  name: string;
  startLine: number;
  children: ElementAst[];
}

/**
 * Checks if the given element is a child of the given parent.
 * @param parent - the parent element
 * @param element - the current element
 */
function findMatch(
  parent: ParentElement,
  element: ElementAst,
): ElementAst | undefined {
  return parent.children.find(child => {
    if (isEqual(child, element)) {
      return true;
    }
    return false;
  });
}

/**
 * Adds the given element to the array of parent elements, selected by name.
 * The children array is additionally filtered when the name of the child elements is given.
 * @param element - the current element
 * @param parentName - name of the parent element
 * @param childName - name of the children elements that should be added to the parent's children
 * @returns a new parent element or undefined
 */
export function getParentElement(
  element: ElementAst,
  parentName: string,
  childName?: string,
): ParentElement | undefined {
  const startLine = element.sourceSpan.start.line;
  const elementChildren = element.children
    .filter(child => child instanceof ElementAst)
    // Return only children with name when given.
    .filter(child =>
      childName ? (child as ElementAst).name === childName : true,
    );
  if (elementChildren.length < 1) {
    return undefined;
  }
  return {
    name: parentName,
    startLine,
    children: elementChildren as ElementAst[],
  };
}

/**
 * Returns the parent element of the given element if it exists, undefined else.
 * @param element - the current element
 * @param parents - array of parent elements
 */
export function getElementParent(
  element: ElementAst,
  parents: ParentElement[],
): ParentElement | undefined {
  const elementStartLine = element.sourceSpan.start.line;
  let matchingGroup;
  parents.forEach(group => {
    // Get the parent with the highest start line number that is still below the
    // start line number of the current element.
    // Groups are sorted by startLine (see addParentElement function).
    if (group.startLine <= elementStartLine) {
      matchingGroup = group;
    }
  });

  if (matchingGroup) {
    const match = findMatch(matchingGroup, element);
    if (match) {
      return matchingGroup;
    }
  }

  return undefined;
}

/**
 * Checks if the current element is a child of one of the given parent elements (form fields).
 * Returns whether the form field contains a dt-label element.
 * @param element - the current element
 * @param parents - array of parent elements
 * @returns Whether the parent element contains a dt-label.
 */
export function hasFormFieldParentWithLabel(
  element: ElementAst,
  parents: ParentElement[],
): boolean {
  // If the element has a (form field) parent, check if it contains a dt-label element.
  const parentMatch = getElementParent(element, parents);
  if (parentMatch) {
    const hasDtLabel = parentMatch.children.find(
      child => child.name === 'dt-label',
    );
    if (hasDtLabel) {
      return true;
    }
  }

  return false;
}
