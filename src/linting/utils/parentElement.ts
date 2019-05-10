import { ElementAst } from '@angular/compiler';

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
function findMatch(parent: ParentElement, element: ElementAst): ElementAst | undefined {
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

/**
 * Adds the given element to the array of parent elements, selected by name.
 * The children array is additionally filtered when the name of the child elements is given.
 * @param element - the current element
 * @param parents - array of parent elements
 * @param parentName - name of the parent element
 * @param childName - name of the children elements that should be added to the parent's children
 * @returns the new array of parent elements
 */
export function addParentElement(element: ElementAst, parents: ParentElement[], parentName: string, childName?: string): ParentElement[] {
  const startLine = element.sourceSpan.start.line;
  const elementChildren = element.children
    .filter((child) => child instanceof ElementAst)
    // Return only children with name when given.
    .filter((child) => childName ? (child as ElementAst).name === childName : true);
  if (elementChildren.length) {
    parents.push({
      name: parentName,
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

/**
 * Returns the parent element of the given element if it exists, undefined else.
 * @param element - the current element
 * @param parents - array of parent elements
 */
export function getElementParent(element: ElementAst, parents: ParentElement[]): ParentElement | undefined {
  const elementStartLine = element.sourceSpan.start.line;
  let matchingGroup;
  parents.forEach((group) => {
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
export function hasFormFieldParentWithLabel(element: ElementAst, parents: ParentElement[]): boolean {
  // If the element has a (form field) parent, check if it contains a dt-label element.
  const parentMatch = getElementParent(element, parents);
  if (parentMatch) {
    const hasDtLabel = parentMatch.children.find((child) => child.name === 'dt-label');
    if (hasDtLabel) {
      return true;
    }
  }

  return false;
}
