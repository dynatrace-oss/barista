/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
