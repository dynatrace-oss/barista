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
 */
export function findChild(element: any, childName: string, level: number, foundChildren: ChildNode[]): void {
  if (element.name && element.name === childName) {
    foundChildren.push({
      name: childName,
      level,
    });
  }

  if (element.children && element.children.length > 0) {
    const newLevel = increaseLevel(element, level);
    const noOfChildren = element.children.length;
    for (let i = 0; i < noOfChildren; i++) {
      findChild(element.children[i], childName, newLevel, foundChildren);
    }
  }
}

export function findChildByAttribute(element: any, attrName: string, level: number, foundChildren: ChildNode[]): void {
  if (element.attrs && (element.attrs as AttrAst[]).find(attr => attr.name === attrName)) {
    foundChildren.push({
      name: attrName,
      level,
    });
  }

  if (element.children && element.children.length > 0) {
    const newLevel = increaseLevel(element, level);
    const noOfChildren = element.children.length;
    for (let i = 0; i < noOfChildren; i++) {
      findChildByAttribute(element.children[i], attrName, newLevel, foundChildren);
    }
  }
}
