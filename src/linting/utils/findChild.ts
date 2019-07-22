import { AttrAst, EmbeddedTemplateAst } from '@angular/compiler';

export interface ChildNode {
  name: string;
  level: number;
}

/**
 * Increases level if element is not instance of EmbeddedTemplateAst.
 * @param element - Element to check.
 * @param level – Current level.
 */
function increaseLevel(element: any, level: number): number {
  if (element instanceof EmbeddedTemplateAst) {
    return level;
  }
  return level + 1;
}

/**
 * Finds children of a given element by name and collects information about the nested level.
 * @param element - the current element.
 * @param childName - the element name to search for.
 * @param level - the current level.
 * @returns array of found child nodes.
 */
export function findChild(
  element: any,
  childName: string,
  level: number,
): ChildNode[] {
  if (element.name && element.name === childName) {
    return [
      {
        name: childName,
        level,
      },
    ];
  }

  let children: ChildNode[] = [];
  if (element.children && element.children.length > 0) {
    const newLevel = increaseLevel(element, level);
    const noOfChildren = element.children.length;
    for (let i = 0; i < noOfChildren; i++) {
      children = children.concat(
        findChild(element.children[i], childName, newLevel),
      );
    }
  }
  return children;
}

/**
 * Finds children of a given element by attribute and collects information about the nested level.
 * @param element - the current element.
 * @param attrName - the attribute name to search for.
 * @param level - the current level.
 * @returns array of found child nodes.
 */
export function findChildByAttribute(
  element: any,
  attrName: string,
  level: number,
): ChildNode[] {
  if (
    element.attrs &&
    (element.attrs as AttrAst[]).find(attr => attr.name === attrName)
  ) {
    return [
      {
        name: attrName,
        level,
      },
    ];
  }

  let children: ChildNode[] = [];
  if (element.children && element.children.length > 0) {
    const newLevel = increaseLevel(element, level);
    const noOfChildren = element.children.length;
    for (let i = 0; i < noOfChildren; i++) {
      children = children.concat(
        findChildByAttribute(element.children[i], attrName, newLevel),
      );
    }
  }
  return children;
}
