export interface childNode {
  name: string;
  level: number;
}

/**
 * Finds children of a given element by name and collects information about the nested level.
 */
export function findChild(element: any, childName: string, level: number, foundChildren: childNode[]): void {
  if (element.name && element.name === childName) {
    foundChildren.push({
      name: childName,
      level,
    });
  } 

  if (element.children && element.children.length > 0) {
    const newLevel = level + 1;
    let noOfChildren = element.children.length;
    for (let i = 0; i < noOfChildren; i++) {
      findChild(element.children[i], childName, newLevel, foundChildren);
    }
  }
}
